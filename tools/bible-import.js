// Bible Import Script
// This script automates the import of Bible text from JSON files into our application's format
// It handles processing an entire Bible XML/JSON source into our structured format with sections

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

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

// Function to group verses into sections (chunks of N verses)
function groupVersesIntoSections(verses, sectionSize = 5) {
  const sections = [];
  let currentSection = {
    title: `Verses 1-${Math.min(sectionSize, verses.length)}`,
    verses: []
  };

  verses.forEach((verse, index) => {
    // Add verse to current section
    currentSection.verses.push(verse);
    
    // When we reach section size or the end, start a new section
    const verseNumber = index + 1;
    if (verseNumber % sectionSize === 0 && verseNumber < verses.length) {
      sections.push(currentSection);
      const nextStart = verseNumber + 1;
      const nextEnd = Math.min(nextStart + sectionSize - 1, verses.length);
      currentSection = {
        title: `Verses ${nextStart}-${nextEnd}`,
        verses: []
      };
    }
  });
  
  // Add the last section if it's not empty
  if (currentSection.verses.length > 0) {
    sections.push(currentSection);
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
      const formattedBook = {
        name: bookName,
        shortName: bookInfo.shortName,
        testament: bookInfo.testament,
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
        
        // Group verses into sections
        const sections = groupVersesIntoSections(formattedVerses);
        
        // Add to formatted book chapters
        formattedBook.chapters.push({
          chapter: parseInt(chapterNum),
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
    
    // Create book index file
    const bookIndex = Object.entries(BOOK_MAP).map(([name, info]) => ({
      name,
      shortName: info.shortName,
      testament: info.testament
    }));
    
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