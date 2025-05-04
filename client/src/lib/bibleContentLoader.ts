import { genesis } from './bible-content/genesis';
import { matthew } from './bible-content/matthew';
import { mark } from './bible-content/mark';

// Define a global type for TypeScript
declare global {
  interface Window {
    __BIBLE_CONTENT__: {
      genesis: typeof genesis;
      matthew: typeof matthew;
      mark: typeof mark;
      // Add more books as they are added
    };
  }
}

// Initialize the global Bible content object
export function initializeBibleContent() {
  // Make Bible content available globally for easy access in components
  window.__BIBLE_CONTENT__ = {
    genesis,
    matthew,
    mark
    // Add more books as they are added
  };
}

// Export the Bible content for direct imports if needed
export const bibleContent = {
  genesis,
  matthew,
  mark
  // Add more books as they are added
};