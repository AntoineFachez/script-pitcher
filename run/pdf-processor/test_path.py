from pathlib import Path

def test_path_parsing(full_storage_path):
    print(f"Testing path: {full_storage_path}")
    path = Path(full_storage_path)
    parts = path.parts
    
    if len(parts) != 6 or parts[1] != 'projects' or parts[3] != 'files' or parts[4] != 'upload' or parts[5] != 'file789.pdf':
        error_msg = f"Invalid path format: '{full_storage_path}'. Expected '{{userId}}/projects/{{projectId}}/files/{{fileId}}/upload/{{fileName}}.pdf'"
        print(error_msg)
        return

    user_id, project_id, file_id = parts[0], parts[2], parts[4]
    print(f"Success! User ID: {user_id}, Project ID: {project_id}, File ID: {file_id}")

# Test case
test_path_parsing("user123/projects/proj456/files/file789/upload/file789.pdf")
test_path_parsing("user123/projects/proj456/files/file789/file789.pdf")      # Should fail
