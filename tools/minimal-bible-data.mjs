// Generate Minimal Bible Data
// This script creates a minimal sample Bible dataset with Genesis 1-3

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Directory setup
const SOURCE_DIR = path.join(__dirname, 'source');
const OUTPUT_FILE = path.join(SOURCE_DIR, 'web-bible.json');

// Genesis text (simplified and reduced)
const genesisData = {
  "Genesis": {
    "1": {
      "1": "In the beginning, God created the heavens and the earth.",
      "2": "The earth was formless and empty. Darkness was on the surface of the deep and God's Spirit was hovering over the surface of the waters.",
      "3": "God said, \"Let there be light,\" and there was light.",
      "4": "God saw the light, and saw that it was good. God divided the light from the darkness.",
      "5": "God called the light \"day\", and the darkness he called \"night\". There was evening and there was morning, the first day."
    },
    "2": {
      "1": "The heavens, the earth, and all their vast array were finished.",
      "2": "On the seventh day God finished his work which he had done; and he rested on the seventh day from all his work which he had done.",
      "3": "God blessed the seventh day, and made it holy, because he rested in it from all his work of creation which he had done."
    },
    "3": {
      "1": "Now the serpent was more subtle than any animal of the field which Yahweh God had made. He said to the woman, \"Has God really said, 'You shall not eat of any tree of the garden'?\"",
      "2": "The woman said to the serpent, \"We may eat fruit from the trees of the garden,\"",
      "3": "but not the fruit of the tree which is in the middle of the garden. God has said, \"You shall not eat of it. You shall not touch it, lest you die.\""
    }
  }
};

// Function to create the sample Bible data
async function createSampleBibleData() {
  try {
    // Ensure directory exists
    await mkdir(SOURCE_DIR, { recursive: true });
    console.log('Source directory created successfully.');
    
    // Write the sample Bible data
    await writeFile(OUTPUT_FILE, JSON.stringify(genesisData, null, 2));
    console.log(`Sample Bible data created at: ${OUTPUT_FILE}`);
    
    return genesisData;
  } catch (err) {
    console.error('Error creating sample Bible data:', err);
    throw err;
  }
}

// Main function
async function main() {
  try {
    console.log('Generating minimal Bible data...');
    await createSampleBibleData();
    console.log('Minimal Bible data generation complete!');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Run the script
main();