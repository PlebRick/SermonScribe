// Shared Bible utilities for both client and server usage
import { Book, Verse } from './schema';

export type BibleVerse = {
  verse: number;
  text: string;
};

export type BibleSection = {
  title: string;
  verses: BibleVerse[];
};

export type BibleChapter = {
  chapter: number;
  sections: BibleSection[];
};

export type BibleBookContent = {
  name: string;
  shortName: string;
  chapters: BibleChapter[];
};

// Function to convert Bible content into Verse records for storage/API
export function convertBibleContentToVerses(
  bookId: number,
  chapter: number,
  bookContent: BibleBookContent
): Verse[] {
  console.log(`Converting Bible content for book ${bookContent.shortName} chapter ${chapter}`);
  
  // Find the requested chapter
  const chapterData = bookContent.chapters.find(c => c.chapter === chapter);
  if (!chapterData) {
    console.log(`No content found for chapter ${chapter} in book ${bookContent.shortName}`);
    return [];
  }
  
  console.log(`Found chapter data with ${chapterData.sections.length} sections`);
  
  // Convert sections and verses to flat array of Verse objects
  let verseId = 1000 * bookId + chapter * 100; // Generate unique IDs
  const verses: Verse[] = [];
  
  chapterData.sections.forEach((section, idx) => {
    console.log(`Processing section ${idx+1}: "${section.title}" with ${section.verses.length} verses`);
    
    section.verses.forEach(v => {
      verses.push({
        id: verseId++,
        bookId,
        chapter,
        verse: v.verse,
        text: v.text
      });
    });
  });
  
  console.log(`Converted ${verses.length} total verses for ${bookContent.shortName} chapter ${chapter}`);
  return verses;
}