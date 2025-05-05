// Generate Sample Bible Data
// This script creates a small sample Bible dataset with Genesis 1-3

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

// Genesis text (first 3 chapters)
const genesisData = {
  "Genesis": {
    "1": {
      "1": "In the beginning, God created the heavens and the earth.",
      "2": "The earth was formless and empty. Darkness was on the surface of the deep and God's Spirit was hovering over the surface of the waters.",
      "3": "God said, \"Let there be light,\" and there was light.",
      "4": "God saw the light, and saw that it was good. God divided the light from the darkness.",
      "5": "God called the light \"day\", and the darkness he called \"night\". There was evening and there was morning, the first day.",
      "6": "God said, "Let there be an expanse in the middle of the waters, and let it divide the waters from the waters."",
      "7": "God made the expanse, and divided the waters which were under the expanse from the waters which were above the expanse; and it was so.",
      "8": "God called the expanse "sky". There was evening and there was morning, a second day.",
      "9": "God said, "Let the waters under the sky be gathered together to one place, and let the dry land appear"; and it was so.",
      "10": "God called the dry land "earth", and the gathering together of the waters he called "seas". God saw that it was good.",
      "11": "God said, "Let the earth yield grass, herbs yielding seeds, and fruit trees bearing fruit after their kind, with their seeds in it, on the earth"; and it was so.",
      "12": "The earth yielded grass, herbs yielding seed after their kind, and trees bearing fruit, with their seeds in it, after their kind; and God saw that it was good.",
      "13": "There was evening and there was morning, a third day.",
      "14": "God said, "Let there be lights in the expanse of the sky to divide the day from the night; and let them be for signs to mark seasons, days, and years;",
      "15": "and let them be for lights in the expanse of the sky to give light on the earth"; and it was so.",
      "16": "God made the two great lights: the greater light to rule the day, and the lesser light to rule the night. He also made the stars.",
      "17": "God set them in the expanse of the sky to give light to the earth,",
      "18": "and to rule over the day and over the night, and to divide the light from the darkness. God saw that it was good.",
      "19": "There was evening and there was morning, a fourth day.",
      "20": "God said, "Let the waters abound with living creatures, and let birds fly above the earth in the open expanse of the sky."",
      "21": "God created the large sea creatures and every living creature that moves, with which the waters swarmed, after their kind, and every winged bird after its kind. God saw that it was good.",
      "22": "God blessed them, saying, "Be fruitful, and multiply, and fill the waters in the seas, and let birds multiply on the earth."",
      "23": "There was evening and there was morning, a fifth day.",
      "24": "God said, "Let the earth produce living creatures after their kind, livestock, creeping things, and animals of the earth after their kind"; and it was so.",
      "25": "God made the animals of the earth after their kind, and the livestock after their kind, and everything that creeps on the ground after its kind. God saw that it was good.",
      "26": "God said, "Let's make man in our image, after our likeness. Let them have dominion over the fish of the sea, and over the birds of the sky, and over the livestock, and over all the earth, and over every creeping thing that creeps on the earth."",
      "27": "God created man in his own image. In God's image he created him; male and female he created them.",
      "28": "God blessed them. God said to them, "Be fruitful, multiply, fill the earth, and subdue it. Have dominion over the fish of the sea, over the birds of the sky, and over every living thing that moves on the earth."",
      "29": "God said, "Behold, I have given you every herb yielding seed, which is on the surface of all the earth, and every tree, which bears fruit yielding seed. It will be your food.",
      "30": "To every animal of the earth, and to every bird of the sky, and to everything that creeps on the earth, in which there is life, I have given every green herb for food;" and it was so.",
      "31": "God saw everything that he had made, and, behold, it was very good. There was evening and there was morning, a sixth day."
    },
    "2": {
      "1": "The heavens, the earth, and all their vast array were finished.",
      "2": "On the seventh day God finished his work which he had done; and he rested on the seventh day from all his work which he had done.",
      "3": "God blessed the seventh day, and made it holy, because he rested in it from all his work of creation which he had done.",
      "4": "This is the history of the generations of the heavens and of the earth when they were created, in the day that Yahweh God made the earth and the heavens.",
      "5": "No plant of the field was yet in the earth, and no herb of the field had yet sprung up; for Yahweh God had not caused it to rain on the earth. There was not a man to till the ground,",
      "6": "but a mist went up from the earth, and watered the whole surface of the ground.",
      "7": "Yahweh God formed man from the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.",
      "8": "Yahweh God planted a garden eastward, in Eden, and there he put the man whom he had formed.",
      "9": "Out of the ground Yahweh God made every tree to grow that is pleasant to the sight, and good for food, including the tree of life in the middle of the garden and the tree of the knowledge of good and evil.",
      "10": "A river went out of Eden to water the garden; and from there it was parted, and became the source of four rivers.",
      "11": "The name of the first is Pishon: it flows through the whole land of Havilah, where there is gold;",
      "12": "and the gold of that land is good. Bdellium and onyx stone are also there.",
      "13": "The name of the second river is Gihon. It is the same river that flows through the whole land of Cush.",
      "14": "The name of the third river is Hiddekel. This is the one which flows in front of Assyria. The fourth river is the Euphrates.",
      "15": "Yahweh God took the man, and put him into the garden of Eden to cultivate and keep it.",
      "16": "Yahweh God commanded the man, saying, "You may freely eat of every tree of the garden;",
      "17": "but you shall not eat of the tree of the knowledge of good and evil; for in the day that you eat of it, you will surely die."",
      "18": "Yahweh God said, "It is not good for the man to be alone. I will make him a helper comparable to him."",
      "19": "Out of the ground Yahweh God formed every animal of the field, and every bird of the sky, and brought them to the man to see what he would call them. Whatever the man called every living creature became its name.",
      "20": "The man gave names to all livestock, and to the birds of the sky, and to every animal of the field; but for man there was not found a helper comparable to him.",
      "21": "Yahweh God caused the man to fall into a deep sleep. As the man slept, he took one of his ribs, and closed up the flesh in its place.",
      "22": "Yahweh God made a woman from the rib which he had taken from the man, and brought her to the man.",
      "23": "The man said, "This is now bone of my bones, and flesh of my flesh. She will be called 'woman,' because she was taken out of Man."",
      "24": "Therefore a man will leave his father and his mother, and will join with his wife, and they will be one flesh.",
      "25": "The man and his wife were both naked, and they were not ashamed."
    },
    "3": {
      "1": "Now the serpent was more subtle than any animal of the field which Yahweh God had made. He said to the woman, "Has God really said, 'You shall not eat of any tree of the garden'?"",
      "2": "The woman said to the serpent, "We may eat fruit from the trees of the garden,",
      "3": "but not the fruit of the tree which is in the middle of the garden. God has said, 'You shall not eat of it. You shall not touch it, lest you die.'"",
      "4": "The serpent said to the woman, "You won't really die,",
      "5": "for God knows that in the day you eat it, your eyes will be opened, and you will be like God, knowing good and evil."",
      "6": "When the woman saw that the tree was good for food, and that it was a delight to the eyes, and that the tree was to be desired to make one wise, she took some of its fruit, and ate. Then she gave some to her husband with her, and he ate it, too.",
      "7": "Their eyes were opened, and they both knew that they were naked. They sewed fig leaves together, and made coverings for themselves.",
      "8": "They heard Yahweh God's voice walking in the garden in the cool of the day, and the man and his wife hid themselves from the presence of Yahweh God among the trees of the garden.",
      "9": "Yahweh God called to the man, and said to him, "Where are you?"",
      "10": "The man said, "I heard your voice in the garden, and I was afraid, because I was naked; so I hid myself."",
      "11": "God said, "Who told you that you were naked? Have you eaten from the tree that I commanded you not to eat from?"",
      "12": "The man said, "The woman whom you gave to be with me, she gave me fruit from the tree, and I ate it."",
      "13": "Yahweh God said to the woman, "What have you done?" The woman said, "The serpent deceived me, and I ate."",
      "14": "Yahweh God said to the serpent, "Because you have done this, you are cursed above all livestock, and above every animal of the field. You shall go on your belly and you shall eat dust all the days of your life.",
      "15": "I will put hostility between you and the woman, and between your offspring and her offspring. He will bruise your head, and you will bruise his heel."",
      "16": "To the woman he said, "I will greatly multiply your pain in childbirth. You will bear children in pain. Your desire will be for your husband, and he will rule over you."",
      "17": "To Adam he said, "Because you have listened to your wife's voice, and have eaten from the tree, about which I commanded you, saying, 'You shall not eat of it,' the ground is cursed for your sake. You will eat from it with much labor all the days of your life.",
      "18": "It will yield thorns and thistles to you; and you will eat the herb of the field.",
      "19": "You will eat bread by the sweat of your face until you return to the ground, for you were taken out of it. For you are dust, and you shall return to dust."",
      "20": "The man called his wife Eve because she would be the mother of all the living.",
      "21": "Yahweh God made garments of animal skins for Adam and for his wife, and clothed them.",
      "22": "Yahweh God said, "Behold, the man has become like one of us, knowing good and evil. Now, lest he reach out his hand, and also take of the tree of life, and eat, and live forever—"",
      "23": "Therefore Yahweh God sent him out from the garden of Eden, to till the ground from which he was taken.",
      "24": "So he drove out the man; and he placed cherubim at the east of the garden of Eden, and a flaming sword which turned every way, to guard the way to the tree of life."
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
    console.log('Generating sample Bible data...');
    await createSampleBibleData();
    console.log('Sample Bible data generation complete!');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Run the script
main();