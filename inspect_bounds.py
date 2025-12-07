import pypdfium2 as pdfium
import sys

def inspect_page_bounds(pdf_path):
    doc = pdfium.PdfDocument(pdf_path)
    page = doc[24] # Page 25
    width = page.get_width()
    height = page.get_height()
    bbox = page.get_bbox()
    print(f"Page 25: Width={width}, Height={height}")
    print(f"BBox (MediaBox): {bbox}")
    
    # Check objects
    for i, obj in enumerate(page.get_objects()):
        if obj.type == 3: # FPDF_PAGEOBJ_IMAGE = 3
            bounds = obj.get_bounds()
            print(f"Image {i} Bounds: {bounds}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect_page_bounds(sys.argv[1])
