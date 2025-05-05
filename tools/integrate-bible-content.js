// This script integrates the generated Bible content with the SermonScribe application
// It copies the client-side loader script to the appropriate location and updates index.html

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

// Define paths
const CONTENT_DIR = path.join(__dirname, '../content');
const BIBLE_DIR = path.join(CONTENT_DIR, 'bible');
const CLIENT_SRC_DIR = path.join(__dirname, '../client/src');
const PUBLIC_DIR = path.join(__dirname, '../client/public');
const PUBLIC_CONTENT_DIR = path.join(PUBLIC_DIR, 'content');
const PUBLIC_BIBLE_DIR = path.join(PUBLIC_CONTENT_DIR, 'bible');

// Make sure directories exist
async function ensureDirectories() {
  try {
    await mkdir(PUBLIC_DIR, { recursive: true });
    await mkdir(PUBLIC_CONTENT_DIR, { recursive: true });
    await mkdir(PUBLIC_BIBLE_DIR, { recursive: true });
    await mkdir(path.join(PUBLIC_BIBLE_DIR, 'books'), { recursive: true });
    console.log('Public directories created.');
  } catch (err) {
    console.error('Error creating directories:', err);
  }
}

// Copy the Bible loader script to the public directory
async function copyLoaderScript() {
  try {
    const source = path.join(BIBLE_DIR, 'bible-loader.js');
    const destination = path.join(PUBLIC_BIBLE_DIR, 'bible-loader.js');
    
    await copyFile(source, destination);
    console.log('Copied Bible loader script to public directory.');
  } catch (err) {
    console.error('Error copying Bible loader script:', err);
  }
}

// Copy the Bible index file to the public directory
async function copyBibleIndex() {
  try {
    const source = path.join(BIBLE_DIR, 'index.json');
    const destination = path.join(PUBLIC_BIBLE_DIR, 'index.json');
    
    await copyFile(source, destination);
    console.log('Copied Bible index to public directory.');
  } catch (err) {
    console.error('Error copying Bible index:', err);
  }
}

// Create a client-side utility module for Bible content
async function createBibleModule() {
  try {
    const bibleFetcherModule = `// Bible content fetcher utility
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
      
      const response = await fetch(\`/content/bible/books/\${shortName}.json\`);
      if (!response.ok) {
        throw new Error(\`Failed to fetch Bible book: \${shortName}\`);
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
  return \`\${bookName} \${chapter}:\${verse}\`;
}

// Helper function to parse a verse reference (e.g., "Genesis 1:1-3")
export function parseVerseReference(reference) {
  try {
    // Match patterns like "Genesis 1:1" or "Genesis 1:1-3"
    const match = reference.match(/^(\\w+)\\s+(\\d+):(\\d+)(?:-(\\d+))?$/);
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
`;

    // Create the lib directory if it doesn't exist
    const libDir = path.join(CLIENT_SRC_DIR, 'lib');
    await mkdir(libDir, { recursive: true });
    
    // Write the Bible module
    await writeFile(
      path.join(libDir, 'bibleContent.js'),
      bibleFetcherModule
    );
    
    console.log('Created Bible content module for client-side usage.');
  } catch (err) {
    console.error('Error creating Bible module:', err);
  }
}

// Update the index.html to include the Bible loader script
async function updateIndexHTML() {
  try {
    const indexPath = path.join(CLIENT_SRC_DIR, 'index.html');
    
    // Check if the file exists
    let indexContent;
    try {
      indexContent = await readFile(indexPath, 'utf8');
    } catch (err) {
      console.error('Error reading index.html:', err);
      return;
    }
    
    // Check if the Bible loader script is already included
    if (indexContent.includes('bible-loader.js')) {
      console.log('Bible loader script already included in index.html.');
      return;
    }
    
    // Add the Bible loader script before the closing </head> tag
    const updatedContent = indexContent.replace(
      '</head>',
      '  <script src="/content/bible/bible-loader.js"></script>\n  </head>'
    );
    
    // Write the updated content back to the file
    await writeFile(indexPath, updatedContent);
    
    console.log('Updated index.html to include Bible loader script.');
  } catch (err) {
    console.error('Error updating index.html:', err);
  }
}

// Main function
async function main() {
  try {
    console.log('Starting Bible content integration...');
    
    // Ensure directories exist
    await ensureDirectories();
    
    // Copy Bible loader script
    await copyLoaderScript();
    
    // Copy Bible index
    await copyBibleIndex();
    
    // Create Bible module
    await createBibleModule();
    
    // Update index.html
    await updateIndexHTML();
    
    console.log('Bible content integration complete!');
  } catch (err) {
    console.error('Error in Bible content integration:', err);
  }
}

// Run the script
main().catch(console.error);