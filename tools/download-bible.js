// Script to download the World English Bible (WEB) in JSON format
// This is a one-time script to get the Bible text data for our import process

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Source URL for the WEB Bible in JSON format
// Note: We're using an existing public domain Bible JSON source
const SOURCE_URL = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_web.json';

// Define output path
const SOURCE_DIR = path.join(__dirname, 'source');
const OUTPUT_FILE = path.join(SOURCE_DIR, 'web-bible.json');

// Create the source directory if it doesn't exist
async function ensureDirectory() {
  try {
    await mkdir(SOURCE_DIR, { recursive: true });
    console.log('Source directory created successfully.');
  } catch (err) {
    console.error('Error creating source directory:', err);
  }
}

// Download the Bible JSON file
function downloadBible() {
  return new Promise((resolve, reject) => {
    console.log(`Downloading Bible from: ${SOURCE_URL}`);
    
    https.get(SOURCE_URL, (response) => {
      // Check if the request was successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download Bible: ${response.statusCode}`));
        return;
      }
      
      // Collect data chunks
      let data = '';
      response.on('data', chunk => {
        data += chunk;
      });
      
      // Process the complete response
      response.on('end', () => {
        try {
          // Try parsing the data to validate it's proper JSON
          const bibleData = JSON.parse(data);
          
          // Save the data to file
          writeFile(OUTPUT_FILE, JSON.stringify(bibleData, null, 2))
            .then(() => {
              console.log(`Bible data saved to: ${OUTPUT_FILE}`);
              resolve(bibleData);
            })
            .catch(err => {
              console.error('Error writing Bible data to file:', err);
              reject(err);
            });
        } catch (err) {
          console.error('Error parsing Bible data:', err);
          reject(err);
        }
      });
    }).on('error', (err) => {
      console.error('Error downloading Bible:', err);
      reject(err);
    });
  });
}

// Process the downloaded Bible data to a format that can be imported by bible-import.js
async function processBibleData(bibleData) {
  try {
    // Format conversion if needed (adapt this to your source format)
    // For the github.com/thiagobodruk/bible format, we need to transform
    // from array of books to object with book names as keys
    
    // Check if the data is in array format
    if (Array.isArray(bibleData)) {
      console.log('Converting Bible data format...');
      
      const formattedData = {};
      
      // Process each book
      bibleData.forEach(book => {
        const bookName = book.name;
        formattedData[bookName] = {};
        
        // Process each chapter
        book.chapters.forEach((chapterVerses, chapterIndex) => {
          const chapterNum = chapterIndex + 1;
          formattedData[bookName][chapterNum] = {};
          
          // Process each verse
          chapterVerses.forEach((verseText, verseIndex) => {
            const verseNum = verseIndex + 1;
            formattedData[bookName][chapterNum][verseNum] = verseText;
          });
        });
      });
      
      // Save the formatted data
      await writeFile(OUTPUT_FILE, JSON.stringify(formattedData, null, 2));
      console.log('Bible data converted to the required format.');
      
      return formattedData;
    } else {
      // Data is already in the right format
      console.log('Bible data already in the required format.');
      return bibleData;
    }
  } catch (err) {
    console.error('Error processing Bible data:', err);
    throw err;
  }
}

// Main function
async function main() {
  try {
    // Ensure the source directory exists
    await ensureDirectory();
    
    // Download the Bible data
    const bibleData = await downloadBible();
    
    // Process the data if needed
    await processBibleData(bibleData);
    
    console.log('Bible download and processing complete!');
    console.log('Now you can run the bible-import.js script to import the Bible into the application format.');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Run the script
main();