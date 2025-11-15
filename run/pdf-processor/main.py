# run/pdf-processor/main.py

import os
import base64
import json
import fitz
import traceback
import time
import random
import re
from flask import Flask, request
from google.cloud import firestore, storage
from google.api_core.exceptions import NotFound
from pathlib import Path

# Import the refactored processing functions
from visuals import process_shapes_and_lines, process_images
from text import process_text

# --- GEMINI IMPORT AND FUNCTION ARE REMOVED ---

# --- Environment Variable Configuration & Client Initialization ---
PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
EXTRACTED_IMAGES_BUCKET = os.environ.get("EXTRACTED_IMAGES_BUCKET")

db = firestore.Client(project=PROJECT_ID)
storage_client = storage.Client(project=PROJECT_ID)
image_bucket = storage_client.bucket(EXTRACTED_IMAGES_BUCKET)
app = Flask(__name__)

# --- call_gemini_for_characters FUNCTION IS REMOVED ---

def process_pdf(pdf_bytes, project_id, file_id, original_file_name, bucket_name):
    """
    Orchestrates PDF processing and saves text for AI analysis.
    """
    print(f"Starting processing for file: {file_id} in project: {project_id}")
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    stylesheet = {}
    style_counter = 1
    pages_data = []
    
    all_plain_text_parts = [] 

    for page_num, page in enumerate(doc):
        print(f"Processing page {page_num + 1}/{len(doc)}")
        page_elements = []
        z_counter = 0

        # ... (visuals and text processing remains identical) ...
        # 1. Process vector drawings
        vector_elements, z_counter = process_shapes_and_lines(page, z_counter)
        page_elements.extend(vector_elements)

        # 2. Process images
        image_elements, z_counter = process_images(doc, page, image_bucket, file_id, z_counter)
        page_elements.extend(image_elements)

        # 3. Process text
        text_elements, stylesheet, style_counter, z_counter = process_text(page, stylesheet, style_counter, z_counter)
        page_elements.extend(text_elements)
        
        # --- Plain text extraction ---
        text_blocks = page.get_text("blocks")
        paragraphs = [block[4] for block in text_blocks if block[6] == 0]
        plain_text_content = "\n\n".join(paragraphs).strip()
        all_plain_text_parts.append(plain_text_content) 

        orientation = "landscape" if page.rect.width > page.rect.height else "portrait"
        page_elements.sort(key=lambda el: el.get('zIndex', 0))

        pages_data.append({
            "dimensions": {"width": page.rect.width, "height": page.rect.height},
            "orientation": orientation,
            "elements": page_elements,
            "plainText": plain_text_content
        })

    # --- NO LONGER CALLING GEMINI HERE ---
    full_text = "\n\n--- NEW PAGE ---\n\n".join(all_plain_text_parts)
    
    # --- MODIFIED FIRESTORE UPDATE ---
    doc_ref = db.collection("projects").document(project_id).collection("files").document(file_id)
    
    processed_data = {
        "status": "AWAITING_AI",  # <-- NEW STATUS
        "processedData": {
            "stylesheet": stylesheet,
            "pages": pages_data,
            "fullTextForAi": full_text  # <-- SAVE THE TEXT
            # The 'characters' field is NOT added here
        },
        "processedAt": firestore.SERVER_TIMESTAMP
    }
    try:
        # We use .update() here which merges fields.
        # This is safe even if the doc was just created.
        doc_ref.update(processed_data)
        print(f"Successfully processed PDF and saved text for AI analysis for file {file_id}.")
    except Exception as db_error:
        print(f"Error updating Firestore for file {file_id}: {db_error}")
        raise

# --- Flask app route (@app.route("/")) remains the same ---
@app.route("/", methods=["POST"])
def index():
    # ... (No changes to this function) ...
    event_data = request.get_json()
    if not event_data or "bucket" not in event_data or "name" not in event_data:
        print("Bad Request: Invalid CloudEvent format.")
        return ("Bad Request: Invalid CloudEvent format", 400)

    try:
        full_storage_path = event_data["name"]
        bucket_name = event_data["bucket"]

        if not full_storage_path.lower().endswith('.pdf'):
            print(f"File {full_storage_path} is not a PDF. Skipping.")
            return ("", 204)

        path = Path(full_storage_path)
        parts = path.parts
        if len(parts) != 5 or parts[1] != 'projects' or parts[3] != 'files':
            error_msg = f"Invalid path format: '{full_storage_path}'. Expected '{{userId}}/projects/{{projectId}}/files/{{fileName}}.pdf'"
            print(error_msg)
            return ("Bad Request: " + error_msg, 400)

        user_id, project_id, file_id = parts[0], parts[2], path.stem
        if not all([user_id, project_id, file_id]):
             print(f"Error: Could not parse IDs from path '{full_storage_path}'.")
             return ("Bad Request: One of the path components is empty.", 400)

        doc_ref = db.collection("projects").document(project_id).collection("files").document(file_id)
        doc = doc_ref.get()
        
        # Check for PROCESSED or AWAITING_AI to avoid re-processing
        if doc.exists and doc.to_dict().get("status") in ["PROCESSED", "AWAITING_AI"]:
            print(f"File {file_id} has already been processed or is awaiting AI. Skipping.")
            return ("", 204)

        pdf_bytes = None
        blob = storage_client.bucket(bucket_name).blob(full_storage_path)
        
        # ... (download logic remains the same) ...
        for attempt in range(3):
            try:
                pdf_bytes = blob.download_as_bytes()
                print(f"Successfully downloaded {full_storage_path} on attempt {attempt + 1}.")
                break
            except NotFound:
                if attempt < 2:
                    delay = (2 ** attempt) + random.uniform(0, 1)
                    print(f"File {full_storage_path} not found on attempt {attempt + 1}. Retrying in {delay:.2f} seconds...")
                    time.sleep(delay)
                else:
                    print(f"File {full_storage_path} not found after 3 attempts. Aborting.")
                    raise 
        if pdf_bytes is None:
             return ("Internal Server Error: Failed to download file after retries.", 500)

        process_pdf(pdf_bytes, project_id, file_id, full_storage_path, bucket_name)
        return ("", 204)

    except NotFound:
         print(f"File not found error persisted for: {event_data.get('name', 'N/A')}")
         return ("Not Found: Could not download the specified file.", 404)
    except Exception as e:
        print(f"Error processing message: {e}")
        traceback.print_exc()
        return ("Internal Server Error", 500)

# --- Flask app run command remains the same ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))