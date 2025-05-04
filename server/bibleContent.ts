// Server-side Bible content loader
import { Verse } from '@shared/schema';
import { convertBibleContentToVerses, BibleBookContent } from '@shared/bibleUtils';

// Import all our book content
import { genesis } from '../client/src/lib/bible-content/genesis';
import { exodus } from '../client/src/lib/bible-content/exodus';
import { matthew } from '../client/src/lib/bible-content/matthew';
import { mark } from '../client/src/lib/bible-content/mark';
import { john } from '../client/src/lib/bible-content/john';

// Function to get verses for a specific book and chapter
export function getVersesForBookAndChapter(
  bookId: number, 
  chapter: number, 
  shortName: string
): Verse[] {
  console.log(`Server getVersesForBookAndChapter called for book: ${bookId}, shortName: ${shortName}, chapter: ${chapter}`);
  
  // Find the book content based on shortName
  let bookContent: BibleBookContent | null = null;
  
  // Map book shortNames to content
  switch(shortName) {
    case 'gen':
      bookContent = genesis;
      break;
    case 'exo':
      bookContent = exodus;
      break;
    case 'mat':
      bookContent = matthew;
      break;
    case 'mrk':
      bookContent = mark;
      break;
    case 'jhn':
      bookContent = john;
      break;
    default:
      console.log(`No content mapping defined for book: ${shortName}`);
      return [];
  }
  
  if (!bookContent) {
    console.log(`Book content not available for ${shortName}`);
    return [];
  }

  console.log(`Found book content for ${shortName}, processing chapter ${chapter}`);
  
  // Check if book has chapters
  if (!bookContent.chapters || !Array.isArray(bookContent.chapters)) {
    console.log(`Book ${shortName} has no chapters array or it's not an array`);
    console.log('Book content structure:', JSON.stringify(Object.keys(bookContent)));
    return [];
  }
  
  // Check if the specific chapter exists
  const chapterData = bookContent.chapters.find(c => c.chapter === chapter);
  if (!chapterData) {
    console.log(`No chapter ${chapter} found in book ${shortName}`);
    console.log(`Available chapters: ${bookContent.chapters.map(c => c.chapter).join(', ')}`);
    return [];
  }
  
  // Convert chapter content to Verse objects
  const verses = convertBibleContentToVerses(bookId, chapter, bookContent);
  console.log(`Generated ${verses.length} verses from ${shortName} chapter ${chapter}`);
  
  return verses;
}