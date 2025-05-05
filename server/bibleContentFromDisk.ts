// Server-side Bible content loader that reads from disk
import fs from 'fs';
import path from 'path';
import { Verse } from '@shared/schema';
import { BibleBookContent } from '@shared/bibleUtils';

// Path constants
const CONTENT_DIR = path.join(process.cwd(), 'content');
const BIBLE_DIR = path.join(CONTENT_DIR, 'bible');
const BOOKS_DIR = path.join(BIBLE_DIR, 'books');

// Function to get verses for a specific book and chapter from disk
export function getVersesForBookAndChapter(
  bookId: number, 
  chapter: number, 
  shortName: string
): Verse[] {
  console.log(`Disk loader: getVersesForBookAndChapter called for book: ${bookId}, shortName: ${shortName}, chapter: ${chapter}`);

  try {
    // Construct the path to the book JSON file
    const bookFilePath = path.join(BOOKS_DIR, `${shortName}.json`);
    
    // Check if the file exists
    if (!fs.existsSync(bookFilePath)) {
      console.log(`No book file found at ${bookFilePath}`);
      return [];
    }
    
    // Read and parse the JSON file
    const bookContent = JSON.parse(fs.readFileSync(bookFilePath, 'utf8'));
    console.log(`Found book file for ${shortName}, chapters: ${bookContent.chapterCount}`);
    
    if (!bookContent.chapters || !Array.isArray(bookContent.chapters)) {
      console.log(`Book ${shortName} has no valid chapters array`);
      return [];
    }
    
    // Find the requested chapter
    const chapterData = bookContent.chapters.find((c: any) => c.chapter === chapter);
    if (!chapterData) {
      console.log(`Chapter ${chapter} not found in book ${shortName}`);
      console.log(`Available chapters: ${bookContent.chapters.map((c: any) => c.chapter).join(', ')}`);
      return [];
    }
    
    // Extract all verses from all sections
    const verses: Verse[] = [];
    let verseId = 1; // Starting ID for verses
    
    // Process each section in the chapter
    chapterData.sections.forEach((section: any) => {
      if (section.verses && Array.isArray(section.verses)) {
        // Add each verse from this section
        section.verses.forEach((verseData: any) => {
          // Create a verse object with the required fields
          const verseObj: Verse = {
            id: verseId++,
            bookId,
            chapter,
            verse: verseData.verse,
            text: verseData.text
          };
          
          // Add section title as a property (this will be used by the UI but ignored by the database)
          (verseObj as any).sectionTitle = section.title;
          
          verses.push(verseObj);
        });
      }
    });
    
    console.log(`Found ${verses.length} verses for ${shortName} chapter ${chapter}`);
    return verses;
  } catch (error) {
    console.error(`Error loading verses from disk:`, error);
    return [];
  }
}