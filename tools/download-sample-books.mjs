// Sample Bible Books Download Script (ES Module Version)
// This script downloads a few key Bible books from the API
// as a demonstration of the complete Bible download process

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisified functions
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Settings
const SOURCE_DIR = path.join(__dirname, 'source');
const OUTPUT_FILE = path.join(SOURCE_DIR, 'sample-books.json');
const BIBLE_API_URL = 'https://bible-api.com/';

// Sample books to download (key books with varying lengths and formats)
const SAMPLE_BOOKS = [
  { name: 'Genesis', shortName: 'GEN', chapters: [1, 2, 3] },  // Creation narrative
  { name: 'Psalms', shortName: 'PSA', chapters: [1, 23, 119] }, // Famous Psalms
  { name: 'John', shortName: 'JHN', chapters: [1, 3] },        // Gospel intro and John 3:16
  { name: 'Romans', shortName: 'ROM', chapters: [1, 8] }       // Theological sections
];

// Create a function to fetch Bible content from the API
function fetchBibleContent(book, chapter) {
  return new Promise((resolve, reject) => {
    const reference = `${book} ${chapter}`;
    const url = `${BIBLE_API_URL}${encodeURIComponent(reference)}?translation=web`;
    
    console.log(`Fetching ${reference}...`);
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (e) {
          reject(new Error(`Failed to parse data for ${reference}: ${e.message}`));
        }
      });
      
    }).on('error', (err) => {
      reject(new Error(`Error fetching ${reference}: ${err.message}`));
    });
  });
}

// Process Bible content into our format
function processBibleContent(content, book, chapter) {
  if (!content || !content.verses || !content.verses.length) {
    console.error(`No verses found for ${book} ${chapter}`);
    return {};
  }
  
  const verses = {};
  
  content.verses.forEach(verse => {
    verses[verse.verse] = verse.text.trim();
  });
  
  return verses;
}

// Main function to download the sample books
async function downloadSampleBooks() {
  // Ensure source directory exists
  try {
    await mkdir(SOURCE_DIR, { recursive: true });
    console.log('Source directory created successfully.');
  } catch (err) {
    console.error('Error creating directory:', err);
    return;
  }
  
  const bibleData = {};
  
  // Process each book
  for (let bookIndex = 0; bookIndex < SAMPLE_BOOKS.length; bookIndex++) {
    const book = SAMPLE_BOOKS[bookIndex];
    const bookName = book.name;
    console.log(`Processing book ${bookIndex + 1}/${SAMPLE_BOOKS.length}: ${bookName}`);
    
    bibleData[bookName] = {};
    
    // Process selected chapters in the book
    for (let i = 0; i < book.chapters.length; i++) {
      const chapterNum = book.chapters[i];
      try {
        // Fetch chapter content from the API
        const chapterContent = await fetchBibleContent(bookName, chapterNum);
        
        // Process into our required format
        const verses = processBibleContent(chapterContent, bookName, chapterNum);
        
        if (Object.keys(verses).length > 0) {
          bibleData[bookName][chapterNum] = verses;
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error processing ${bookName} ${chapterNum}:`, error);
      }
    }
  }
  
  // Write the sample Bible data to file
  try {
    await writeFile(OUTPUT_FILE, JSON.stringify(bibleData, null, 2));
    console.log(`Sample Bible books written to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Error writing Bible data:', err);
  }
}

// Main execution
async function main() {
  console.log('Starting sample Bible books download...');
  
  try {
    await downloadSampleBooks();
    console.log('Sample Bible books download and processing complete!');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Run the script
main();