// Bible Section Processing Script (ES Module Version)
// This script processes the downloaded Bible and adds section headings
// using a combination of predefined section data and algorithmic fallbacks

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisified functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Settings
const SOURCE_DIR = path.join(__dirname, 'source');
const SECTIONS_DIR = path.join(__dirname, 'sections');
const BIBLE_FILE = path.join(SOURCE_DIR, 'web-bible.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'bible', 'books');

// Section headings for major books (simplified for example)
// In a real implementation, this would be a much larger dataset
const SECTION_HEADINGS = {
  "Genesis": {
    "1": [
      { title: "The Beginning", verses: [1, 2] },
      { title: "The First Day", verses: [3, 5] },
      { title: "The Second Day", verses: [6, 8] },
      { title: "The Third Day", verses: [9, 13] },
      { title: "The Fourth Day", verses: [14, 19] },
      { title: "The Fifth Day", verses: [20, 23] },
      { title: "The Sixth Day", verses: [24, 31] }
    ],
    "2": [
      { title: "The Seventh Day", verses: [1, 3] },
      { title: "Adam and Eve", verses: [4, 25] }
    ],
    "3": [
      { title: "The Temptation and Fall", verses: [1, 24] }
    ]
  },
  "Exodus": {
    "20": [
      { title: "The Ten Commandments", verses: [1, 17] },
      { title: "The People's Fear", verses: [18, 21] },
      { title: "The Law of the Altar", verses: [22, 26] }
    ]
  },
  "Matthew": {
    "5": [
      { title: "The Beatitudes", verses: [1, 12] },
      { title: "Salt and Light", verses: [13, 16] },
      { title: "The Law and the Prophets", verses: [17, 20] },
      { title: "Anger", verses: [21, 26] },
      { title: "Adultery", verses: [27, 30] },
      { title: "Divorce", verses: [31, 32] },
      { title: "Oaths", verses: [33, 37] },
      { title: "Retaliation", verses: [38, 42] },
      { title: "Love for Enemies", verses: [43, 48] }
    ]
  },
  "Romans": {
    "1": [
      { title: "Greeting", verses: [1, 7] },
      { title: "Paul's Desire to Visit Rome", verses: [8, 15] },
      { title: "The Righteous Shall Live by Faith", verses: [16, 17] },
      { title: "God's Wrath on Unrighteousness", verses: [18, 32] }
    ]
  },
  "John": {
    "1": [
      { title: "The Word Became Flesh", verses: [1, 18] },
      { title: "The Testimony of John the Baptist", verses: [19, 28] },
      { title: "Behold, the Lamb of God", verses: [29, 34] },
      { title: "Jesus Calls the First Disciples", verses: [35, 51] }
    ]
  }
};

// Helper function to create a section title for a verse range if no predefined heading exists
function createGenericSectionTitle(startVerse, endVerse) {
  if (startVerse === endVerse) {
    return `Verse ${startVerse}`;
  }
  return `Verses ${startVerse}-${endVerse}`;
}

// Create sections for a chapter
function createSectionsForChapter(verses, bookName, chapterNum) {
  // Check if we have predefined sections for this book and chapter
  if (
    SECTION_HEADINGS[bookName] && 
    SECTION_HEADINGS[bookName][chapterNum]
  ) {
    return SECTION_HEADINGS[bookName][chapterNum].map(section => {
      const [startVerse, endVerse] = section.verses;
      const sectionVerses = [];
      
      for (let v = startVerse; v <= endVerse; v++) {
        if (verses[v]) {
          sectionVerses.push({
            verse: v,
            text: verses[v]
          });
        }
      }
      
      return {
        title: section.title,
        verses: sectionVerses
      };
    });
  }
  
  // If no predefined sections, create them algorithmically
  return createDefaultSections(verses);
}

// Create default sections by grouping verses
function createDefaultSections(verses) {
  const allVerses = Object.keys(verses).map(Number).sort((a, b) => a - b);
  if (allVerses.length === 0) return [];
  
  // Group verses into sections (here using a simple approach - every 5 verses)
  const sections = [];
  let currentSection = {
    verses: []
  };
  let currentGroupStart = allVerses[0];
  
  allVerses.forEach((verseNum) => {
    currentSection.verses.push({
      verse: verseNum,
      text: verses[verseNum]
    });
    
    // Create a new section every 5 verses or at chapter end
    if (currentSection.verses.length >= 5 || verseNum === allVerses[allVerses.length - 1]) {
      if (!currentSection.title) {
        const startVerse = currentGroupStart;
        const endVerse = verseNum;
        currentSection.title = createGenericSectionTitle(startVerse, endVerse);
      }
      
      sections.push(currentSection);
      
      // Start a new section unless we're at the end
      if (verseNum !== allVerses[allVerses.length - 1]) {
        currentGroupStart = verseNum + 1;
        currentSection = {
          verses: []
        };
      }
    }
  });
  
  return sections;
}

// Process a Bible book into our section-based format
function processBibleBook(bookContent, bookName) {
  const chapters = [];
  
  // Process each chapter
  Object.keys(bookContent).forEach(chapterNumStr => {
    const chapterNum = parseInt(chapterNumStr, 10);
    const verses = bookContent[chapterNumStr];
    
    // Create sections for this chapter
    const sections = createSectionsForChapter(verses, bookName, chapterNumStr);
    
    chapters.push({
      chapter: chapterNum,
      sections: sections
    });
  });
  
  // Sort chapters numerically
  chapters.sort((a, b) => a.chapter - b.chapter);
  
  return {
    name: bookName,
    shortName: bookName.toLowerCase().replace(/\s/g, '').replace(/[0-9]/g, '$&'),
    chapters: chapters
  };
}

// Main processing function
async function processBible() {
  try {
    // Ensure directories exist
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
    
    // Read the Bible data
    const bibleData = JSON.parse(await readFile(BIBLE_FILE, 'utf-8'));
    console.log('Read Bible data successfully');
    
    const bookFiles = [];
    
    // Process each book
    for (const bookName of Object.keys(bibleData)) {
      console.log(`Processing ${bookName}...`);
      
      const processedBook = processBibleBook(bibleData[bookName], bookName);
      const shortName = processedBook.shortName;
      
      // Write the book data
      const bookFilePath = path.join(OUTPUT_DIR, `${shortName}.json`);
      await writeFile(bookFilePath, JSON.stringify(processedBook, null, 2));
      console.log(`Wrote ${bookName} to ${bookFilePath}`);
      
      bookFiles.push({
        name: bookName,
        shortName: shortName,
        fileName: `${shortName}.json`,
        chapters: processedBook.chapters.length
      });
    }
    
    // Create an index file of all books
    const indexFilePath = path.join(OUTPUT_DIR, 'index.json');
    await writeFile(indexFilePath, JSON.stringify(bookFiles, null, 2));
    console.log(`Created book index at ${indexFilePath}`);
    
  } catch (err) {
    console.error('Error processing Bible:', err);
  }
}

// Main execution
async function main() {
  console.log('Starting Bible section processing...');
  
  try {
    await processBible();
    console.log('Bible section processing complete!');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Run the script
main();