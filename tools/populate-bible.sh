#!/bin/bash
# Complete Bible population script
# This script orchestrates the entire Bible population process

# Output directory for logs
mkdir -p logs

echo "Starting Bible population process..."
echo "This will download the Bible, convert it to our format, and integrate it with the application."
echo

# Step 1: Download the Bible
echo "Step 1: Downloading Bible content..."
# Rename the files to .mjs for ES modules
cp tools/download-bible.js tools/download-bible.mjs
node tools/download-bible.mjs | tee logs/download.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Bible download failed."
  exit 1
fi
echo "Bible download complete."
echo

# Step 2: Import the Bible
echo "Step 2: Importing Bible content into application format..."
cp tools/bible-import.js tools/bible-import.mjs
node tools/bible-import.mjs | tee logs/import.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Bible import failed."
  exit 1
fi
echo "Bible import complete."
echo

# Step 3: Integrate with the application
echo "Step 3: Integrating Bible content with the application..."
cp tools/integrate-bible-content.js tools/integrate-bible-content.mjs
node tools/integrate-bible-content.mjs | tee logs/integrate.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Bible integration failed."
  exit 1
fi
echo "Bible integration complete."
echo

echo "Bible population process complete!"
echo "The Bible content is now ready to use in the application."