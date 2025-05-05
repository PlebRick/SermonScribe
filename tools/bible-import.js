// Bible Import Script
// This script automates the import of Bible text from JSON files into our application's format
// It handles processing an entire Bible XML/JSON source into our structured format with sections

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Define paths
const CONTENT_DIR = path.join(__dirname, '../content');
const BIBLE_DIR = path.join(CONTENT_DIR, 'bible');
const BIBLE_BOOKS_DIR = path.join(BIBLE_DIR, 'books');
const SOURCE_FILE = path.join(__dirname, 'source/web-bible.json'); // You'll need to download this

// Book mapping for standardization
const BOOK_MAP = {
  'Genesis': { shortName: 'gen', testament: 'old' },
  'Exodus': { shortName: 'exo', testament: 'old' },
  'Leviticus': { shortName: 'lev', testament: 'old' },
  'Numbers': { shortName: 'num', testament: 'old' },
  'Deuteronomy': { shortName: 'deu', testament: 'old' },
  'Joshua': { shortName: 'jos', testament: 'old' },
  'Judges': { shortName: 'jdg', testament: 'old' },
  'Ruth': { shortName: 'rut', testament: 'old' },
  '1 Samuel': { shortName: 'samuel1', testament: 'old' },
  '2 Samuel': { shortName: 'samuel2', testament: 'old' },
  '1 Kings': { shortName: 'kings1', testament: 'old' },
  '2 Kings': { shortName: 'kings2', testament: 'old' },
  '1 Chronicles': { shortName: 'chronicles1', testament: 'old' },
  '2 Chronicles': { shortName: 'chronicles2', testament: 'old' },
  'Ezra': { shortName: 'ezr', testament: 'old' },
  'Nehemiah': { shortName: 'neh', testament: 'old' },
  'Esther': { shortName: 'est', testament: 'old' },
  'Job': { shortName: 'job', testament: 'old' },
  'Psalms': { shortName: 'psa', testament: 'old' },
  'Psalm': { shortName: 'psa', testament: 'old' },
  'Proverbs': { shortName: 'pro', testament: 'old' },
  'Ecclesiastes': { shortName: 'ecc', testament: 'old' },
  'Song of Solomon': { shortName: 'sng', testament: 'old' },
  'Isaiah': { shortName: 'isa', testament: 'old' },
  'Jeremiah': { shortName: 'jer', testament: 'old' },
  'Lamentations': { shortName: 'lam', testament: 'old' },
  'Ezekiel': { shortName: 'ezk', testament: 'old' },
  'Daniel': { shortName: 'dan', testament: 'old' },
  'Hosea': { shortName: 'hos', testament: 'old' },
  'Joel': { shortName: 'jol', testament: 'old' },
  'Amos': { shortName: 'amo', testament: 'old' },
  'Obadiah': { shortName: 'oba', testament: 'old' },
  'Jonah': { shortName: 'jon', testament: 'old' },
  'Micah': { shortName: 'mic', testament: 'old' },
  'Nahum': { shortName: 'nam', testament: 'old' },
  'Habakkuk': { shortName: 'hab', testament: 'old' },
  'Zephaniah': { shortName: 'zep', testament: 'old' },
  'Haggai': { shortName: 'hag', testament: 'old' },
  'Zechariah': { shortName: 'zec', testament: 'old' },
  'Malachi': { shortName: 'mal', testament: 'old' },
  'Matthew': { shortName: 'mat', testament: 'new' },
  'Mark': { shortName: 'mrk', testament: 'new' },
  'Luke': { shortName: 'luk', testament: 'new' },
  'John': { shortName: 'jhn', testament: 'new' },
  'Acts': { shortName: 'act', testament: 'new' },
  'Romans': { shortName: 'rom', testament: 'new' },
  '1 Corinthians': { shortName: 'corinthians1', testament: 'new' },
  '2 Corinthians': { shortName: 'corinthians2', testament: 'new' },
  'Galatians': { shortName: 'gal', testament: 'new' },
  'Ephesians': { shortName: 'eph', testament: 'new' },
  'Philippians': { shortName: 'php', testament: 'new' },
  'Colossians': { shortName: 'col', testament: 'new' },
  '1 Thessalonians': { shortName: 'thessalonians1', testament: 'new' },
  '2 Thessalonians': { shortName: 'thessalonians2', testament: 'new' },
  '1 Timothy': { shortName: 'timothy1', testament: 'new' },
  '2 Timothy': { shortName: 'timothy2', testament: 'new' },
  'Titus': { shortName: 'tit', testament: 'new' },
  'Philemon': { shortName: 'phm', testament: 'new' },
  'Hebrews': { shortName: 'heb', testament: 'new' },
  'James': { shortName: 'jas', testament: 'new' },
  '1 Peter': { shortName: 'peter1', testament: 'new' },
  '2 Peter': { shortName: 'peter2', testament: 'new' },
  '1 John': { shortName: 'john1', testament: 'new' },
  '2 John': { shortName: 'john2', testament: 'new' },
  '3 John': { shortName: 'john3', testament: 'new' },
  'Jude': { shortName: 'jud', testament: 'new' },
  'Revelation': { shortName: 'rev', testament: 'new' }
};

