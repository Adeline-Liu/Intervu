from PyPDF2 import PdfReader


def read_pdf(file_path):
    content = ""
    try:
        with open(file_path, "rb") as file:
            reader = PdfReader(file)
            for page in reader.pages:
                content += page.extract_text()
    except Exception as e:
        print(f"Error reading PDF {file_path}: {e}")
    return content