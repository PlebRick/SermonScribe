// Utility script to fix outline index files

import fs from 'fs';
import path from 'path';
import { Outline } from '@shared/schema';

// Define content directory (same as in fileStorage.ts)
const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Repair all outline index files to ensure they correctly reference outline files
 */
async function repairOutlineIndexes() {
  console.log('Starting repair of outline index files...');
  
  // 1. Get all outline files
  const outlineDir = path.join(CONTENT_DIR, 'outlines');
  const outlineFiles = fs.readdirSync(outlineDir)
    .filter(file => file.endsWith('.json') && !file.includes('-'));
  
  console.log(`Found ${outlineFiles.length} outline files`);
  
  // 2. Read all outlines
  const outlines: Outline[] = [];
  for (const file of outlineFiles) {
    const filePath = path.join(outlineDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const outline = JSON.parse(content) as Outline;
      outlines.push(outline);
    } catch (err) {
      console.error(`Error reading outline file ${file}:`, err);
    }
  }
  
  console.log(`Successfully loaded ${outlines.length} outlines`);
  
  // 3. Build a mapping of book-chapter to outline IDs
  const chapterMap: Record<string, number[]> = {};
  
  for (const outline of outlines) {
    // Handle both single-chapter and multi-chapter outlines
    const startChapter = outline.startChapter;
    const endChapter = outline.endChapter || startChapter;
    
    // Add to all chapters the outline spans
    for (let chapter = startChapter; chapter <= endChapter; chapter++) {
      const key = `${outline.bookId}-${chapter}`;
      if (!chapterMap[key]) {
        chapterMap[key] = [];
      }
      if (!chapterMap[key].includes(outline.id)) {
        chapterMap[key].push(outline.id);
      }
    }
  }
  
  console.log(`Built chapter map with ${Object.keys(chapterMap).length} chapter entries`);
  
  // 4. Update all index files
  for (const [chapterKey, outlineIds] of Object.entries(chapterMap)) {
    const chapterDir = path.join(outlineDir, chapterKey);
    if (!fs.existsSync(chapterDir)) {
      fs.mkdirSync(chapterDir, { recursive: true });
      console.log(`Created directory for ${chapterKey}`);
    }
    
    const indexPath = path.join(chapterDir, 'index.json');
    let existingIds: number[] = [];
    
    if (fs.existsSync(indexPath)) {
      try {
        const indexContent = fs.readFileSync(indexPath, 'utf-8');
        existingIds = JSON.parse(indexContent) as number[];
      } catch (err) {
        console.error(`Error reading index for ${chapterKey}:`, err);
      }
    }
    
    // Merge existing IDs with new ones - using Array.from() to avoid Set iteration issues
    const mergedIdsSet = new Set([...existingIds, ...outlineIds]);
    const mergedIds = Array.from(mergedIdsSet);
    
    // Write the updated index
    fs.writeFileSync(indexPath, JSON.stringify(mergedIds, null, 2));
    console.log(`Updated index for ${chapterKey} with ${mergedIds.length} outline IDs`);
  }
  
  console.log('Repair completed successfully!');
}

// Export function
export { repairOutlineIndexes };