// Function to make sure directories exist
async function ensureDirectories() {
  try {
    await mkdir(CONTENT_DIR, { recursive: true });
    await mkdir(BIBLE_DIR, { recursive: true });
    await mkdir(BIBLE_BOOKS_DIR, { recursive: true });
    console.log('Directories created successfully.');
  } catch (err) {
    console.error('Error creating directories:', err);
  }
}

// Map of special section headers for important Bible passages
const SECTION_HEADERS = {
  // Genesis chapter 1
  'Genesis': {
    1: [
      { start: 1, end: 2, title: 'The Beginning' },
      { start: 3, end: 5, title: 'The First Day' },
      { start: 6, end: 8, title: 'The Second Day' },
      { start: 9, end: 13, title: 'The Third Day' },
      { start: 14, end: 19, title: 'The Fourth Day' },
      { start: 20, end: 23, title: 'The Fifth Day' },
      { start: 24, end: 31, title: 'The Sixth Day' }
    ],
    2: [
      { start: 1, end: 3, title: 'The Seventh Day' },
      { start: 4, end: 14, title: 'Adam and Eve' },
      { start: 15, end: 25, title: 'The Garden of Eden' }
    ],
    3: [
      { start: 1, end: 7, title: 'The Temptation and Fall' },
      { start: 8, end: 15, title: 'God Confronts Adam and Eve' },
      { start: 16, end: 24, title: 'The Curse' }
    ]
  },
  // Add more books and their section headers here
  'Exodus': {
    20: [
      { start: 1, end: 17, title: 'The Ten Commandments' }
    ]
  },
  'Matthew': {
    5: [
      { start: 1, end: 12, title: 'The Beatitudes' },
      { start: 13, end: 20, title: 'Salt and Light' },
      { start: 21, end: 48, title: 'The Fulfillment of the Law' }
    ],
    6: [
      { start: 1, end: 4, title: 'Giving to the Needy' },
      { start: 5, end: 15, title: 'The Lord\'s Prayer' },
      { start: 16, end: 18, title: 'Fasting' },
      { start: 19, end: 34, title: 'Treasures in Heaven' }
    ]
  },
  'John': {
    3: [
      { start: 1, end: 21, title: 'Jesus Teaches Nicodemus' },
      { start: 16, end: 16, title: 'For God So Loved the World' }
    ]
  },
  'Romans': {
    8: [
      { start: 1, end: 17, title: 'Life in the Spirit' },
      { start: 18, end: 30, title: 'Future Glory' },
      { start: 31, end: 39, title: 'More Than Conquerors' }
    ]
  }
};

// Default chapter titles for books
const DEFAULT_CHAPTER_TITLES = {
  'Genesis': 'The Creation',
  'Exodus': 'The Exodus from Egypt',
  'Leviticus': 'The Law of Holiness',
  'Numbers': 'The Census of Israel',
  'Deuteronomy': 'The Second Law',
  'Joshua': 'The Conquest of Canaan',
  'Judges': 'Israel\'s Judges',
  'Ruth': 'The Story of Ruth',
  'Psalms': 'Songs of Praise',
  'Proverbs': 'Wisdom Sayings',
  'Matthew': 'The Gospel of Matthew',
  'Mark': 'The Gospel of Mark',
  'Luke': 'The Gospel of Luke',
  'John': 'The Gospel of John',
  'Acts': 'The Acts of the Apostles',
  'Romans': 'Paul\'s Letter to the Romans',
  'Revelation': 'The Revelation to John'
};

