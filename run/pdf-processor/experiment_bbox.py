import fitz
import json

def create_dummy_pdf():
    doc = fitz.open()
    page = doc.new_page()
    # Draw a rectangle to serve as an "image" placeholder (we can't easily embed a real image without a file)
    # But we can insert a text and see if we can inspect text blocks, 
    # actually we need an image to test image blocks.
    # Let's try to insert a small generated image.
    
    img = fitz.Pixmap(fitz.csRGB, fitz.Rect(0, 0, 100, 100), False)
    img.clear_with(255) # White
    
    # Insert image
    page.insert_image(fitz.Rect(50, 50, 150, 150), pixmap=img)
    
    doc.save("dummy.pdf")
    return "dummy.pdf"

def inspect_dict_output(pdf_path):
    doc = fitz.open(pdf_path)
    page = doc[0]
    
    text_dict = page.get_text("dict")
    
    print("--- Blocks ---")
    for block in text_dict["blocks"]:
        if block["type"] == 1: # Image
            print("Found Image Block:")
            keys = list(block.keys())
            # Don't print the huge image bytes
            if "image" in keys:
                keys.remove("image")
                print(f"  Has 'image' bytes: True (len={len(block['image'])})")
            print(f"  Keys: {keys}")
            print(f"  BBox: {block['bbox']}")
            print(f"  Transform: {block.get('transform')}")
            # Check for xref
            if "xref" in block:
                print(f"  XREF: {block['xref']}")
            else:
                print("  XREF: Not found in block")

if __name__ == "__main__":
    pdf = create_dummy_pdf()
    inspect_dict_output(pdf)
