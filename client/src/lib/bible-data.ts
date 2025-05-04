// World English Bible (WEB) data - Public Domain
// https://worldenglish.bible/

import { genesis } from "./bible-content/genesis";
import { exodus } from "./bible-content/exodus";
import { matthew } from "./bible-content/matthew"; 
import { mark } from "./bible-content/mark";
import { john } from "./bible-content/john";

// Old Testament books with details
export const oldTestamentBooks = [
  { id: 1, name: 'Genesis', shortName: 'gen', testament: 'old', chapterCount: 50, position: 1 },
  { id: 2, name: 'Exodus', shortName: 'exo', testament: 'old', chapterCount: 40, position: 2 },
  { id: 3, name: 'Leviticus', shortName: 'lev', testament: 'old', chapterCount: 27, position: 3 },
  { id: 4, name: 'Numbers', shortName: 'num', testament: 'old', chapterCount: 36, position: 4 },
  { id: 5, name: 'Deuteronomy', shortName: 'deu', testament: 'old', chapterCount: 34, position: 5 },
  { id: 6, name: 'Joshua', shortName: 'jos', testament: 'old', chapterCount: 24, position: 6 },
  { id: 7, name: 'Judges', shortName: 'jdg', testament: 'old', chapterCount: 21, position: 7 },
  { id: 8, name: 'Ruth', shortName: 'rut', testament: 'old', chapterCount: 4, position: 8 },
  { id: 9, name: '1 Samuel', shortName: '1sa', testament: 'old', chapterCount: 31, position: 9 },
  { id: 10, name: '2 Samuel', shortName: '2sa', testament: 'old', chapterCount: 24, position: 10 },
  { id: 11, name: '1 Kings', shortName: '1ki', testament: 'old', chapterCount: 22, position: 11 },
  { id: 12, name: '2 Kings', shortName: '2ki', testament: 'old', chapterCount: 25, position: 12 },
  { id: 13, name: '1 Chronicles', shortName: '1ch', testament: 'old', chapterCount: 29, position: 13 },
  { id: 14, name: '2 Chronicles', shortName: '2ch', testament: 'old', chapterCount: 36, position: 14 },
  { id: 15, name: 'Ezra', shortName: 'ezr', testament: 'old', chapterCount: 10, position: 15 },
  { id: 16, name: 'Nehemiah', shortName: 'neh', testament: 'old', chapterCount: 13, position: 16 },
  { id: 17, name: 'Esther', shortName: 'est', testament: 'old', chapterCount: 10, position: 17 },
  { id: 18, name: 'Job', shortName: 'job', testament: 'old', chapterCount: 42, position: 18 },
  { id: 19, name: 'Psalms', shortName: 'psa', testament: 'old', chapterCount: 150, position: 19 },
  { id: 20, name: 'Proverbs', shortName: 'pro', testament: 'old', chapterCount: 31, position: 20 },
  { id: 21, name: 'Ecclesiastes', shortName: 'ecc', testament: 'old', chapterCount: 12, position: 21 },
  { id: 22, name: 'Song of Solomon', shortName: 'sng', testament: 'old', chapterCount: 8, position: 22 },
  { id: 23, name: 'Isaiah', shortName: 'isa', testament: 'old', chapterCount: 66, position: 23 },
  { id: 24, name: 'Jeremiah', shortName: 'jer', testament: 'old', chapterCount: 52, position: 24 },
  { id: 25, name: 'Lamentations', shortName: 'lam', testament: 'old', chapterCount: 5, position: 25 },
  { id: 26, name: 'Ezekiel', shortName: 'ezk', testament: 'old', chapterCount: 48, position: 26 },
  { id: 27, name: 'Daniel', shortName: 'dan', testament: 'old', chapterCount: 12, position: 27 },
  { id: 28, name: 'Hosea', shortName: 'hos', testament: 'old', chapterCount: 14, position: 28 },
  { id: 29, name: 'Joel', shortName: 'jol', testament: 'old', chapterCount: 3, position: 29 },
  { id: 30, name: 'Amos', shortName: 'amo', testament: 'old', chapterCount: 9, position: 30 },
  { id: 31, name: 'Obadiah', shortName: 'oba', testament: 'old', chapterCount: 1, position: 31 },
  { id: 32, name: 'Jonah', shortName: 'jon', testament: 'old', chapterCount: 4, position: 32 },
  { id: 33, name: 'Micah', shortName: 'mic', testament: 'old', chapterCount: 7, position: 33 },
  { id: 34, name: 'Nahum', shortName: 'nam', testament: 'old', chapterCount: 3, position: 34 },
  { id: 35, name: 'Habakkuk', shortName: 'hab', testament: 'old', chapterCount: 3, position: 35 },
  { id: 36, name: 'Zephaniah', shortName: 'zep', testament: 'old', chapterCount: 3, position: 36 },
  { id: 37, name: 'Haggai', shortName: 'hag', testament: 'old', chapterCount: 2, position: 37 },
  { id: 38, name: 'Zechariah', shortName: 'zec', testament: 'old', chapterCount: 14, position: 38 },
  { id: 39, name: 'Malachi', shortName: 'mal', testament: 'old', chapterCount: 4, position: 39 }
];

