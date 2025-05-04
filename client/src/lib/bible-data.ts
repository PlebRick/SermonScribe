// This file contains sample Bible data structure
// A production version would use a complete Bible text API or database

// Sample structure for Bible books
export const getTestamentBooks = (testament: string) => {
  if (testament === 'old') {
    return [
      { id: 'gen', name: 'Genesis', chapters: 50 },
      { id: 'exo', name: 'Exodus', chapters: 40 },
      { id: 'lev', name: 'Leviticus', chapters: 27 },
      { id: 'num', name: 'Numbers', chapters: 36 },
      { id: 'deu', name: 'Deuteronomy', chapters: 34 },
      { id: 'jos', name: 'Joshua', chapters: 24 },
      { id: 'jdg', name: 'Judges', chapters: 21 },
      { id: 'rut', name: 'Ruth', chapters: 4 },
      { id: '1sa', name: '1 Samuel', chapters: 31 },
      { id: '2sa', name: '2 Samuel', chapters: 24 },
      { id: '1ki', name: '1 Kings', chapters: 22 },
      { id: '2ki', name: '2 Kings', chapters: 25 },
      { id: '1ch', name: '1 Chronicles', chapters: 29 },
      { id: '2ch', name: '2 Chronicles', chapters: 36 },
      { id: 'ezr', name: 'Ezra', chapters: 10 },
      { id: 'neh', name: 'Nehemiah', chapters: 13 },
      { id: 'est', name: 'Esther', chapters: 10 },
      { id: 'job', name: 'Job', chapters: 42 },
      { id: 'psa', name: 'Psalms', chapters: 150 },
      { id: 'pro', name: 'Proverbs', chapters: 31 },
      { id: 'ecc', name: 'Ecclesiastes', chapters: 12 },
      { id: 'sng', name: 'Song of Solomon', chapters: 8 },
      { id: 'isa', name: 'Isaiah', chapters: 66 },
      { id: 'jer', name: 'Jeremiah', chapters: 52 },
      { id: 'lam', name: 'Lamentations', chapters: 5 },
      { id: 'ezk', name: 'Ezekiel', chapters: 48 },
      { id: 'dan', name: 'Daniel', chapters: 12 },
      { id: 'hos', name: 'Hosea', chapters: 14 },
      { id: 'jol', name: 'Joel', chapters: 3 },
      { id: 'amo', name: 'Amos', chapters: 9 },
      { id: 'oba', name: 'Obadiah', chapters: 1 },
      { id: 'jon', name: 'Jonah', chapters: 4 },
      { id: 'mic', name: 'Micah', chapters: 7 },
      { id: 'nam', name: 'Nahum', chapters: 3 },
      { id: 'hab', name: 'Habakkuk', chapters: 3 },
      { id: 'zep', name: 'Zephaniah', chapters: 3 },
      { id: 'hag', name: 'Haggai', chapters: 2 },
      { id: 'zec', name: 'Zechariah', chapters: 14 },
      { id: 'mal', name: 'Malachi', chapters: 4 }
    ];
  } else {
    return [
      { id: 'mat', name: 'Matthew', chapters: 28 },
      { id: 'mrk', name: 'Mark', chapters: 16 },
      { id: 'luk', name: 'Luke', chapters: 24 },
      { id: 'jhn', name: 'John', chapters: 21 },
      { id: 'act', name: 'Acts', chapters: 28 },
      { id: 'rom', name: 'Romans', chapters: 16 },
      { id: '1co', name: '1 Corinthians', chapters: 16 },
      { id: '2co', name: '2 Corinthians', chapters: 13 },
      { id: 'gal', name: 'Galatians', chapters: 6 },
      { id: 'eph', name: 'Ephesians', chapters: 6 },
      { id: 'php', name: 'Philippians', chapters: 4 },
      { id: 'col', name: 'Colossians', chapters: 4 },
      { id: '1th', name: '1 Thessalonians', chapters: 5 },
      { id: '2th', name: '2 Thessalonians', chapters: 3 },
      { id: '1ti', name: '1 Timothy', chapters: 6 },
      { id: '2ti', name: '2 Timothy', chapters: 4 },
      { id: 'tit', name: 'Titus', chapters: 3 },
      { id: 'phm', name: 'Philemon', chapters: 1 },
      { id: 'heb', name: 'Hebrews', chapters: 13 },
      { id: 'jas', name: 'James', chapters: 5 },
      { id: '1pe', name: '1 Peter', chapters: 5 },
      { id: '2pe', name: '2 Peter', chapters: 3 },
      { id: '1jn', name: '1 John', chapters: 5 },
      { id: '2jn', name: '2 John', chapters: 1 },
      { id: '3jn', name: '3 John', chapters: 1 },
      { id: 'jud', name: 'Jude', chapters: 1 },
      { id: 'rev', name: 'Revelation', chapters: 22 }
    ];
  }
};

