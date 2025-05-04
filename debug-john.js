import fs from 'fs';
import path from 'path';

// Read the John content file
const johnContent = fs.readFileSync('./client/src/lib/bible-content/john.ts', 'utf8');

// Log some basic info
console.log('File content length:', johnContent.length);

// Extract and log the chapter metadata - check how many chapters are defined
try {
  // This is a simple extraction - it's not perfect but helps debugging
  const chapters = johnContent.match(/id: \d+,\s+chapter: \d+/g);
  console.log('Chapters defined:', chapters ? chapters.length : 0);
  console.log('Chapters:', chapters);
  
  // Try to see if chapter 10 is defined correctly
  const chapter10 = johnContent.includes('id: 10,') || johnContent.includes('id: 10\n') || 
                   johnContent.includes('id:10,');
  console.log('Chapter 10 found (simple check):', chapter10);
  
} catch (err) {
  console.error('Error parsing file:', err);
}

// Now let's try to actually parse the TS as JS using eval (not ideal, but for debugging only)
try {
  // Prepare the content for eval by removing export and fixing any TS-specific syntax
  const jsContent = johnContent
    .replace('export const john =', 'const john =');
  
  // Evaluate to get the object (this is not safe for production, only debugging)
  eval(jsContent);
  
  // Check if we can access the john object
  console.log('john object chapters length:', john?.chapters?.length);
  
  // Check specifically for chapter 10
  const chapter10 = john?.chapters?.find(c => c.id === 10);
  console.log('Chapter 10 from object:', chapter10 ? 'Found' : 'Not found');
  
} catch (err) {
  console.error('Error evaluating JS:', err);
}