// New Testament books with details
export const newTestamentBooks = [
  { id: 40, name: 'Matthew', shortName: 'mat', testament: 'new', chapterCount: 28, position: 40 },
  { id: 41, name: 'Mark', shortName: 'mrk', testament: 'new', chapterCount: 16, position: 41 },
  { id: 42, name: 'Luke', shortName: 'luk', testament: 'new', chapterCount: 24, position: 42 },
  { id: 43, name: 'John', shortName: 'jhn', testament: 'new', chapterCount: 21, position: 43 },
  { id: 44, name: 'Acts', shortName: 'act', testament: 'new', chapterCount: 28, position: 44 },
  { id: 45, name: 'Romans', shortName: 'rom', testament: 'new', chapterCount: 16, position: 45 },
  { id: 46, name: '1 Corinthians', shortName: '1co', testament: 'new', chapterCount: 16, position: 46 },
  { id: 47, name: '2 Corinthians', shortName: '2co', testament: 'new', chapterCount: 13, position: 47 },
  { id: 48, name: 'Galatians', shortName: 'gal', testament: 'new', chapterCount: 6, position: 48 },
  { id: 49, name: 'Ephesians', shortName: 'eph', testament: 'new', chapterCount: 6, position: 49 },
  { id: 50, name: 'Philippians', shortName: 'php', testament: 'new', chapterCount: 4, position: 50 },
  { id: 51, name: 'Colossians', shortName: 'col', testament: 'new', chapterCount: 4, position: 51 },
  { id: 52, name: '1 Thessalonians', shortName: '1th', testament: 'new', chapterCount: 5, position: 52 },
  { id: 53, name: '2 Thessalonians', shortName: '2th', testament: 'new', chapterCount: 3, position: 53 },
  { id: 54, name: '1 Timothy', shortName: '1ti', testament: 'new', chapterCount: 6, position: 54 },
  { id: 55, name: '2 Timothy', shortName: '2ti', testament: 'new', chapterCount: 4, position: 55 },
  { id: 56, name: 'Titus', shortName: 'tit', testament: 'new', chapterCount: 3, position: 56 },
  { id: 57, name: 'Philemon', shortName: 'phm', testament: 'new', chapterCount: 1, position: 57 },
  { id: 58, name: 'Hebrews', shortName: 'heb', testament: 'new', chapterCount: 13, position: 58 },
  { id: 59, name: 'James', shortName: 'jas', testament: 'new', chapterCount: 5, position: 59 },
  { id: 60, name: '1 Peter', shortName: '1pe', testament: 'new', chapterCount: 5, position: 60 },
  { id: 61, name: '2 Peter', shortName: '2pe', testament: 'new', chapterCount: 3, position: 61 },
  { id: 62, name: '1 John', shortName: '1jn', testament: 'new', chapterCount: 5, position: 62 },
  { id: 63, name: '2 John', shortName: '2jn', testament: 'new', chapterCount: 1, position: 63 },
  { id: 64, name: '3 John', shortName: '3jn', testament: 'new', chapterCount: 1, position: 64 },
  { id: 65, name: 'Jude', shortName: 'jud', testament: 'new', chapterCount: 1, position: 65 },
  { id: 66, name: 'Revelation', shortName: 'rev', testament: 'new', chapterCount: 22, position: 66 }
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
  // Old Testament fully defined
  genesis,
  exodus,
  // Old Testament placeholders
  leviticus: { shortName: 'lev' },
  numbers: { shortName: 'num' },
  deuteronomy: { shortName: 'deu' },
  joshua: { shortName: 'jos' },
  judges: { shortName: 'jdg' },
  ruth: { shortName: 'rut' },
  samuel1: { shortName: '1sa' },
  samuel2: { shortName: '2sa' },
  kings1: { shortName: '1ki' },
  kings2: { shortName: '2ki' },
  chronicles1: { shortName: '1ch' },
  chronicles2: { shortName: '2ch' },
  ezra: { shortName: 'ezr' },
  nehemiah: { shortName: 'neh' },
  esther: { shortName: 'est' },
  job: { shortName: 'job' },
  psalms: { shortName: 'psa' },
  proverbs: { shortName: 'pro' },
  ecclesiastes: { shortName: 'ecc' },
  songofsolomon: { shortName: 'sng' },
  isaiah: { shortName: 'isa' },
  jeremiah: { shortName: 'jer' },
  lamentations: { shortName: 'lam' },
  ezekiel: { shortName: 'ezk' },
  daniel: { shortName: 'dan' },
  hosea: { shortName: 'hos' },
  joel: { shortName: 'jol' },
  amos: { shortName: 'amo' },
  obadiah: { shortName: 'oba' },
  jonah: { shortName: 'jon' },
  micah: { shortName: 'mic' },
  nahum: { shortName: 'nam' },
  habakkuk: { shortName: 'hab' },
  zephaniah: { shortName: 'zep' },
  haggai: { shortName: 'hag' },
  zechariah: { shortName: 'zec' },
  malachi: { shortName: 'mal' },
  
  // New Testament with fully defined content
  matthew,
  mark,
  john,
  
  // New Testament placeholders
  luke: { shortName: 'luk' },
  acts: { shortName: 'act' },
  romans: { shortName: 'rom' },
  corinthians1: { shortName: '1co' },
  corinthians2: { shortName: '2co' },
  galatians: { shortName: 'gal' },
  ephesians: { shortName: 'eph' },
  philippians: { shortName: 'php' },
  colossians: { shortName: 'col' },
  thessalonians1: { shortName: '1th' },
  thessalonians2: { shortName: '2th' },
  timothy1: { shortName: '1ti' },
  timothy2: { shortName: '2ti' },
  titus: { shortName: 'tit' },
  philemon: { shortName: 'phm' },
  hebrews: { shortName: 'heb' },
  james: { shortName: 'jas' },
  peter1: { shortName: '1pe' },
  peter2: { shortName: '2pe' },
  john1: { shortName: '1jn' },
  john2: { shortName: '2jn' },
  john3: { shortName: '3jn' },
  jude: { shortName: 'jud' },
  revelation: { shortName: 'rev' }
};
