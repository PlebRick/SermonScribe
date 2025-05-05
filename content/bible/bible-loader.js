
// Auto-generated Bible content loader for client-side
window.__BIBLE_CONTENT__ = {};

// Book import function
async function importBibleBook(shortName) {
  try {
    const response = await fetch(`/content/bible/books/${shortName}.json`);
    const bookData = await response.json();
    window.__BIBLE_CONTENT__[shortName] = bookData;
    console.log(`Loaded Bible book: ${bookData.name}`);
    return bookData;
  } catch (err) {
    console.error(`Error loading Bible book ${shortName}:`, err);
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
