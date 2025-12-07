# file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/RUN/PDF-PROCESSOR/VISUALS.PY

import fitz
import math

# --- Helper functions ---
def rgb_to_hex(rgb_tuple):
    # Converts (r, g, b) float tuple (0-1) to #RRGGBB hex string
    if not rgb_tuple or len(rgb_tuple) < 3: return None
    try:
        r, g, b = [max(0, min(255, int(c * 255))) for c in rgb_tuple[:3]]
        return f"#{r:02x}{g:02x}{b:02x}"
    except (TypeError, ValueError):
        print(f"Warning: Could not convert color tuple {rgb_tuple} to hex.")
        return None

def get_rotation_from_matrix(matrix):
    """Calculates rotation angle in degrees (0, 90, 180, 270) from a fitz.Matrix."""
    if not isinstance(matrix, fitz.Matrix):
        return 0
    a, b, _, _, _, _ = matrix # Only need 'a' and 'b' for rotation
    
    # Use atan2 for robust angle calculation
    angle = math.degrees(math.atan2(b, a))
    
    # Normalize and snap to the nearest 90-degree angle
    final_angle = round(angle / 90) * 90 % 360
    return int(final_angle)
# --- End Helper Functions ---


def process_shapes_and_lines(page, z_counter):
    """
    Extracts vector drawings (shapes and lines) from a page.
    This version correctly identifies thin filled rectangles as lines.
    Returns a list of vector elements and the updated z_counter.
    """
    vector_elements = []
    page_area = page.rect.get_area()
    drawings = page.get_drawings()

    for path in drawings:
        bbox = fitz.Rect(path.get("rect", (0,0,0,0)))
        if not bbox.is_valid or bbox.is_empty:
             continue

        # Juri's Fix: We must keep vector shapes that cover parts of the image.
        # This means removing the filtering of large white/background rectangles.
        # We will keep the filter for clipping paths, as they are non-visible PDF operators.

        # Filter out clipping paths (they aren't visible elements)
        if path.get("clip"):
            continue

        element_data = {
            "position": {'x0': bbox.x0, 'y0': bbox.y0, 'x1': bbox.x1, 'y1': bbox.y1},
            "zIndex": z_counter
        }

        is_line = False
        is_shape = False
        
        stroke_color = rgb_to_hex(path.get("color"))
        line_width = path.get("width", 0)

        # 1. CHECK FOR "STROKED" LINES
        if stroke_color and line_width > 0:
            
            if bbox.height < max(line_width * 2, 2) and bbox.width > bbox.height * 3:
                 element_data.update({"type": "line", "strokeColor": stroke_color, "strokeWidth": line_width})
                 is_line = True
            elif bbox.width < max(line_width * 2, 2) and bbox.height > bbox.width * 3:
                 element_data.update({"type": "line", "strokeColor": stroke_color, "strokeWidth": line_width})
                 is_line = True

        # 2. CHECK FOR "FILLED" ELEMENTS (Shapes & Filled Rectangular Lines)
        fill_color = rgb_to_hex(path.get("fill"))
        fill_opacity = path.get("fill_opacity", 1.0)

        if not is_line and fill_color:
            
            if bbox.height < 2.0 and bbox.width > bbox.height * 3:
                element_data.update({"type": "line", "strokeColor": fill_color, "strokeWidth": bbox.height})
                is_line = True 
            
            elif bbox.width < 2.0 and bbox.height > bbox.width * 3:
                element_data.update({"type": "line", "strokeColor": fill_color, "strokeWidth": bbox.width})
                is_line = True
                
            else:
                element_data.update({"type": "shape", "backgroundColor": fill_color, "opacity": fill_opacity})
                is_shape = True

        # 3. ADD THE ELEMENT TO THE LIST
        if is_line or is_shape:
            vector_elements.append(element_data)
            z_counter += 1

    return vector_elements, z_counter

def process_images(doc, page, image_bucket, document_id, z_counter):
    """
    Extracts raster images from a page using get_text("dict") to ensure correct
    visual bounding boxes (cropping) are respected.
    """
    image_elements = []
    
    # get_text("dict") provides a structured representation of the page content,
    # including image blocks with their final rendered bounding boxes.
    text_dict = page.get_text("dict")
    blocks = text_dict.get("blocks", [])

    for index, block in enumerate(blocks):
        if block["type"] != 1: # Type 1 is image
            continue
            
        try:
            # --- 1. Extract Basic Info ---
            # block['bbox'] is the visual bounding box (crop)
            bbox = fitz.Rect(block["bbox"])
            
            # block['image'] contains the image bytes
            image_bytes = block.get("image")
            image_ext = block.get("ext", "png")
            
            if not image_bytes:
                print(f"Warning: Image block {index} on page {page.number + 1} has no bytes. Skipping.")
                continue

            # --- 2. Transformation/Rotation Logic ---
            rotation = 0
            is_flipped_horizontal = False
            is_flipped_vertical = False
            
            # block['transform'] is a tuple (a, b, c, d, e, f)
            transform_data = block.get("transform")
            if transform_data and len(transform_data) == 6:
                transform_matrix = fitz.Matrix(transform_data)
                
                # Check determinant for mirroring/flipping (negative determinant = mirror)
                det = transform_matrix.a * transform_matrix.d - transform_matrix.b * transform_matrix.c
                if det < 0:
                    is_flipped_horizontal = True
                    # Apply the same fix as before: "undo" the horizontal flip component
                    # by inverting 'a' and 'c' before calculating rotation.
                    transform_matrix = fitz.Matrix(-transform_matrix.a, transform_matrix.b, -transform_matrix.c, transform_matrix.d, transform_matrix.e, transform_matrix.f)

                rotation = get_rotation_from_matrix(transform_matrix)

            # --- 3. Upload Logic ---
            # Since we don't have xrefs in get_text("dict"), we use page number and block index
            image_filename = f"{document_id}/page{page.number + 1}_block{index}.{image_ext}"
            blob = image_bucket.blob(image_filename)
            blob.upload_from_string(image_bytes, content_type=f"image/{image_ext}")
            public_url = f"https://storage.googleapis.com/{image_bucket.name}/{image_filename}"

            # --- 4. Build Element Data ---
            # For get_text("dict"), the bbox IS the crop.
            # We can treat the "full position" as the same as the crop for simplicity,
            # or if we wanted the intrinsic size we'd need more info, but for visual reproduction
            # using the bbox as both position and crop is usually sufficient and correct.
            
            image_element = {
                "type": "image", "src": public_url,
                "position": {'x0': bbox.x0, 'y0': bbox.y0, 'x1': bbox.x1, 'y1': bbox.y1},
                "crop": {'x0': bbox.x0, 'y0': bbox.y0, 'x1': bbox.x1, 'y1': bbox.y1}, 
                "rotation": rotation, 
                "isFlippedHorizontal": is_flipped_horizontal, 
                "isFlippedVertical": is_flipped_vertical,
                "zIndex": z_counter
            }

            image_elements.append(image_element)
            z_counter += 1

        except Exception as e:
            print(f"Error processing image block {index} on page {page.number + 1}. Error: {e}")
        
    return image_elements, z_counter