// Function to group verses into sections using predefined section headers when available
function groupVersesIntoSections(verses, bookName, chapterNum) {
  // Check if we have predefined sections for this book and chapter
  const bookSections = SECTION_HEADERS[bookName];
  const chapterSections = bookSections ? bookSections[chapterNum] : null;
  
  if (chapterSections && chapterSections.length > 0) {
    // Use predefined sections
    const sections = [];
    
    // Sort sections by start verse to ensure proper order
    const sortedSections = [...chapterSections].sort((a, b) => a.start - b.start);
    
    // Create sections based on predefined headers
    sortedSections.forEach((sectionDef, idx) => {
      const sectionVerses = verses.filter(v => 
        v.verse >= sectionDef.start && v.verse <= sectionDef.end
      );
      
      if (sectionVerses.length > 0) {
        sections.push({
          title: sectionDef.title,
          verses: sectionVerses
        });
      }
    });
    
    // Find any verses not covered by predefined sections
    const coveredVerseNumbers = new Set();
    sections.forEach(section => {
      section.verses.forEach(verse => {
        coveredVerseNumbers.add(verse.verse);
      });
    });
    
    const uncoveredVerses = verses.filter(v => !coveredVerseNumbers.has(v.verse));
    
    // If there are uncovered verses, add them as additional sections
    if (uncoveredVerses.length > 0) {
      // Group uncovered verses into sections of 5
      const additionalSections = groupVersesBySize(uncoveredVerses, 5);
      sections.push(...additionalSections);
      
      // Sort all sections by the first verse number
      sections.sort((a, b) => {
        const aFirstVerse = a.verses[0].verse;
        const bFirstVerse = b.verses[0].verse;
        return aFirstVerse - bFirstVerse;
      });
    }
    
    return sections;
  } else {
    // If no predefined sections, group by size (fallback)
    return groupVersesBySize(verses, 5);
  }
}

// Helper function to group verses into sections of specified size
function groupVersesBySize(verses, sectionSize = 5) {
  const sections = [];
  let currentVerses = [];
  let startVerse = 0;
  
  verses.forEach(verse => {
    if (currentVerses.length === 0) {
      startVerse = verse.verse;
    }
    
    currentVerses.push(verse);
    
    if (currentVerses.length >= sectionSize) {
      sections.push({
        title: `Verses ${startVerse}-${verse.verse}`,
        verses: [...currentVerses]
      });
      currentVerses = [];
    }
  });
  
  // Add any remaining verses as the last section
  if (currentVerses.length > 0) {
    sections.push({
      title: `Verses ${startVerse}-${currentVerses[currentVerses.length - 1].verse}`,
      verses: currentVerses
    });
  }
  
  return sections;
}

