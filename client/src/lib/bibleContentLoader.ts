import { genesis } from './bible-content/genesis';
import { exodus } from './bible-content/exodus';
import { matthew } from './bible-content/matthew';
import { mark } from './bible-content/mark';
import { john } from './bible-content/john';
import { romans } from './bible-content/romans';
import { bibleContent as allBibleContent } from './bible-data';

// Define a global type for TypeScript
declare global {
  interface Window {
    __BIBLE_CONTENT__: {
      genesis: typeof genesis;
      exodus: typeof exodus;
      matthew: typeof matthew;
      mark: typeof mark;
      john: typeof john;
      romans: typeof romans;
      [key: string]: any; // Allow for dynamic book keys
    };
  }
}

// Initialize the global Bible content object
export function initializeBibleContent() {
  // Make Bible content available globally for easy access in components
  // Merge the placeholder content with the fully defined book structures
  const mergedContent = {
    ...allBibleContent,  // Base placeholders for all books
    // Override with fully defined book structures
    genesis,
    exodus,
    matthew,
    mark, 
    john,
    romans
  };
  
  window.__BIBLE_CONTENT__ = mergedContent;
  
  // Log available books
  console.log('Bible content initialized with books:', Object.keys(window.__BIBLE_CONTENT__).join(', '));
}

// Export the Bible content for direct imports if needed
export const bibleContent = {
  ...allBibleContent,  // Base placeholders
  // Override with fully defined structures
  genesis,
  exodus,
  matthew,
  mark,
  john
};