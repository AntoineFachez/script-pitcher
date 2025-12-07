import fitz
import sys
import json
import math

def get_rotation_from_matrix(matrix):
    """Calculates rotation angle in degrees from a fitz.Matrix."""
    if not isinstance(matrix, fitz.Matrix):
        return 0
    return int(math.degrees(math.atan2(matrix.b, matrix.a)) % 360)

def analyze_pdf_page(pdf_path, page_num=0):
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    if page_num >= len(doc):
        print(f"Error: Page {page_num} not found. PDF has {len(doc)} pages.")
        return

    page = doc[page_num]
    
    print(f"--- Forensic Analysis of Page {page_num + 1} ---")
    print(f"File: {pdf_path}")
    
    # 1. Page Boundaries
    page_boundaries = {
        "MediaBox": list(page.mediabox),
        "CropBox": list(page.cropbox),
        "TrimBox": list(page.trimbox),
        "ArtBox": list(page.artbox),
        "Rotation": page.rotation
    }
    print(f"\nPage Boundaries:\n{json.dumps(page_boundaries, indent=2)}")

    # 2. Get Drawings (for clipping paths and fills)
    drawings = page.get_drawings()
    clipping_paths = [fitz.Rect(d["rect"]) for d in drawings if d["type"] == "clip"]
    
    # 3. Get BBox Log (for rendering order and visibility)
    try:
        bbox_log = page.get_bboxlog()
    except Exception as e:
        print(f"Warning: Could not get bboxlog: {e}")
        bbox_log = []

    # 4. Get Image Info
    image_info_list = page.get_image_info(xrefs=True)
    
    images_report = []

    print(f"\nFound {len(image_info_list)} images on page. Analyzing...")

    for index, info in enumerate(image_info_list):
        xref = info["xref"]
        if not xref: continue
        
        report = {
            "id": f"img_{index}",
            "xref": xref,
            "smask": info.get("smask", None),
        }

        # --- Intrinsic vs Display ---
        try:
            base_img = doc.extract_image(xref)
            if not base_img:
                report["error"] = "Could not extract image bytes"
                images_report.append(report)
                continue
                
            intrinsic_w = base_img["width"]
            intrinsic_h = base_img["height"]
            report["intrinsic_dims"] = {"width": intrinsic_w, "height": intrinsic_h}
            
            display_rect = fitz.Rect(info["bbox"])
            report["display_rect"] = {"x0": display_rect.x0, "y0": display_rect.y0, "x1": display_rect.x1, "y1": display_rect.y1, "width": display_rect.width, "height": display_rect.height}
            
            # Transform Matrix
            if "transform" in info:
                matrix = fitz.Matrix(info["transform"])
                report["transform"] = list(info["transform"])
                report["rotation_calculated"] = get_rotation_from_matrix(matrix)

            # Aspect Ratio Check
            intrinsic_ratio = intrinsic_w / intrinsic_h if intrinsic_h else 0
            display_ratio = display_rect.width / display_rect.height if display_rect.height else 0
            
            distortion = False
            if intrinsic_ratio > 0 and display_ratio > 0:
                distortion = abs(intrinsic_ratio - display_ratio) > 0.05 # 5% tolerance

            report["aspect_ratio"] = {
                "intrinsic": round(intrinsic_ratio, 3),
                "display": round(display_ratio, 3),
                "distortion_detected": distortion
            }
        except Exception as e:
            report["error"] = f"Exception during basic analysis: {str(e)}"
            images_report.append(report)
            continue

        # --- Clipping Path Detection ---
        intersecting_clips = []
        visible_rect = display_rect
        
        for i, clip in enumerate(clipping_paths):
            if clip.intersects(display_rect):
                intersection = display_rect.intersect(clip)
                # Only count if it actually reduces the area significantly
                if intersection.get_area() < display_rect.get_area() * 0.99:
                    intersecting_clips.append({
                        "clip_index": i,
                        "clip_rect": list(clip),
                        "intersection_rect": list(intersection)
                    })
                    # Refine visible rect (accumulate intersections)
                    visible_rect = visible_rect.intersect(clip)

        # Also clip to page cropbox
        visible_rect = visible_rect.intersect(page.cropbox)

        report["clipping"] = {
            "intersecting_paths_count": len(intersecting_clips),
            "visible_rect": {"x0": visible_rect.x0, "y0": visible_rect.y0, "x1": visible_rect.x1, "y1": visible_rect.y1, "width": visible_rect.width, "height": visible_rect.height}
        }

        # --- Drawing Fills ---
        # Check if this xref is used as a fill in any drawing
        is_fill = False
        fill_rects = []
        for d in drawings:
            if "fill_images" in d and d["fill_images"] and xref in d["fill_images"]:
                is_fill = True
                fill_rects.append(list(d["rect"]))
        
        report["is_drawing_fill"] = is_fill
        if is_fill:
            report["fill_rects"] = fill_rects
            # If it's a fill, the visible rect is likely the fill rect
            # We take the largest fill rect as the primary visible area for this check
            if fill_rects:
                # Simplified: just take the first one for the report
                # In reality, one image could fill multiple shapes
                pass

        # --- Hidden Pixels Detection ---
        visible_area = visible_rect.get_area()
        display_area = display_rect.get_area()
        
        report["visibility_analysis"] = {
            "display_area": round(display_area, 2),
            "visible_area": round(visible_area, 2),
            "visible_percent": round((visible_area / display_area) * 100, 1) if display_area > 0 else 0
        }

        if display_area > 0 and (visible_area / display_area) < 0.95:
            report["HIDDEN_PIXELS_DETECTED"] = True
            report["hidden_reason"] = "Clipped by vector path or page boundary"
        
        if is_fill:
             # Fills are by definition masked by the shape
             report["HIDDEN_PIXELS_DETECTED"] = True
             report["hidden_reason"] = "Image used as fill pattern"

        # --- Z-Index / Layering Context ---
        # Find where this image appears in the bbox log
        layer_context = []
        for i, (type_name, rect_tuple) in enumerate(bbox_log):
            if type_name == "fill-image":
                r = fitz.Rect(rect_tuple)
                # Match by approximate overlap since bboxlog rects might slightly differ due to rounding
                inter = r.intersect(display_rect)
                if inter.get_area() >= r.get_area() * 0.95:
                     # Look at previous items for clips
                     preceding = []
                     for j in range(max(0, i-5), i):
                         preceding.append(f"{bbox_log[j][0]} {bbox_log[j][1]}")
                     
                     context = {
                         "log_index": i,
                         "rect": list(r),
                         "preceding_ops": preceding
                     }
                     layer_context.append(context)
        
        report["layer_context"] = layer_context

        images_report.append(report)

    print("\n--- Image Analysis Report ---")
    print(json.dumps(images_report, indent=2))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_pdf_images.py <pdf_path> [page_num]")
    else:
        pdf_path = sys.argv[1]
        page_num = int(sys.argv[2]) if len(sys.argv) > 2 else 0
        analyze_pdf_page(pdf_path, page_num)
