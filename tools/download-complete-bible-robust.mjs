// Robust Complete Bible Download Script (ES Module Version)
// This script downloads the entire World English Bible (WEB) with advanced
// error handling, rate limiting, and progress tracking

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
const readFile = promisify(fs.readFile);
const access = promisify(fs.access);
const stat = promisify(fs.stat);

// Settings
const SOURCE_DIR = path.join(__dirname, 'source');
const OUTPUT_FILE = path.join(SOURCE_DIR, 'web-bible.json');
const TEMP_DIR = path.join(SOURCE_DIR, 'temp');
const PROGRESS_FILE = path.join(SOURCE_DIR, 'download-progress.json');
const BIBLE_API_URL = 'https://bible-api.com/';

// Rate limiting settings
const RATE_LIMIT = {
  requestsPerMinute: 20,
  waitBetweenRequests: 3000,  // 3 seconds between requests
};

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

// Progress tracking
let progressData = {
  startTime: null,
  completedBooks: [],
  completedChapters: {},
  totalBooks: BIBLE_BOOKS.length,
  totalChapters: BIBLE_BOOKS.reduce((total, book) => total + book.chapters, 0),
  completedCount: 0,
  failedAttempts: {}
};

// Create a function to fetch Bible content from the API with retry logic
async function fetchBibleContent(book, chapter, maxRetries = 3) {
  const reference = `${book} ${chapter}`;
  const key = `${book}:${chapter}`;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    attempt++;
    try {
      console.log(`Fetching ${reference} (Attempt ${attempt}/${maxRetries})...`);
      
      const content = await new Promise((resolve, reject) => {
        const url = `${BIBLE_API_URL}${encodeURIComponent(reference)}?translation=web`;
        
        https.get(url, (response) => {
          // Handle HTTP errors
          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(new Error(`HTTP error: ${response.statusCode} for ${reference}`));
          }
          
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
      
      // If we got here, the request was successful
      return content;
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed for ${reference}: ${error.message}`);
      
      // Track failed attempts
      progressData.failedAttempts[key] = (progressData.failedAttempts[key] || 0) + 1;
      
      // Last attempt failed, throw the error
      if (attempt >= maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = RATE_LIMIT.waitBetweenRequests * Math.pow(2, attempt - 1);
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
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

// Save a chapter to a temporary file
async function saveChapterToTempFile(bookName, chapterNum, verses) {
  const tempFilePath = path.join(TEMP_DIR, `${bookName.toLowerCase()}_${chapterNum}.json`);
  await writeFile(tempFilePath, JSON.stringify(verses, null, 2));
  return tempFilePath;
}

// Load a chapter from a temporary file
async function loadChapterFromTempFile(bookName, chapterNum) {
  try {
    const tempFilePath = path.join(TEMP_DIR, `${bookName.toLowerCase()}_${chapterNum}.json`);
    const data = await readFile(tempFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

// Check if a chapter exists in temp storage
async function chapterExistsInTemp(bookName, chapterNum) {
  try {
    const tempFilePath = path.join(TEMP_DIR, `${bookName.toLowerCase()}_${chapterNum}.json`);
    await access(tempFilePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

// Save progress data
async function saveProgressData() {
  await writeFile(PROGRESS_FILE, JSON.stringify(progressData, null, 2));
}

// Load progress data
async function loadProgressData() {
  try {
    await access(PROGRESS_FILE, fs.constants.F_OK);
    const data = await readFile(PROGRESS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

// Calculate and display progress
function displayProgress() {
  const elapsedTime = (Date.now() - progressData.startTime) / 1000;
  const completedPercentage = (progressData.completedCount / progressData.totalChapters) * 100;
  
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = Math.floor(elapsedTime % 60);
  
  console.log(`\nProgress: ${progressData.completedCount}/${progressData.totalChapters} chapters (${completedPercentage.toFixed(2)}%)`);
  console.log(`Elapsed time: ${hours}h ${minutes}m ${seconds}s`);
  
  // Estimate remaining time
  if (progressData.completedCount > 0) {
    const avgTimePerChapter = elapsedTime / progressData.completedCount;
    const remainingChapters = progressData.totalChapters - progressData.completedCount;
    const remainingTime = avgTimePerChapter * remainingChapters;
    
    const remHours = Math.floor(remainingTime / 3600);
    const remMinutes = Math.floor((remainingTime % 3600) / 60);
    const remSeconds = Math.floor(remainingTime % 60);
    
    console.log(`Estimated time remaining: ${remHours}h ${remMinutes}m ${remSeconds}s\n`);
  }
}

// Main function to download and process all Bible books with resumability
async function downloadCompleteBible() {
  try {
    // Ensure directories exist
    await mkdir(SOURCE_DIR, { recursive: true });
    await mkdir(TEMP_DIR, { recursive: true });
    console.log('Directories created successfully.');
    
    // Initialize or load progress
    const savedProgress = await loadProgressData();
    if (savedProgress) {
      console.log('Resuming from previous download...');
      progressData = savedProgress;
    } else {
      progressData.startTime = Date.now();
    }
    
    // Process each book
    for (let bookIndex = 0; bookIndex < BIBLE_BOOKS.length; bookIndex++) {
      const book = BIBLE_BOOKS[bookIndex];
      const bookName = book.name;
      
      // Skip if book is already completed
      if (progressData.completedBooks.includes(bookName)) {
        console.log(`Skipping completed book: ${bookName}`);
        continue;
      }
      
      console.log(`\nProcessing book ${bookIndex + 1}/${BIBLE_BOOKS.length}: ${bookName}`);
      
      if (!progressData.completedChapters[bookName]) {
        progressData.completedChapters[bookName] = [];
      }
      
      // Process each chapter in the book
      for (let chapterNum = 1; chapterNum <= book.chapters; chapterNum++) {
        // Skip if chapter is already completed
        if (progressData.completedChapters[bookName].includes(chapterNum)) {
          console.log(`Skipping completed chapter: ${bookName} ${chapterNum}`);
          continue;
        }
        
        try {
          let verses;
          
          // Check if already in temp storage
          if (await chapterExistsInTemp(bookName, chapterNum)) {
            console.log(`Loading ${bookName} ${chapterNum} from temp storage...`);
            verses = await loadChapterFromTempFile(bookName, chapterNum);
          } else {
            // Fetch from API
            const chapterContent = await fetchBibleContent(bookName, chapterNum);
            verses = processBibleContent(chapterContent, bookName, chapterNum);
            
            // Save to temp storage
            await saveChapterToTempFile(bookName, chapterNum, verses);
          }
          
          // Mark as completed
          progressData.completedChapters[bookName].push(chapterNum);
          progressData.completedCount++;
          
          // Save progress
          await saveProgressData();
          
          // Display progress
          if (progressData.completedCount % 10 === 0) {
            displayProgress();
          }
          
          // Add a delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.waitBetweenRequests));
          
        } catch (error) {
          console.error(`Error processing ${bookName} ${chapterNum}:`, error);
          
          // Save progress in case of failure
          await saveProgressData();
        }
      }
      
      // Mark book as completed
      progressData.completedBooks.push(bookName);
      await saveProgressData();
    }
    
    // Final progress display
    displayProgress();
    
    // Combine all data into a single Bible file
    console.log('\nCombining all chapters into a complete Bible file...');
    const bibleData = {};
    
    for (const book of BIBLE_BOOKS) {
      const bookName = book.name;
      bibleData[bookName] = {};
      
      for (let chapterNum = 1; chapterNum <= book.chapters; chapterNum++) {
        const verses = await loadChapterFromTempFile(bookName, chapterNum);
        if (verses && Object.keys(verses).length > 0) {
          bibleData[bookName][chapterNum] = verses;
        }
      }
    }
    
    // Write the final Bible file
    await writeFile(OUTPUT_FILE, JSON.stringify(bibleData, null, 2));
    console.log(`Complete Bible written to ${OUTPUT_FILE}`);
    
  } catch (err) {
    console.error('Error in Bible download process:', err);
    throw err;
  }
}

// Main execution
async function main() {
  console.log('Starting complete Bible download...');
  
  try {
    await downloadCompleteBible();
    console.log('Bible download and processing complete!');
  } catch (err) {
    console.error('A critical error occurred:', err);
    
    // Exit with error code
    process.exit(1);
  }
}

// Run the script
main();