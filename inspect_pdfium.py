import pypdfium2 as pdfium
import sys

def inspect_object(pdf_path):
    doc = pdfium.PdfDocument(pdf_path)
    page = doc[0]
    for obj in page.get_objects():
        print(f"Object Type: {obj.type}")
        print(f"Dir: {dir(obj)}")
        break

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect_object(sys.argv[1])
