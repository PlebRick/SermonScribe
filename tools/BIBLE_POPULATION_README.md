# Bible Population Scripts

This directory contains scripts to download, process, and integrate the World English Bible (WEB) content into the SermonScribe application. The WEB is a public domain translation that we can freely use.

## Overview of Scripts

### Minimal Bible Data
- `minimal-bible-data.mjs`: Generates a minimal sample Bible dataset with Genesis 1-3 and Romans 1
- `populate-bible.sh`: Main script that orchestrates the minimal Bible population process

### Sample Bible Books
- `download-sample-books.mjs`: Downloads a selected set of Bible books (Genesis, Psalms, John, Romans)
- `populate-sample-books.sh`: Orchestrates the sample Bible books population process

### Complete Bible
- `download-complete-bible.mjs`: Basic script to download the complete Bible
- `download-complete-bible-robust.mjs`: Enhanced version with retry logic, rate-limiting, and progress tracking
- `populate-complete-bible.sh`: Orchestrates the complete Bible population process

### Processing Scripts
- `process-sections.mjs`: Processes Bible verses into sections with proper headings
- `integrate-bible-content.mjs`: Integrates the processed Bible content with the application

## Quick Start

For development and testing, use the minimal or sample Bible scripts:

```bash
# For minimal data (Genesis 1-3, Romans 1)
./populate-bible.sh

# For sample books (Genesis, Psalms, John, Romans - key chapters)
./populate-sample-books.sh
```

For production deployment with the complete Bible:

```bash
# This will take several hours due to API rate limits
./populate-complete-bible.sh
```

## How It Works

1. **Download**: The scripts fetch Bible content from the bible-api.com API which provides the WEB translation.

2. **Process**: Downloaded content is processed to add proper section headings and format it for the application.

3. **Integrate**: Processed content is integrated with the application, making it available for client-side use.

## Features

- **Resumable Downloads**: The robust downloader can resume from where it left off if interrupted
- **Progress Tracking**: Shows progress updates and estimated time remaining for long downloads
- **Automatic Sectioning**: Organizes verses into logical sections with proper headings
- **Rate Limiting**: Respects API limits to avoid being blocked

## Notes

- The complete Bible download process takes several hours due to API rate limiting
- A stable internet connection is required for the duration of the download
- Each script creates detailed logs in the 'logs' directory