// Get chapters for a book
export const getBibleChapters = (bookId: string) => {
  const oldTestamentBooks = getTestamentBooks('old');
  const newTestamentBooks = getTestamentBooks('new');
  const allBooks = [...oldTestamentBooks, ...newTestamentBooks];
  
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return [];
  
  return Array.from({ length: book.chapters }, (_, i) => ({
    number: i + 1,
    verses: []
  }));
};

// Sample Genesis 1 content
const genesis1 = {
  id: 'gen',
  chapters: [
    {
      number: 1,
      verses: [
        "In the beginning, God created the heavens and the earth.",
        "The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.",
        "And God said, \"Let there be light,\" and there was light.",
        "And God saw that the light was good. And God separated the light from the darkness.",
        "God called the light Day, and the darkness he called Night. And there was evening and there was morning, the first day.",
        "And God said, \"Let there be an expanse in the midst of the waters, and let it separate the waters from the waters.\"",
        "And God made the expanse and separated the waters that were under the expanse from the waters that were above the expanse. And it was so.",
        "And God called the expanse Heaven. And there was evening and there was morning, the second day.",
        "And God said, \"Let the waters under the heavens be gathered together into one place, and let the dry land appear.\" And it was so.",
        "God called the dry land Earth, and the waters that were gathered together he called Seas. And God saw that it was good.",
        "And God said, \"Let the earth sprout vegetation, plants yielding seed, and fruit trees bearing fruit in which is their seed, each according to its kind, on the earth.\" And it was so.",
        "The earth brought forth vegetation, plants yielding seed according to their own kinds, and trees bearing fruit in which is their seed, each according to its kind. And God saw that it was good.",
        "And there was evening and there was morning, the third day.",
        "And God said, \"Let there be lights in the expanse of the heavens to separate the day from the night. And let them be for signs and for seasons, and for days and years,",
        "and let them be lights in the expanse of the heavens to give light upon the earth.\" And it was so.",
        "And God made the two great lights—the greater light to rule the day and the lesser light to rule the night—and the stars.",
        "And God set them in the expanse of the heavens to give light on the earth,",
        "to rule over the day and over the night, and to separate the light from the darkness. And God saw that it was good.",
        "And there was evening and there was morning, the fourth day.",
        "And God said, \"Let the waters swarm with swarms of living creatures, and let birds fly above the earth across the expanse of the heavens.\"",
        "So God created the great sea creatures and every living creature that moves, with which the waters swarm, according to their kinds, and every winged bird according to its kind. And God saw that it was good.",
        "And God blessed them, saying, \"Be fruitful and multiply and fill the waters in the seas, and let birds multiply on the earth.\"",
        "And there was evening and there was morning, the fifth day.",
        "And God said, \"Let the earth bring forth living creatures according to their kinds—livestock and creeping things and beasts of the earth according to their kinds.\" And it was so.",
        "And God made the beasts of the earth according to their kinds and the livestock according to their kinds, and everything that creeps on the ground according to its kind. And God saw that it was good.",
        "Then God said, \"Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth.\"",
        "So God created man in his own image, in the image of God he created him; male and female he created them.",
        "And God blessed them. And God said to them, \"Be fruitful and multiply and fill the earth and subdue it, and have dominion over the fish of the sea and over the birds of the heavens and over every living thing that moves on the earth.\"",
        "And God said, \"Behold, I have given you every plant yielding seed that is on the face of all the earth, and every tree with seed in its fruit. You shall have them for food.",
        "And to every beast of the earth and to every bird of the heavens and to everything that creeps on the earth, everything that has the breath of life, I have given every green plant for food.\" And it was so.",
        "And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day."
      ]
    }
  ]
};

// Export sample Bible data for our application
export const bibleData = [genesis1];