// Main function to process Bible books
async function processBibleBooks() {
  try {
    console.log('Starting Bible import process...');
    
    // Ensure directories exist
    await ensureDirectories();

    // Read source Bible JSON
    const rawData = await readFile(SOURCE_FILE, 'utf8');
    let bibleData;
    try {
      bibleData = JSON.parse(rawData);
    } catch (e) {
      console.error('Error parsing Bible JSON:', e);
      return;
    }

    // Process each book
    let booksProcessed = 0;
    const totalBooks = Object.keys(bibleData).length;
    
    console.log(`Found ${totalBooks} books in source file.`);
    
    for (const bookName in bibleData) {
      const bookInfo = BOOK_MAP[bookName];
      
      if (!bookInfo) {
        console.warn(`No mapping found for book: ${bookName}, skipping.`);
        continue;
      }
      
      const bookData = bibleData[bookName];
      // Get all chapter numbers and find the maximum
      const chapterNumbers = Object.keys(bookData).map(c => parseInt(c));
      const chapterCount = Math.max(...chapterNumbers);
      
      const formattedBook = {
        id: Object.keys(BOOK_MAP).indexOf(bookName) + 1, // Add an ID for database consistency
        name: bookName,
        shortName: bookInfo.shortName,
        testament: bookInfo.testament,
        position: Object.keys(BOOK_MAP).indexOf(bookName) + 1, // For sorting in sidebar
        chapterCount: chapterCount,
        chapters: []
      };
      
      // Process each chapter
      for (const chapterNum in bookData) {
        const chapterVerses = bookData[chapterNum];
        const formattedVerses = Object.keys(chapterVerses).map(verseNum => ({
          verse: parseInt(verseNum),
          text: chapterVerses[verseNum]
        }));
        
        // Sort verses by number
        formattedVerses.sort((a, b) => a.verse - b.verse);
        
        // Group verses into sections, passing book name and chapter number for headers
        const sections = groupVersesIntoSections(formattedVerses, bookName, parseInt(chapterNum));
        
        // Get default chapter title or use a generic one
        const chapterNumInt = parseInt(chapterNum);
        let chapterTitle = '';
        
        // For first chapter, use the book default title if available
        if (chapterNumInt === 1 && DEFAULT_CHAPTER_TITLES[bookName]) {
          chapterTitle = DEFAULT_CHAPTER_TITLES[bookName];
        } else {
          // For key chapters, use more specific titles
          // This could be expanded with a more comprehensive mapping
          chapterTitle = `Chapter ${chapterNumInt}`;
        }
        
        // Add to formatted book chapters
        formattedBook.chapters.push({
          id: chapterNumInt,
          chapter: chapterNumInt,
          title: chapterTitle,
          sections
        });
      }
      
      // Sort chapters by number
      formattedBook.chapters.sort((a, b) => a.chapter - b.chapter);
      
      // Write out the final book file
      const bookFilePath = path.join(BIBLE_BOOKS_DIR, `${bookInfo.shortName}.json`);
      await writeFile(bookFilePath, JSON.stringify(formattedBook, null, 2));
      
      booksProcessed++;
      console.log(`Processed ${booksProcessed}/${totalBooks}: ${bookName}`);
    }
    
    console.log('Bible import complete!');
    console.log(`Successfully processed ${booksProcessed} books.`);
    
    // Create book index file with full metadata
    const bookIndex = Object.entries(BOOK_MAP).map(([name, info], index) => {
      // Find the max chapter count for this book if we processed it
      const bookFilePath = path.join(BIBLE_BOOKS_DIR, `${info.shortName}.json`);
      let chapterCount = 0;
      try {
        // If we've processed this book, get its chapter count from the file
        const bookJson = require(bookFilePath);
        chapterCount = bookJson.chapterCount || bookJson.chapters.length;
      } catch (err) {
        // If file doesn't exist yet, make an estimate
        chapterCount = 0; // This will be a placeholder
      }
      
      return {
        id: index + 1,
        name,
        shortName: info.shortName,
        testament: info.testament,
        position: index + 1,
        chapterCount
      };
    });
    
    await writeFile(
      path.join(BIBLE_DIR, 'index.json'), 
      JSON.stringify(bookIndex, null, 2)
    );
    
    console.log('Created book index file.');
    
  } catch (err) {
    console.error('Error in Bible import process:', err);
  }
}

// Create a client-side import script
async function createClientImportScript() {
  try {
    // Create a JavaScript file that can be loaded by the client
    const jsImport = `
// Auto-generated Bible content loader for client-side
window.__BIBLE_CONTENT__ = {};

// Book import function
async function importBibleBook(shortName) {
  try {
    const response = await fetch(\`/content/bible/books/\${shortName}.json\`);
    const bookData = await response.json();
    window.__BIBLE_CONTENT__[shortName] = bookData;
    console.log(\`Loaded Bible book: \${bookData.name}\`);
    return bookData;
  } catch (err) {
    console.error(\`Error loading Bible book \${shortName}:\`, err);
    return null;
  }
}

// Initialize Bible content with book list
async function initializeBibleContent() {
  try {
    const response = await fetch('/content/bible/index.json');
    const bookIndex = await response.json();
    
    console.log('Bible content initialized with books:', 
      bookIndex.map(book => book.shortName).join(', '));
    
    // Store the index
    window.__BIBLE_BOOK_INDEX__ = bookIndex;
    
    // Return the list for further processing
    return bookIndex;
  } catch (err) {
    console.error('Error initializing Bible content:', err);
    return [];
  }
}

// Preload a specific book's content
async function preloadBookContent(shortName) {
  if (!window.__BIBLE_CONTENT__[shortName]) {
    return await importBibleBook(shortName);
  }
  return window.__BIBLE_CONTENT__[shortName];
}

// Export the functions for use
window.Bible = {
  initialize: initializeBibleContent,
  preloadBook: preloadBookContent,
  importBook: importBibleBook
};

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', function() {
  window.Bible.initialize();
});
`;
    
    await writeFile(
      path.join(BIBLE_DIR, 'bible-loader.js'), 
      jsImport
    );
    
    console.log('Created client-side Bible loader script.');
    
  } catch (err) {
    console.error('Error creating client import script:', err);
  }
}

// Run everything
async function main() {
  // Process Bible books
  await processBibleBooks();
  
  // Create client-side script
  await createClientImportScript();
  
  console.log('All tasks completed!');
}

main().catch(console.error);