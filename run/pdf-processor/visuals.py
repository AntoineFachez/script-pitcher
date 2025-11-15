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
    if not isinstance(matrix, fitz.Matrix):
        print("Warning: Invalid matrix passed to get_rotation_from_matrix. Returning 0.")
        return 0
    a, b, c, d, _, _ = matrix
    tol = 0.01
    # Check for simple rotations first
    if abs(a - 1) < tol and abs(d - 1) < tol and abs(b) < tol and abs(c) < tol: return 0    # 0 degrees
    if abs(a) < tol and abs(d) < tol and abs(b - 1) < tol and abs(c + 1) < tol: return 90   # 90 degrees
    if abs(a + 1) < tol and abs(d + 1) < tol and abs(b) < tol and abs(c) < tol: return 180  # 180 degrees
    if abs(a) < tol and abs(d) < tol and abs(b + 1) < tol and abs(c - 1) < tol: return 270  # 270 degrees

    # Fallback using atan2
    angle = math.degrees(math.atan2(b, a))
    # Normalize angle
    final_angle = round(angle) % 360
    # Snap to common angles if close
    if abs(final_angle - 90) < 1: return 90
    if abs(final_angle - 180) < 1: return 180
    if abs(final_angle - 270) < 1: return 270
    if abs(final_angle) < 1 or abs(final_angle - 360) < 1 : return 0
    return final_angle
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

        # Filter out giant white background rectangles
        is_white_background = (path.get("fill") == (1.0, 1.0, 1.0) and
                               path.get("fill_opacity", 1.0) == 1.0 and
                               bbox.get_area() > page_area * 0.90)
        if is_white_background:
            continue
        
        # Filter out clipping paths (they aren't visible)
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

        # --- 1. CHECK FOR "STROKED" LINES ---
        if stroke_color and line_width > 0:
            scale_factor = 1.0 # Default
            derotation_matrix = page.derotation_matrix
            if isinstance(derotation_matrix, fitz.Matrix):
                 scale_factor = abs(derotation_matrix.a) if abs(derotation_matrix.a) > 0.01 else 1.0

            # Check for horizontal lines
            if bbox.height < max(line_width * 2, 2) and bbox.width > bbox.height * 3:
                 element_data["type"] = "line"
                 element_data["strokeColor"] = stroke_color
                 element_data["strokeWidth"] = line_width * scale_factor
                 is_line = True
            # Check for vertical lines
            elif bbox.width < max(line_width * 2, 2) and bbox.height > bbox.width * 3:
                 element_data["type"] = "line"
                 element_data["strokeColor"] = stroke_color
                 element_data["strokeWidth"] = line_width * scale_factor
                 is_line = True
            # else: it's a stroked path, but not a straight line (e.g. curve)
            # We are ignoring these for now, but you could add a "shape" type here.

        # --- 2. CHECK FOR "FILLED" ELEMENTS (SHAPES & FILLED LINES) ---
        fill_color = rgb_to_hex(path.get("fill"))
        fill_opacity = path.get("fill_opacity", 1.0)

        if not is_line and fill_color:
            # It's a filled element. Is it a line?
            # Use a small pixel threshold (e.g., 2.0) for "thin"
            
            # Check for horizontal filled-rectangle (like your pink line)
            if bbox.height < 2.0 and bbox.width > bbox.height * 3:
                element_data["type"] = "line"
                element_data["strokeColor"] = fill_color  # Use fill color as the "stroke"
                element_data["strokeWidth"] = bbox.height # Use the rect's height
                is_line = True 
            
            # Check for vertical filled-rectangle
            elif bbox.width < 2.0 and bbox.height > bbox.width * 3:
                element_data["type"] = "line"
                element_data["strokeColor"] = fill_color
                element_data["strokeWidth"] = bbox.width
                is_line = True
                
            # It's a regular filled shape
            else:
                element_data["type"] = "shape"
                element_data["backgroundColor"] = fill_color
                element_data["opacity"] = fill_opacity
                is_shape = True

        # --- 3. ADD THE ELEMENT TO THE LIST ---
        if is_line or is_shape:
            vector_elements.append(element_data)
            z_counter += 1
        # else: (it has no stroke and no fill)
             # continue (we already handled this with the main if/elif)

    return vector_elements, z_counter

