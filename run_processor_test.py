import os
import sys
# Add the module path to sys.path
module_path = os.path.join(os.getcwd(), 'run', 'pdf-processor')
sys.path.append(module_path)

import pypdfium2 as pdfium
# Now we can import directly as if we were in that directory
from visuals import process_shapes_and_lines, process_images

class MockBucket:
    def __init__(self, name):
        self.name = name
    def blob(self, name):
        return MockBlob(name)

class MockBlob:
    def __init__(self, name):
        self.name = name
    def upload_from_string(self, data, content_type):
        print(f"Mock Upload: {self.name} ({len(data)} bytes) [{content_type}]")

def test_processor(pdf_path):
    doc = pdfium.PdfDocument(pdf_path)
    page = doc[24] # Page 25
    bucket = MockBucket("test-bucket")
    
    print("--- Running process_visuals ---")
    
    # pypdfium2 doesn't have get_bboxlog, so we skip that debug step
    
    shapes, z = process_shapes_and_lines(page, 0)
    images, z = process_images(doc, page, bucket, "test-doc-id", z)
    elements = shapes + images
    
    print(f"Processed {len(elements)} elements.")
    for i, el in enumerate(elements):
        print(f"[{i}] Type: {el['type']} | Z: {el['zIndex']}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        test_processor(sys.argv[1])
