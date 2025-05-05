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

// Bible text (simplified and reduced)
const bibleData = {
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
      "3": "God blessed the seventh day, and made it holy, because he rested in it from all his work of creation which he had done.",
      "4": "This is the history of the generations of the heavens and of the earth when they were created, in the day that Yahweh God made the earth and the heavens.",
      "5": "No plant of the field was yet in the earth, and no herb of the field had yet sprung up; for Yahweh God had not caused it to rain on the earth. There was not a man to till the ground,",
      "6": "but a mist went up from the earth, and watered the whole surface of the ground.",
      "7": "Yahweh God formed man from the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul."
    },
    "3": {
      "1": "Now the serpent was more subtle than any animal of the field which Yahweh God had made. He said to the woman, \"Has God really said, 'You shall not eat of any tree of the garden'?\"",
      "2": "The woman said to the serpent, \"We may eat fruit from the trees of the garden,\"",
      "3": "but not the fruit of the tree which is in the middle of the garden. God has said, \"You shall not eat of it. You shall not touch it, lest you die.\"",
      "4": "The serpent said to the woman, \"You won't really die,\"",
      "5": "for God knows that in the day you eat it, your eyes will be opened, and you will be like God, knowing good and evil."
    }
  },
  "Romans": {
    "1": {
      "1": "Paul, a servant of Jesus Christ, called to be an apostle, set apart for the Good News of God,",
      "2": "which he promised before through his prophets in the holy Scriptures,",
      "3": "concerning his Son, who was born of the offspring of David according to the flesh,",
      "4": "who was declared to be the Son of God with power, according to the Spirit of holiness, by the resurrection from the dead, Jesus Christ our Lord,",
      "5": "through whom we received grace and apostleship, for obedience of faith among all the nations, for his name's sake;",
      "6": "among whom you are also called to belong to Jesus Christ;",
      "7": "to all who are in Rome, beloved of God, called to be saints: Grace to you and peace from God our Father and the Lord Jesus Christ.",
      "8": "First, I thank my God through Jesus Christ for all of you, that your faith is proclaimed throughout the whole world.",
      "9": "For God is my witness, whom I serve in my spirit in the Good News of his Son, how unceasingly I make mention of you always in my prayers,",
      "10": "requesting, if by any means now at last I may be prospered by the will of God to come to you.",
      "11": "For I long to see you, that I may impart to you some spiritual gift, to the end that you may be established;",
      "12": "that is, that I with you may be encouraged in you, each of us by the other's faith, both yours and mine."
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
    await writeFile(OUTPUT_FILE, JSON.stringify(bibleData, null, 2));
    console.log(`Sample Bible data created at: ${OUTPUT_FILE}`);
    
    return bibleData;
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