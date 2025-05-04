// World English Bible (WEB) data - Public Domain
// https://worldenglish.bible/

import { genesis } from "./bible-content/genesis";

// Old Testament books with details
export const oldTestamentBooks = [
  { id: 1, name: 'Genesis', shortName: 'gen', testament: 'old', chapterCount: 50 },
  { id: 2, name: 'Exodus', shortName: 'exo', testament: 'old', chapterCount: 40 },
  { id: 3, name: 'Leviticus', shortName: 'lev', testament: 'old', chapterCount: 27 },
  { id: 4, name: 'Numbers', shortName: 'num', testament: 'old', chapterCount: 36 },
  { id: 5, name: 'Deuteronomy', shortName: 'deu', testament: 'old', chapterCount: 34 },
  { id: 6, name: 'Joshua', shortName: 'jos', testament: 'old', chapterCount: 24 },
  { id: 7, name: 'Judges', shortName: 'jdg', testament: 'old', chapterCount: 21 },
  { id: 8, name: 'Ruth', shortName: 'rut', testament: 'old', chapterCount: 4 },
  { id: 9, name: '1 Samuel', shortName: '1sa', testament: 'old', chapterCount: 31 },
  { id: 10, name: '2 Samuel', shortName: '2sa', testament: 'old', chapterCount: 24 },
  { id: 11, name: '1 Kings', shortName: '1ki', testament: 'old', chapterCount: 22 },
  { id: 12, name: '2 Kings', shortName: '2ki', testament: 'old', chapterCount: 25 },
  { id: 13, name: '1 Chronicles', shortName: '1ch', testament: 'old', chapterCount: 29 },
  { id: 14, name: '2 Chronicles', shortName: '2ch', testament: 'old', chapterCount: 36 },
  { id: 15, name: 'Ezra', shortName: 'ezr', testament: 'old', chapterCount: 10 },
  { id: 16, name: 'Nehemiah', shortName: 'neh', testament: 'old', chapterCount: 13 },
  { id: 17, name: 'Esther', shortName: 'est', testament: 'old', chapterCount: 10 },
  { id: 18, name: 'Job', shortName: 'job', testament: 'old', chapterCount: 42 },
  { id: 19, name: 'Psalms', shortName: 'psa', testament: 'old', chapterCount: 150 },
  { id: 20, name: 'Proverbs', shortName: 'pro', testament: 'old', chapterCount: 31 },
  { id: 21, name: 'Ecclesiastes', shortName: 'ecc', testament: 'old', chapterCount: 12 },
  { id: 22, name: 'Song of Solomon', shortName: 'sng', testament: 'old', chapterCount: 8 },
  { id: 23, name: 'Isaiah', shortName: 'isa', testament: 'old', chapterCount: 66 },
  { id: 24, name: 'Jeremiah', shortName: 'jer', testament: 'old', chapterCount: 52 },
  { id: 25, name: 'Lamentations', shortName: 'lam', testament: 'old', chapterCount: 5 },
  { id: 26, name: 'Ezekiel', shortName: 'ezk', testament: 'old', chapterCount: 48 },
  { id: 27, name: 'Daniel', shortName: 'dan', testament: 'old', chapterCount: 12 },
  { id: 28, name: 'Hosea', shortName: 'hos', testament: 'old', chapterCount: 14 },
  { id: 29, name: 'Joel', shortName: 'jol', testament: 'old', chapterCount: 3 },
  { id: 30, name: 'Amos', shortName: 'amo', testament: 'old', chapterCount: 9 },
  { id: 31, name: 'Obadiah', shortName: 'oba', testament: 'old', chapterCount: 1 },
  { id: 32, name: 'Jonah', shortName: 'jon', testament: 'old', chapterCount: 4 },
  { id: 33, name: 'Micah', shortName: 'mic', testament: 'old', chapterCount: 7 },
  { id: 34, name: 'Nahum', shortName: 'nam', testament: 'old', chapterCount: 3 },
  { id: 35, name: 'Habakkuk', shortName: 'hab', testament: 'old', chapterCount: 3 },
  { id: 36, name: 'Zephaniah', shortName: 'zep', testament: 'old', chapterCount: 3 },
  { id: 37, name: 'Haggai', shortName: 'hag', testament: 'old', chapterCount: 2 },
  { id: 38, name: 'Zechariah', shortName: 'zec', testament: 'old', chapterCount: 14 },
  { id: 39, name: 'Malachi', shortName: 'mal', testament: 'old', chapterCount: 4 }
];

