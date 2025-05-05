#!/bin/bash
# Complete Bible Population Script
# This script orchestrates the entire Bible population process for the complete Bible

# Output directory for logs
mkdir -p logs

echo "Starting Complete Bible Population Process..."
echo "This will download the entire Bible, process sections, and integrate with the application."
echo

# Step 1: Download Complete Bible
echo "Step 1: Downloading the complete Bible from API..."
node tools/download-complete-bible.mjs | tee logs/download-complete.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Bible download failed."
  exit 1
fi
echo "Bible download complete."
echo

# Step 2: Process Sections
echo "Step 2: Processing Bible sections and creating structured content..."
node tools/process-sections.mjs | tee logs/process-sections.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Section processing failed."
  exit 1
fi
echo "Section processing complete."
echo

# Step 3: Integrate with the application
echo "Step 3: Integrating Bible content with the application..."
cp tools/integrate-bible-content.js tools/integrate-bible-content.mjs
node tools/integrate-bible-content.mjs | tee logs/integrate-complete.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "ERROR: Bible integration failed."
  exit 1
fi
echo "Bible integration complete."
echo

echo "Complete Bible population process complete!"
echo "The entire Bible content is now ready to use in the application."