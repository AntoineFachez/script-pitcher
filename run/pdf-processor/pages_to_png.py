import fitz

def render_pdf_page_to_png(pdf_path, page_num, output_file="output.png", zoom=2.0):
    """Renders a single PDF page to a high-resolution PNG image."""
    try:
        doc = fitz.open(pdf_path)
        if page_num >= len(doc):
            print(f"Error: Page {page_num} not found.")
            return

        page = doc.load_page(page_num)
        
        # Define a transformation matrix to increase resolution (DPI/Zoom)
        # zoom=2.0 means 200% resolution (2x width, 2x height)
        matrix = fitz.Matrix(zoom, zoom)
        
        # Get the Pixmap object (the actual image data)
        # Set alpha=True for PNGs to preserve transparency if applicable
        pix = page.get_pixmap(matrix=matrix, alpha=True)
        
        # Save the pixmap to a file
        pix.save(output_file)
        
        doc.close()
        print(f"Successfully rendered page {page_num + 1} to {output_file}")
        
    except Exception as e:
        print(f"An error occurred during rendering: {e}")