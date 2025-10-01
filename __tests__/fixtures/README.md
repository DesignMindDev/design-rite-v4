# Test Fixtures for Spatial Studio API Tests

## Required Test Files

Add these files to this directory for testing:

### 1. sample_floorplan.pdf
- **Purpose:** Valid floor plan for upload happy path test
- **Requirements:**
  - PDF or PNG format
  - Size < 10MB
  - Should contain recognizable floor plan (walls, doors, windows)
- **Where to get:** Use any architectural floor plan or sketch

### 2. large_file.pdf
- **Purpose:** Test file size limit validation (should reject)
- **Requirements:**
  - Size > 10MB
  - Any PDF content is fine
- **How to create:**
  ```bash
  # Option 1: Use a large PDF you have
  # Option 2: Create dummy large file
  dd if=/dev/zero of=large_file.pdf bs=1M count=11
  ```

### 3. invalid_file.txt
- **Purpose:** Test file type validation (should reject)
- **Requirements:**
  - .txt extension (not PDF/PNG/JPG)
  - Any text content
- **How to create:**
  ```bash
  echo "This is not a floor plan" > invalid_file.txt
  ```

### 4. sample_photo.jpg
- **Purpose:** Test annotation photo upload
- **Requirements:**
  - JPG format
  - Size < 5MB
  - Any photo works (site photo, test image, etc.)
- **Where to get:** Any JPG image file

## Currently Missing

⚠️ These files are NOT checked into git (too large, test-only)

You need to add them manually before running tests:
- [ ] sample_floorplan.pdf
- [ ] large_file.pdf
- [ ] invalid_file.txt
- [ ] sample_photo.jpg

## Quick Setup

```bash
# Navigate to fixtures directory
cd __tests__/fixtures

# Create invalid file test
echo "Not a floor plan" > invalid_file.txt

# Create large file (11MB)
dd if=/dev/zero of=large_file.pdf bs=1M count=11

# Add your own floor plan and photo
# (Copy from Downloads, Desktop, etc.)
cp ~/Downloads/my_floorplan.pdf ./sample_floorplan.pdf
cp ~/Downloads/my_photo.jpg ./sample_photo.jpg
```

## Gitignore Note

These files are ignored in `.gitignore`:
```
__tests__/fixtures/*.pdf
__tests__/fixtures/*.jpg
__tests__/fixtures/*.png
```

This prevents large test files from bloating the repository.
