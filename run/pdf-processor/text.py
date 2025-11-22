import fitz  # PyMuPDF
import collections

def process_text(page, stylesheet, style_counter, z_counter):
    """
    Extracts all text elements from a page, including alignment and styles.
    Returns a list of text elements, the updated stylesheet, style_counter, and z_counter.
    """
    text_elements = []
    blocks = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)["blocks"]
    
    for block in blocks:
        if block['type'] == 0:  # Text block
            
            # --- START: ROBUST PARAGRAPH DETECTION (Per Block) --- #
            is_paragraph = False
            num_lines = len(block['lines'])
            
            # 1. Find the dominant font size in the block
            font_sizes = collections.Counter()
            for line in block.get('lines', []):
                for span in line.get('spans', []):
                    # Round the size to handle minor floating point differences
                    font_sizes[round(span['size'])] += 1
            
            dominant_font_size = 0
            if font_sizes:
                # Get the most common font size
                dominant_font_size = font_sizes.most_common(1)[0][0]

            # Heuristic: A "paragraph" is defined by size and presence of text.
            if num_lines > 0 and dominant_font_size < 20:
                is_paragraph = True
            # --- END: ROBUST PARAGRAPH DETECTION --- #
            
            
            # --- Alignment Logic (Per Block) ---
            alignment = "left"
            block_bbox = fitz.Rect(block['bbox'])
            tolerance = 2.0

            if len(block['lines']) > 1:
                is_justified = True
                for line in block['lines'][:-1]:
                    line_bbox = fitz.Rect(line['bbox'])
                    if abs(line_bbox.x0 - block_bbox.x0) > tolerance or abs(line_bbox.x1 - block_bbox.x1) > tolerance:
                        is_justified = False
                        break
                if is_justified:
                    alignment = "justify"

            if alignment != "justify" and block['lines']:
                line_bbox = fitz.Rect(block['lines'][0]['bbox'])
                gap_left = line_bbox.x0 - block_bbox.x0
                gap_right = block_bbox.x1 - line_bbox.x1
                if abs(gap_left - gap_right) < tolerance:
                    alignment = "center"
                elif gap_right < tolerance and gap_left > tolerance:
                    alignment = "right"
            
            # --- Span Processing (Per Span) ---
            for line in block["lines"]:
                for span in line["spans"]:
                    style_key = f"{span['font']}_{span['size']}_{span['color']}"
                    
                    # 1. Look up/create style
                    if style_key not in stylesheet:
                        new_style_id = f"style-{style_counter}"
                        stylesheet[style_key] = { 
                            "id": new_style_id, 
                            "fontFamily": span['font'], 
                            "fontSize": round(span['size']), 
                            "color": f"#{span['color']:06x}" 
                        }
                        style_counter += 1
                    
                    # 2. CRITICAL FIX: Assign style ID to local variable
                    # This guarantees 'style_id_str' is defined for the current span's scope.
                    style_id_str = stylesheet[style_key]["id"] 
                    
                    text_elements.append({
                        "type": "text", 
                        "content": span['text'], 
                        "styleId": style_id_str, # Use the defined local variable
                        "position": {'x0': span['bbox'][0], 'y0': span['bbox'][1], 'x1': span['bbox'][2], 'y1': span['bbox'][3]},
                        "textAlign": alignment,
                        "zIndex": z_counter,
                        "isParagraph": is_paragraph
                    })
            z_counter += 1
            
    # Assuming any line 111 logic that uses style_id_str was intended to be inside the span loop.
    return text_elements, stylesheet, style_counter, z_counter