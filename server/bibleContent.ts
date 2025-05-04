// Server-side Bible content loader
import { Verse } from '@shared/schema';
import { convertBibleContentToVerses, BibleBookContent } from '@shared/bibleUtils';

// Import all our book content
import { genesis } from '../client/src/lib/bible-content/genesis';
import { exodus } from '../client/src/lib/bible-content/exodus';
import { matthew } from '../client/src/lib/bible-content/matthew';
import { mark } from '../client/src/lib/bible-content/mark';
import { john } from '../client/src/lib/bible-content/john';

// Map of Bible book content indexed by shortName
export const bibleContentMap: Record<string, BibleBookContent> = {
  'gen': genesis,
  'exo': exodus,
  'mat': matthew,
  'mrk': mark,
  'jhn': john
};

// Function to get verses for a specific book and chapter
export function getVersesForBookAndChapter(
  bookId: number, 
  chapter: number, 
  shortName: string
): Verse[] {
  // Find the book content
  const bookContent = bibleContentMap[shortName];
  if (!bookContent) {
    console.log(`No book content available for ${shortName}`);
    return [];
  }
  
  // Convert book content to Verse objects
  return convertBibleContentToVerses(bookId, chapter, bookContent);
}