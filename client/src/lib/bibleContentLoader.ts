import { genesis } from './bible-content/genesis';

// Define a global type for TypeScript
declare global {
  interface Window {
    __BIBLE_CONTENT__: {
      genesis: typeof genesis;
      // Add more books as they are added
    };
  }
}

// Initialize the global Bible content object
export function initializeBibleContent() {
  // Make Bible content available globally for easy access in components
  window.__BIBLE_CONTENT__ = {
    genesis
    // Add more books as they are added
  };
}

// Export the Bible content for direct imports if needed
export const bibleContent = {
  genesis
  // Add more books as they are added
};