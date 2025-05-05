// Complete Bible Download Script (ES Module Version)
// This script downloads the World English Bible (WEB) from the API and processes it
// into our application format with proper section headings

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
const OUTPUT_FILE = path.join(SOURCE_DIR, 'web-bible.json');
const BIBLE_API_URL = 'https://bible-api.com/';

// Bible books configuration
const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis', shortName: 'GEN', chapters: 50 },
  { name: 'Exodus', shortName: 'EXO', chapters: 40 },
  { name: 'Leviticus', shortName: 'LEV', chapters: 27 },
  { name: 'Numbers', shortName: 'NUM', chapters: 36 },
  { name: 'Deuteronomy', shortName: 'DEU', chapters: 34 },
  { name: 'Joshua', shortName: 'JOS', chapters: 24 },
  { name: 'Judges', shortName: 'JDG', chapters: 21 },
  { name: 'Ruth', shortName: 'RUT', chapters: 4 },
  { name: '1 Samuel', shortName: '1SA', chapters: 31 },
  { name: '2 Samuel', shortName: '2SA', chapters: 24 },
  { name: '1 Kings', shortName: '1KI', chapters: 22 },
  { name: '2 Kings', shortName: '2KI', chapters: 25 },
  { name: '1 Chronicles', shortName: '1CH', chapters: 29 },
  { name: '2 Chronicles', shortName: '2CH', chapters: 36 },
  { name: 'Ezra', shortName: 'EZR', chapters: 10 },
  { name: 'Nehemiah', shortName: 'NEH', chapters: 13 },
  { name: 'Esther', shortName: 'EST', chapters: 10 },
  { name: 'Job', shortName: 'JOB', chapters: 42 },
  { name: 'Psalms', shortName: 'PSA', chapters: 150 },
  { name: 'Proverbs', shortName: 'PRO', chapters: 31 },
  { name: 'Ecclesiastes', shortName: 'ECC', chapters: 12 },
  { name: 'Song of Solomon', shortName: 'SNG', chapters: 8 },
  { name: 'Isaiah', shortName: 'ISA', chapters: 66 },
  { name: 'Jeremiah', shortName: 'JER', chapters: 52 },
  { name: 'Lamentations', shortName: 'LAM', chapters: 5 },
  { name: 'Ezekiel', shortName: 'EZK', chapters: 48 },
  { name: 'Daniel', shortName: 'DAN', chapters: 12 },
  { name: 'Hosea', shortName: 'HOS', chapters: 14 },
  { name: 'Joel', shortName: 'JOL', chapters: 3 },
  { name: 'Amos', shortName: 'AMO', chapters: 9 },
  { name: 'Obadiah', shortName: 'OBA', chapters: 1 },
  { name: 'Jonah', shortName: 'JON', chapters: 4 },
  { name: 'Micah', shortName: 'MIC', chapters: 7 },
  { name: 'Nahum', shortName: 'NAM', chapters: 3 },
  { name: 'Habakkuk', shortName: 'HAB', chapters: 3 },
  { name: 'Zephaniah', shortName: 'ZEP', chapters: 3 },
  { name: 'Haggai', shortName: 'HAG', chapters: 2 },
  { name: 'Zechariah', shortName: 'ZEC', chapters: 14 },
  { name: 'Malachi', shortName: 'MAL', chapters: 4 },
  
  // New Testament
  { name: 'Matthew', shortName: 'MAT', chapters: 28 },
  { name: 'Mark', shortName: 'MRK', chapters: 16 },
  { name: 'Luke', shortName: 'LUK', chapters: 24 },
  { name: 'John', shortName: 'JHN', chapters: 21 },
  { name: 'Acts', shortName: 'ACT', chapters: 28 },
  { name: 'Romans', shortName: 'ROM', chapters: 16 },
  { name: '1 Corinthians', shortName: '1CO', chapters: 16 },
  { name: '2 Corinthians', shortName: '2CO', chapters: 13 },
  { name: 'Galatians', shortName: 'GAL', chapters: 6 },
  { name: 'Ephesians', shortName: 'EPH', chapters: 6 },
  { name: 'Philippians', shortName: 'PHP', chapters: 4 },
  { name: 'Colossians', shortName: 'COL', chapters: 4 },
  { name: '1 Thessalonians', shortName: '1TH', chapters: 5 },
  { name: '2 Thessalonians', shortName: '2TH', chapters: 3 },
  { name: '1 Timothy', shortName: '1TI', chapters: 6 },
  { name: '2 Timothy', shortName: '2TI', chapters: 4 },
  { name: 'Titus', shortName: 'TIT', chapters: 3 },
  { name: 'Philemon', shortName: 'PHM', chapters: 1 },
  { name: 'Hebrews', shortName: 'HEB', chapters: 13 },
  { name: 'James', shortName: 'JAS', chapters: 5 },
  { name: '1 Peter', shortName: '1PE', chapters: 5 },
  { name: '2 Peter', shortName: '2PE', chapters: 3 },
  { name: '1 John', shortName: '1JN', chapters: 5 },
  { name: '2 John', shortName: '2JN', chapters: 1 },
  { name: '3 John', shortName: '3JN', chapters: 1 },
  { name: 'Jude', shortName: 'JUD', chapters: 1 },
  { name: 'Revelation', shortName: 'REV', chapters: 22 }
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
    return [];
  }
  
  const verses = {};
  
  content.verses.forEach(verse => {
    verses[verse.verse] = verse.text.trim();
  });
  
  return verses;
}

// Main function to download and process all Bible books
async function downloadCompleteBible() {
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
  for (let bookIndex = 0; bookIndex < BIBLE_BOOKS.length; bookIndex++) {
    const book = BIBLE_BOOKS[bookIndex];
    const bookName = book.name;
    console.log(`Processing book ${bookIndex + 1}/${BIBLE_BOOKS.length}: ${bookName}`);
    
    bibleData[bookName] = {};
    
    // Process each chapter in the book
    for (let chapterNum = 1; chapterNum <= book.chapters; chapterNum++) {
      try {
        // Fetch chapter content from the API
        const chapterContent = await fetchBibleContent(bookName, chapterNum);
        
        // Process into our required format
        const verses = processBibleContent(chapterContent, bookName, chapterNum);
        
        if (Object.keys(verses).length > 0) {
          bibleData[bookName][chapterNum] = verses;
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error processing ${bookName} ${chapterNum}:`, error);
      }
    }
  }
  
  // Write the complete Bible data to file
  try {
    await writeFile(OUTPUT_FILE, JSON.stringify(bibleData, null, 2));
    console.log(`Complete Bible written to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Error writing Bible data:', err);
  }
}

// Main execution
async function main() {
  console.log('Starting complete Bible download...');
  
  try {
    await downloadCompleteBible();
    console.log('Bible download and processing complete!');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Run the script
main();