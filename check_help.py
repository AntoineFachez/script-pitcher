import pypdfium2 as pdfium
import sys

def check_help():
    print(help(pdfium.PdfPage.render))

if __name__ == "__main__":
    check_help()
