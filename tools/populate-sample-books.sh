#!/bin/bash
# Sample Bible Books Population Script
# This script orchestrates the Bible population process for a selection of key books

# Output directory for logs
mkdir -p logs

echo "Starting Sample Bible Books Population Process..."
echo "This will download a selection of key Bible books, process sections, and integrate with the application."
echo

# Step 1: Download Sample Bible Books
echo "Step 1: Downloading sample Bible books from API..."
node tools/download-sample-books.mjs | tee logs/download-sample.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Bible sample download failed."
  exit 1
fi
echo "Bible sample books download complete."
echo

# Step 2: Process Sections (modified to use sample books)
echo "Step 2: Processing Bible sections and creating structured content..."
# We need to make sure the process-sections.mjs script uses sample-books.json
cp tools/process-sections.mjs tools/process-sample-sections.mjs

# Replace the file path in the process-sections script
sed -i 's|web-bible.json|sample-books.json|g' tools/process-sample-sections.mjs

# Run the modified script
node tools/process-sample-sections.mjs | tee logs/process-sample-sections.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Sample section processing failed."
  exit 1
fi
echo "Sample section processing complete."
echo

# Step 3: Integrate with the application
echo "Step 3: Integrating Bible content with the application..."
cp tools/integrate-bible-content.js tools/integrate-bible-content.mjs
node tools/integrate-bible-content.mjs | tee logs/integrate-sample.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Bible integration failed."
  exit 1
fi
echo "Bible integration complete."
echo

echo "Sample Bible books population process complete!"
echo "The sample Bible content is now ready to use in the application."