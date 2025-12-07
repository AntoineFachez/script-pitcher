
import fitz  # PyMuPDF
import sys

def analyze_cropping_and_masks(pdf_path):
    """
    Analyzes a PDF to find images that are cropped, masked, or framed.
    Compares the visible 'Box' on the page vs. the underlying 'Image' dimensions.
    """
    doc = fitz.open(pdf_path)
    print(f"--- Analyzing: {pdf_path} ---\n")

    for page_num, page in enumerate(doc):
        print(f"\n--- Page {page_num + 1} ---")
        
        # 1. Analyze Drawings (Fills & Clips)
        drawings = page.get_drawings()
        clips = []
        image_fills = {} # xref -> [rects]
        
        print(f"Found {len(drawings)} vector drawings.")
        
        for i, draw in enumerate(drawings):
            d_rect = fitz.Rect(draw["rect"])
            d_type = draw.get("type")
            print(f"  [Drawing {i}] Type: '{d_type}' | Rect: {d_rect}")
            
            # Check for Clip
            if d_type == "clip":
                clips.append(d_rect)
            
            # Check for Image Fills
            if draw.get("fill_images"):
                for xref in draw["fill_images"]:
                    if xref not in image_fills:
                        image_fills[xref] = []
                    image_fills[xref].append(d_rect)
                    print(f"    -> IMAGE FILL for XREF {xref}")

        # 2. Analyze Images via get_image_info
        images = page.get_image_info(xrefs=True)
        if not images:
            print("No images found on this page.")
        else:
            print(f"Found {len(images)} images (via get_image_info).")

            for i, img in enumerate(images):
                xref = img['xref']
                bbox = fitz.Rect(img['bbox'])
                smask = img.get('smask', 0)
                
                print(f"\n  [Image {i+1}] XREF: {xref}")
                print(f"    • BBox (Page Coords): {bbox}")
                print(f"    • SMask: {smask}")
                
                # Check Strategy A: Image Fills
                if xref in image_fills:
                    print(f"    • ✅ MATCHED FILL MASK(S): {len(image_fills[xref])} found.")
                    for m_rect in image_fills[xref]:
                        inter = bbox.intersect(m_rect)
                        print(f"      - Mask Rect: {m_rect} | Intersection Area: {inter.get_area():.1f}")
                else:
                    print(f"    • ❌ No explicit fill mask found.")

                # Check Strategy B: Clipping Paths
                intersecting_clips = []
                for c_rect in clips:
                    if c_rect.intersects(bbox):
                        inter = bbox.intersect(c_rect)
                        intersecting_clips.append((c_rect, inter.get_area()))
                
                if intersecting_clips:
                    print(f"    • ⚠️  Intersecting Clips: {len(intersecting_clips)} found.")
                    # Sort by intersection area (descending)
                    intersecting_clips.sort(key=lambda x: x[1], reverse=True)
                    for c_rect, area in intersecting_clips:
                        pct_covered = (area / bbox.get_area()) * 100 if bbox.get_area() > 0 else 0
                        print(f"      - Clip Rect: {c_rect} | Overlap: {area:.1f} ({pct_covered:.1f}%)")
                else:
                    print(f"    • ℹ️  No intersecting clipping paths found.")

        # 3. Analyze Images via get_text("dict")
        print("\n  --- Images via get_text('dict') ---")
        text_dict = page.get_text("dict")
        for block in text_dict.get("blocks", []):
            if block.get("type") == 1: # Image block
                b_bbox = fitz.Rect(block["bbox"])
                b_image = block.get("image") # base64 or bytes? No, it's just metadata in dict usually?
                # In 'dict', image blocks have 'image' key which is the image content (bytes)
                # We want to see the bbox reported here.
                print(f"    • Block BBox: {b_bbox}")
                # ext = block.get("ext")
                # print(f"      - Ext: {ext}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_cropping_and_masks(sys.argv[1])
    else:
        print("Please provide a PDF path.")
