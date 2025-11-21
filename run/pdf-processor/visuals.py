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

        # Filter out large white background rectangles
        is_white_background = (path.get("fill") == (1.0, 1.0, 1.0) and
                               path.get("fill_opacity", 1.0) == 1.0 and
                               bbox.get_area() > page_area * 0.90)
        if is_white_background:
            continue
        
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
    Extracts raster images from a page, uploads them, and determines 
    the final visually cropped bounds and transformation data.
    
    The visually cropped bounds are determined by page.get_image_rects,
    which respects PDF clipping paths.
    """
    image_elements = []
    page_cropbox = page.cropbox
    image_info_list = page.get_image_info(xrefs=True)

    for img_index, info in enumerate(image_info_list):
        xref = info["xref"]
        if not xref: continue 

        smask = info.get("smask", 0)
        
        # --- 1. Image Bytes Extraction and Transparency Handling ---
        try:
            image_ext = "png" # Default ext if transparency is involved
            base_image = doc.extract_image(xref)
            image_bytes = None
            
            if smask > 0:
                # Handle images with transparency masks
                mask_image = doc.extract_image(smask)
                pix1 = fitz.Pixmap(doc, xref)
                mask = fitz.Pixmap(mask_image["image"])
                pix_with_mask = fitz.Pixmap(pix1, mask)
                image_bytes = pix_with_mask.tobytes("png")
                pix1 = mask = pix_with_mask = None 
            else:
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]

            if not image_bytes:
                 print(f"Warning: Image xref {xref} has empty bytes. Skipping.")
                 continue
            
            # --- 2. Determine Effective Crop Rectangle (Visual Bounds) ---
            full_pos_rect = fitz.Rect(info["bbox"])
            
            # CRITICAL: get_image_rects provides the visually correct BBOX after clipping
            rendered_rects = page.get_image_rects(xref, transform=True)
            
            if rendered_rects and isinstance(rendered_rects[0], tuple) and isinstance(rendered_rects[0][0], fitz.Rect):
                # Use the rect component from the first occurrence (Rect, Matrix) tuple
                rendered_rect = rendered_rects[0][0]
            else:
                # Fallback to the image BBOX from info
                rendered_rect = full_pos_rect

            effective_crop_rect = rendered_rect.intersect(page_cropbox)
            if effective_crop_rect.is_empty:
                effective_crop_rect = full_pos_rect 
            
            # --- 3. Transformation/Rotation Logic ---
            rotation = 0
            is_flipped_horizontal = False
            is_flipped_vertical = False
            
            transform_data = info.get("transform")
            if transform_data and len(transform_data) == 6:
                transform_matrix = fitz.Matrix(transform_data)
                rotation = get_rotation_from_matrix(transform_matrix)
                
                # Check determinant for mirroring/flipping (negative determinant = mirror)
                det = transform_matrix.a * transform_matrix.d - transform_matrix.b * transform_matrix.c
                if det < 0:
                    is_flipped_horizontal = True # Heuristic assumption for visual flip
                
            # --- 4. Upload Logic ---
            image_filename = f"{document_id}/page{page.number + 1}_img{img_index}.{image_ext}"
            blob = image_bucket.blob(image_filename)
            blob.upload_from_string(image_bytes, content_type=f"image/{image_ext}")
            public_url = f"https://storage.googleapis.com/{image_bucket.name}/{image_filename}"

            # --- 5. Build Element Data ---
            image_element = {
                "type": "image", "src": public_url,
                "position": {'x0': full_pos_rect.x0, 'y0': full_pos_rect.y0, 'x1': full_pos_rect.x1, 'y1': full_pos_rect.y1},
                # The 'crop' attribute now holds the precise visual dimensions.
                "crop": {'x0': effective_crop_rect.x0, 'y0': effective_crop_rect.y0, 'x1': effective_crop_rect.x1, 'y1': effective_crop_rect.y1}, 
                "rotation": rotation, 
                "isFlippedHorizontal": is_flipped_horizontal, 
                "isFlippedVertical": is_flipped_vertical, # Assumed False unless complex logic added
                "zIndex": z_counter
            }

            image_elements.append(image_element)
            z_counter += 1

        except Exception as e:
            print(f"Error processing image xref {xref} on page {page.number + 1}. Error: {e}")
        
    return image_elements, z_counter