def process_images(doc, page, image_bucket, document_id, z_counter):
    """
    Extracts raster images from a page, uploads them, and calculates crop/transform.
    Returns a list of image elements and the updated z_counter.
    """
    image_elements = []
    page_cropbox = page.cropbox
    image_info_list = page.get_image_info(xrefs=True)

    for img_index, info in enumerate(image_info_list):
        xref = info["xref"]
        smask = info.get("smask", 0)
        pix1 = mask = pix_with_mask = None # For finally block
        try:
            # --- Image Bytes Extraction ---
            if smask > 0:
                try:
                    pix1 = fitz.Pixmap(doc.extract_image(xref)["image"])
                    mask = fitz.Pixmap(doc.extract_image(smask)["image"])
                    pix_with_mask = fitz.Pixmap(pix1, mask)
                    image_bytes = pix_with_mask.tobytes("png")
                    image_ext = "png"
                except Exception as mask_err:
                     print(f"Warning: Failed processing smask {smask} for image {xref}. Falling back. Error: {mask_err}")
                     base_image = doc.extract_image(xref)
                     image_bytes, image_ext = base_image["image"], base_image["ext"]
            else:
                base_image = doc.extract_image(xref)
                image_bytes, image_ext = base_image["image"], base_image["ext"]

            # --- Robust Cropping Logic ---
            full_pos_rect = fitz.Rect(info["bbox"])
            rendered_rects = page.get_image_rects(xref, transform=True)
            effective_crop_rect = None
            if rendered_rects:
                first_rect_data = rendered_rects[0]
                is_valid_rect_data = False
                if isinstance(first_rect_data, (list, tuple)) and len(first_rect_data) == 4:
                    if all(isinstance(coord, (int, float)) for coord in first_rect_data): is_valid_rect_data = True
                elif isinstance(first_rect_data, (list, tuple)) and len(first_rect_data) == 2 and isinstance(first_rect_data[0], fitz.Rect):
                     first_rect_data_rect = first_rect_data[0]
                     if isinstance(first_rect_data_rect, fitz.Rect): first_rect_data = tuple(first_rect_data_rect)
                     if isinstance(first_rect_data, (list, tuple)) and len(first_rect_data) == 4 and all(isinstance(coord, (int, float)) for coord in first_rect_data): is_valid_rect_data = True
                     else: print(f"Warning: Extracted Rect from (Rect, Matrix) for image {xref} is still not valid 4 numbers: {first_rect_data}")

                if is_valid_rect_data:
                    try:
                        rendered_rect = fitz.Rect(first_rect_data)
                        intersected_rect = rendered_rect.intersect(page_cropbox)
                        if not intersected_rect.is_empty and intersected_rect.is_valid: effective_crop_rect = intersected_rect
                        else: effective_crop_rect = rendered_rect
                    except Exception as rect_creation_err: print(f"Warning: Could not create fitz.Rect for image {xref}. Data: {first_rect_data}. Error: {rect_creation_err}")
                else:
                    if rendered_rects: print(f"Warning: Unexpected data format from get_image_rects for image {xref}. Got: {rendered_rects[0]}. Falling back.")
            else: print(f"Warning: page.get_image_rects returned empty list for image {xref}. Falling back.")

            if not effective_crop_rect or effective_crop_rect.is_empty or not effective_crop_rect.is_valid:
                 effective_crop_rect = full_pos_rect.intersect(page_cropbox)
                 if effective_crop_rect.is_empty or not effective_crop_rect.is_valid: effective_crop_rect = full_pos_rect


            # --- Robust Matrix, Rotation & Flip Logic ---
            rotation = 0
            is_flipped_horizontal = False
            is_flipped_vertical = False
            transform_matrix = None
            transform_data = info.get("transform")
            is_valid_matrix_data = False
            
            if isinstance(transform_data, (list, tuple)) and len(transform_data) == 6:
                 if all(isinstance(val, (int, float)) for val in transform_data): is_valid_matrix_data = True

            if is_valid_matrix_data:
                try:
                    transform_matrix = fitz.Matrix(info["transform"])
                    rotation = get_rotation_from_matrix(transform_matrix)
                    is_flipped_horizontal = transform_matrix.d < 0
                    is_flipped_vertical = transform_matrix.a < 0
                    
                    # det = transform_matrix.det # Safe to access here
                    # if det != 0:
                    #      if det < 0:
                            
                            # if rotation in [0, 180]:
                            #    is_flipped_horizontal = transform_matrix.c > 0
                            #    is_flipped_vertical = transform_matrix.b > 0
                            # elif rotation in [90, 270]:
                            #    is_flipped_horizontal = transform_matrix.d < 0
                            #    is_flipped_vertical = transform_matrix.a < 0

                except Exception as matrix_creation_err:
                     print(f"Warning: Could not create/process fitz.Matrix for image {xref}. Data: {transform_data}. Error: {matrix_creation_err}")
                else:
                    print(f"Warning: Invalid or missing 'transform' data for image {xref}. Found: {transform_data}. Using default rotation/flips.")


            # --- Upload Logic ---
            image_filename = f"{document_id}/page{page.number + 1}_img{img_index}.{image_ext}"
            blob = image_bucket.blob(image_filename)
            blob.upload_from_string(image_bytes, content_type=f"image/{image_ext}")
            public_url = f"https://storage.googleapis.com/{image_bucket.name}/{image_filename}"

            image_element = {
                "type": "image", "src": public_url,
                "position": {'x0': full_pos_rect.x0, 'y0': full_pos_rect.y0, 'x1': full_pos_rect.x1, 'y1': full_pos_rect.y1},
                "crop": {'x0': effective_crop_rect.x0, 'y0': effective_crop_rect.y0, 'x1': effective_crop_rect.x1, 'y1': effective_crop_rect.y1},
                "rotation": rotation, "isFlippedHorizontal": is_flipped_horizontal, "isFlippedVertical": is_flipped_vertical,
                "zIndex": z_counter
            }

            image_elements.append(image_element)
            z_counter += 1

        except Exception as e:
            print(f"Error processing image xref {xref} on page {page.number + 1}. Error: {e}")
        finally:
             # Ensure Pixmaps are cleared from memory
             pix1 = mask = pix_with_mask = None

    # No need to sort images separately
    return image_elements, z_counter
