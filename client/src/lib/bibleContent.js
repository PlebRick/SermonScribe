// Bible content fetcher utility
import { useQuery } from '@tanstack/react-query';

// Get the list of all Bible books
export function useBibleBooks() {
  return useQuery({
    queryKey: ['/content/bible/index'],
    queryFn: async () => {
      const response = await fetch('/content/bible/index.json');
      if (!response.ok) {
        throw new Error('Failed to fetch Bible books');
      }
      return response.json();
    },
  });
}

// Get a specific Bible book content
export function useBibleBook(shortName) {
  return useQuery({
    queryKey: ['/content/bible/books', shortName],
    queryFn: async () => {
      if (!shortName) return null;
      
      const response = await fetch(`/content/bible/books/${shortName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Bible book: ${shortName}`);
      }
      return response.json();
    },
    enabled: !!shortName,
  });
}

// Get a specific chapter from a Bible book
export function useBibleChapter(bookShortName, chapterNumber) {
  const { data: bookData, isLoading, error } = useBibleBook(bookShortName);
  
  // Find the specific chapter in the book data
  const chapterData = bookData?.chapters?.find(c => c.chapter === chapterNumber);
  
  return {
    isLoading,
    error,
    data: chapterData,
    bookData,
  };
}

// Initialize Bible content at application startup
export function initializeBibleContent() {
  // This adds the script to the head when the file is imported
  if (typeof window !== 'undefined' && !document.getElementById('bible-loader')) {
    const script = document.createElement('script');
    script.id = 'bible-loader';
    script.src = '/content/bible/bible-loader.js';
    document.head.appendChild(script);
  }
}

// Helper function to format a verse reference
export function formatVerseReference(bookName, chapter, verse) {
  return `${bookName} ${chapter}:${verse}`;
}

// Helper function to parse a verse reference (e.g., "Genesis 1:1-3")
export function parseVerseReference(reference) {
  try {
    // Match patterns like "Genesis 1:1" or "Genesis 1:1-3"
    const match = reference.match(/^(\w+)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (!match) return null;
    
    return {
      book: match[1],
      chapter: parseInt(match[2]),
      verseStart: parseInt(match[3]),
      verseEnd: match[4] ? parseInt(match[4]) : parseInt(match[3]),
    };
  } catch (err) {
    console.error('Error parsing verse reference:', err);
    return null;
  }
}