// New Testament books with details
export const newTestamentBooks = [
  { id: 40, name: 'Matthew', shortName: 'mat', testament: 'new', chapterCount: 28 },
  { id: 41, name: 'Mark', shortName: 'mrk', testament: 'new', chapterCount: 16 },
  { id: 42, name: 'Luke', shortName: 'luk', testament: 'new', chapterCount: 24 },
  { id: 43, name: 'John', shortName: 'jhn', testament: 'new', chapterCount: 21 },
  { id: 44, name: 'Acts', shortName: 'act', testament: 'new', chapterCount: 28 },
  { id: 45, name: 'Romans', shortName: 'rom', testament: 'new', chapterCount: 16 },
  { id: 46, name: '1 Corinthians', shortName: '1co', testament: 'new', chapterCount: 16 },
  { id: 47, name: '2 Corinthians', shortName: '2co', testament: 'new', chapterCount: 13 },
  { id: 48, name: 'Galatians', shortName: 'gal', testament: 'new', chapterCount: 6 },
  { id: 49, name: 'Ephesians', shortName: 'eph', testament: 'new', chapterCount: 6 },
  { id: 50, name: 'Philippians', shortName: 'php', testament: 'new', chapterCount: 4 },
  { id: 51, name: 'Colossians', shortName: 'col', testament: 'new', chapterCount: 4 },
  { id: 52, name: '1 Thessalonians', shortName: '1th', testament: 'new', chapterCount: 5 },
  { id: 53, name: '2 Thessalonians', shortName: '2th', testament: 'new', chapterCount: 3 },
  { id: 54, name: '1 Timothy', shortName: '1ti', testament: 'new', chapterCount: 6 },
  { id: 55, name: '2 Timothy', shortName: '2ti', testament: 'new', chapterCount: 4 },
  { id: 56, name: 'Titus', shortName: 'tit', testament: 'new', chapterCount: 3 },
  { id: 57, name: 'Philemon', shortName: 'phm', testament: 'new', chapterCount: 1 },
  { id: 58, name: 'Hebrews', shortName: 'heb', testament: 'new', chapterCount: 13 },
  { id: 59, name: 'James', shortName: 'jas', testament: 'new', chapterCount: 5 },
  { id: 60, name: '1 Peter', shortName: '1pe', testament: 'new', chapterCount: 5 },
  { id: 61, name: '2 Peter', shortName: '2pe', testament: 'new', chapterCount: 3 },
  { id: 62, name: '1 John', shortName: '1jn', testament: 'new', chapterCount: 5 },
  { id: 63, name: '2 John', shortName: '2jn', testament: 'new', chapterCount: 1 },
  { id: 64, name: '3 John', shortName: '3jn', testament: 'new', chapterCount: 1 },
  { id: 65, name: 'Jude', shortName: 'jud', testament: 'new', chapterCount: 1 },
  { id: 66, name: 'Revelation', shortName: 'rev', testament: 'new', chapterCount: 22 }
];

// Helper function to get books by testament
export const getTestamentBooks = (testament: string) => {
  if (testament === 'old') {
    return oldTestamentBooks;
  } else {
    return newTestamentBooks;
  }
};

// Get chapters for a book
export const getBibleChapters = (bookId: number) => {
  const allBooks = [...oldTestamentBooks, ...newTestamentBooks];
  const book = allBooks.find(b => b.id === bookId);
  
  if (!book) return [];
  
  return Array.from({ length: book.chapterCount }, (_, i) => ({
    number: i + 1,
    verses: []
  }));
};

// Get book by ID
export const getBookById = (id: number) => {
  const allBooks = [...oldTestamentBooks, ...newTestamentBooks];
  return allBooks.find(book => book.id === id);
};

// Get book by short name
export const getBookByShortName = (shortName: string) => {
  const allBooks = [...oldTestamentBooks, ...newTestamentBooks];
  return allBooks.find(book => book.shortName === shortName);
};

// Export Bible book data for our application
export const bibleBooks = [...oldTestamentBooks, ...newTestamentBooks];

// Export Bible content data for our application
export const bibleContent = {
  genesis
};
