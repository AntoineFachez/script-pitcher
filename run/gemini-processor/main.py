# run/gemini-processor/main.py

import os
import traceback
import google.generativeai as genai
from google.cloud import firestore
import sys

# --- Event and Firestore Imports ---
try:
    from google.events.cloud.firestore_v1.types import DocumentEventData
    from google.cloud.firestore_v1.types.document import Document
except ImportError:
    print("Error: 'google-events' library not found.")
    print("Please add 'google-events' to your requirements.txt")
    sys.exit(1)

# --- *** NEW *** Custom AI Function Imports ---
from call_gemini_for_characters import call_gemini_for_characters
from call_gemini_for_episodes import call_gemini_for_episodes

# --- Configure Gemini ---
gemini_key = None # Initialize
try:
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_key:
        print("Warning: GEMINI_API_KEY environment variable not set.")
    else:
        genai.configure(api_key=gemini_key)
        print("Gemini API configured successfully.")
except Exception as e:
    print(f"Error configuring Gemini: {e}")

# --- Initialize Firestore client ---
db = firestore.Client()


# --- Main Function (now streamlined) ---
def process_ai_extraction(data, context) -> None:
    """
    Parses a binary protobuf 'DocumentEventData' payload from Eventarc.
    'data' is the raw HTTP request body (bytes).
    'context' is unused.
    
    Orchestrates extraction of characters and episodes.
    """
    
    doc_path = None # Initialize
    
    try:
        # 1. Parse payload (no change)
        if not isinstance(data, bytes):
            print(f"Error: Input data is type {type(data)}, not bytes. Exiting.")
            return
        
        event_data = DocumentEventData.deserialize(data)
        
        firestore_payload: Document = event_data.value
        
        if not firestore_payload:
            print("No 'value' field in event data (no 'after' state). Exiting.")
            return

        # 4. Get the full document path
        doc_path_full = firestore_payload.name
        if not doc_path_full:
            print("No 'name' (document path) in event. Exiting.")
            return
        
        path_parts = doc_path_full.split("/documents/")
        if len(path_parts) < 2:
            print(f"Could not parse relative path from: {doc_path_full}")
            return
        doc_path = path_parts[1]
        
        # 4b. Extract paths
        project_id = None
        file_id = None
        characters_collection_path = None
        episodes_collection_path = None 

        try:
            path_segments = doc_path.split('/')
            if len(path_segments) == 4 and path_segments[0] == 'projects' and path_segments[2] == 'files':
                project_id = path_segments[1]
                file_id = path_segments[3]
                characters_collection_path = f"projects/{project_id}/characters"
                episodes_collection_path = f"projects/{project_id}/episodes"
                print(f"Target project: {project_id}")
                print(f"Target chars collection: {characters_collection_path}")
                print(f"Target episodes collection: {episodes_collection_path}")
            else:
                raise ValueError("Path not in expected format 'projects/{id}/files/{id}/upload")
        except Exception as e:
            print(f"Error parsing project/file ID from path '{doc_path}': {e}")
        
        # 5. Access protobuf fields (no change)
        data_after = firestore_payload.fields
        
        if "status" not in data_after:
            print(f"No 'status' field in document {doc_path}. Skipping.")
            return

        status = data_after["status"].string_value
        
        if status != "AWAITING_AI":
            print(f"Status is not 'AWAITING_AI' (is '{status}'). Skipping.")
            return

        print(f"File {doc_path} triggered for AI extraction.")

        # 6. Access full text (no change)
        full_text = None
        if "processedData" in data_after and \
           "fullTextForAi" in data_after["processedData"].map_value.fields:
            
            full_text = data_after["processedData"].map_value.fields["fullTextForAi"].string_value
        
        if not full_text:
            print("No 'processedData.fullTextForAi' field found. Aborting.")
            db.document(doc_path).update({"status": "ERROR_NO_TEXT"})
            return

        # --- START MODIFICATION ---
        # 7. Check for enableAI flag
        enable_ai = True # Default to True for backward compatibility
        if "enableAI" in data_after:
            enable_ai = data_after["enableAI"].boolean_value
        
        extracted_characters = []
        extracted_episodes = []
        
        if enable_ai:
            print(f"AI Extraction ENABLED for {doc_path}. Calling Gemini...")
            extracted_characters = call_gemini_for_characters(full_text, gemini_key)
            extracted_episodes = call_gemini_for_episodes(full_text, gemini_key)
        else:
             print(f"AI Extraction DISABLED for {doc_path}. Skipping Gemini calls.")
        # --- END MODIFICATION ---
        
        
        # 8. Use a batch write (no change)
        batch = db.batch()

        # 9. Prepare the update for the original file document (no change)
        file_doc_ref = db.document(doc_path)
        file_update_data = {
            "status": "PROCESSED" if enable_ai else "SKIPPED_AI",
            "aiProcessedAt": firestore.SERVER_TIMESTAMP
        }
        batch.update(file_doc_ref, file_update_data)
        
        log_message = f"Set status to PROCESSED for {doc_path}."

      # 10. If characters were extracted, add them to the batch
        if extracted_characters and characters_collection_path:
            print(f"Found {len(extracted_characters)} characters. Writing to '{characters_collection_path}' collection.")
            
            # --- START MODIFICATION ---
            # Use enumerate() to get the 0-based index
            for index, char_data in enumerate(extracted_characters):
            # --- END MODIFICATION ---
            
                new_char_ref = db.collection(characters_collection_path).document()
                
                # Add context to the character data before saving
                char_data['projectId'] = project_id
                char_data['sourceFileId'] = file_id
                char_data['createdAt'] = firestore.SERVER_TIMESTAMP
                
                # --- START MODIFICATION ---
                char_data['orderIndex'] = index # Add the index to the doc
                # --- END MODIFICATION ---
                
                batch.set(new_char_ref, char_data)
                
            log_message += f" Wrote {len(extracted_characters)} new character documents."
        
        elif extracted_characters and not characters_collection_path:
             print(f"WARNING: Extracted {len(extracted_characters)} characters but could not determine target collection path.")
             batch.update(file_doc_ref, {"status": "ERROR_PATH_PARSE"})
        else:
            log_message += " No characters were extracted."

        # 11. If episodes were extracted, add them to the batch
        if extracted_episodes and episodes_collection_path:
            print(f"Found {len(extracted_episodes)} episodes. Writing to '{episodes_collection_path}' collection.")
            
            # --- START MODIFICATION ---
            # Use enumerate() to get the 0-based index
            for index, ep_data in enumerate(extracted_episodes):
            # --- END MODIFICATION ---
            
                new_ep_ref = db.collection(episodes_collection_path).document()
                
                # Add context to the episode data before saving
                ep_data['projectId'] = project_id
                ep_data['sourceFileId'] = file_id
                ep_data['createdAt'] = firestore.SERVER_TIMESTAMP
                
                # --- START MODIFICATION ---
                ep_data['orderIndex'] = index # Add the index to the doc
                # --- END MODIFICATION ---
                
                batch.set(new_ep_ref, ep_data)
                
            log_message += f" Wrote {len(extracted_episodes)} new episode documents."
        
        elif extracted_episodes and not episodes_collection_path:
             print(f"WARNING: Extracted {len(extracted_episodes)} episodes but could not determine target collection path.")
             batch.update(file_doc_ref, {"status": "ERROR_PATH_PARSE"})
        else:
            log_message += " No episodes were extracted."

        # 12. Commit all changes in the batch (no change)
        batch.commit()
        
        print(log_message)

    except Exception as e:
        print(f"Error during AI processing for: {e}")
        traceback.print_exc()
        try:
            if doc_path:
                db.document(doc_path).update({"status": f"ERROR_AI: {str(e)}"})
            else:
                print("doc_path not assigned, cannot update error status to document.")
        except Exception as update_err:
            print(f"Failed to update document to ERROR status: {update_err}")

    return