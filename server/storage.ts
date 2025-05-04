import { 
  Book, InsertBook, 
  Verse, InsertVerse, 
  Outline, InsertOutline, 
  Manuscript, InsertManuscript,
  Commentary, InsertCommentary,
  User, InsertUser
} from "@shared/schema";
import { bibleBooks, bibleContent, getTestamentBooks, getBibleChapters } from "../client/src/lib/bible-data";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bible methods
  getAllBooks(): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  getBookByName(name: string): Promise<Book | undefined>;
  getVersesByBookAndChapter(bookId: number, chapter: number): Promise<Verse[]>;
  
  // Sermon methods
  getOutlinesByBookAndChapter(bookId: number, chapter: number): Promise<Outline[]>;
  getOutlineById(id: number): Promise<Outline | undefined>;
  getManuscriptByOutlineId(outlineId: number): Promise<Manuscript | undefined>;
  getCommentariesByBookAndChapter(bookId: number, chapter: number): Promise<Commentary[]>;
  
  // Content management methods (for editing content)
  saveOutline?(outline: Outline): Promise<Outline>;
  saveManuscript?(manuscript: Manuscript): Promise<Manuscript>;
  saveCommentary?(commentary: Commentary): Promise<Commentary>;
  deleteOutline?(id: number): Promise<boolean>;
  deleteManuscript?(id: number): Promise<boolean>;
  deleteCommentary?(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private verses: Map<number, Verse[]>;
  private outlines: Map<number, Outline>;
  private manuscripts: Map<number, Manuscript>;
  private commentaries: Map<string, Commentary>;
  
  private userCurrentId: number;
  private bookCurrentId: number;
  private verseCurrentId: number;
  private outlineCurrentId: number;
  private manuscriptCurrentId: number;
  private commentaryCurrentId: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.verses = new Map();
    this.outlines = new Map();
    this.manuscripts = new Map();
    this.commentaries = new Map();
    
    this.userCurrentId = 1;
    this.bookCurrentId = 1;
    this.verseCurrentId = 1;
    this.outlineCurrentId = 1;
    this.manuscriptCurrentId = 1;
    this.commentaryCurrentId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some Bible data
    this.initializeBibleBooks();
    this.initializeSampleOutlines();
    this.initializeSampleManuscripts();
    this.initializeSampleCommentaries();
  }

  private initializeBibleBooks() {
    // Add Bible books data directly from our bibleBooks data
    bibleBooks.forEach(book => {
      const bookData: Book = {
        id: book.id,
        name: book.name,
        shortName: book.shortName,
        testament: book.testament,
        position: book.id, // Use ID as position
        chapterCount: book.chapterCount
      };
      this.books.set(bookData.id, bookData);
    });
    
    // Update the book current ID
    this.bookCurrentId = bibleBooks.length + 1;
  }

  private initializeSampleOutlines() {
    // Genesis 1:1-5 outline
    const genesisOutline: Outline = {
      id: this.outlineCurrentId++,
      title: "Creation: God's Sovereign Power",
      bookId: 1, // Genesis
      startChapter: 1,
      startVerse: 1,
      endChapter: 1,
      endVerse: 5,
      points: [
        "I. The Context of Creation (v.1)",
        "II. The Chaos Before Order (v.2)",
        "III. The Command of God (v.3-5)"
      ]
    };
    this.outlines.set(genesisOutline.id, genesisOutline);

    // Genesis 1:6-13 outline
    const genesisOutline2: Outline = {
      id: this.outlineCurrentId++,
      title: "The Ordering of Creation",
      bookId: 1, // Genesis
      startChapter: 1,
      startVerse: 6,
      endChapter: 1,
      endVerse: 13,
      points: [
        "I. The Separation of Waters (v.6-8)",
        "II. The Appearance of Land (v.9-10)",
        "III. The Abundance of Vegetation (v.11-13)"
      ]
    };
    this.outlines.set(genesisOutline2.id, genesisOutline2);

    // Genesis 1:14-19 outline
    const genesisOutline3: Outline = {
      id: this.outlineCurrentId++,
      title: "The Lights of Heaven",
      bookId: 1, // Genesis
      startChapter: 1,
      startVerse: 14,
      endChapter: 1,
      endVerse: 19,
      points: [
        "I. The Purpose of Heavenly Bodies (v.14-15)",
        "II. The Placement of Luminaries (v.16-18)",
        "III. The Pattern Established (v.19)"
      ]
    };
    this.outlines.set(genesisOutline3.id, genesisOutline3);
  }

  private initializeSampleManuscripts() {
    // Genesis 1:1-5 manuscript
    const genesisManuscript: Manuscript = {
      id: this.manuscriptCurrentId++,
      outlineId: 1,
      content: [
        {
          title: "I. The Context of Creation (v.1)",
          paragraphs: [
            "In Genesis 1:1, we encounter one of the most profound statements in all of Scripture: \"In the beginning, God created the heavens and the earth.\" This declarative statement establishes several foundational truths that are essential to our understanding of reality.",
            "First, we see that God exists independently of creation. He was there \"in the beginning,\" before anything else existed. This speaks to His eternal nature and self-existence. Second, we see that God is the source of all that exists. The universe is not eternal, nor did it come about by chance. Rather, it was brought into being by the intentional act of a personal Creator."
          ]
        },
        {
          title: "II. The Chaos Before Order (v.2)",
          paragraphs: [
            "Verse 2 gives us a glimpse of the initial state of creation: \"The earth was without form and void, and darkness was over the face of the deep.\" The Hebrew words tohu wabohu (without form and void) suggest emptiness and chaos. This was not the final state God intended, but rather the beginning stage of His creative work.",
            "Yet even in this primordial chaos, we see God's presence: \"And the Spirit of God was hovering over the face of the waters.\" This imagery suggests care, protection, and anticipation—like an eagle hovering over its nest (Deut. 32:11). Even in formlessness, God was present and actively involved."
          ]
        },
        {
          title: "III. The Command of God (v.3-5)",
          paragraphs: [
            "In verses 3-5, we witness the power of God's spoken word. \"And God said, 'Let there be light,' and there was light.\" Creation by divine command reveals God's omnipotence. He does not need pre-existing materials or elaborate processes—He speaks, and reality conforms to His word.",
            "We also see God's evaluative judgment: \"And God saw that the light was good.\" God declares His creation to be good, establishing a standard of value based on His own character and purposes.",
            "Finally, we see God's ordering activity: \"God separated the light from the darkness. God called the light Day, and the darkness he called Night.\" God brings order by separating, defining, and naming. These actions establish boundaries and meaning, creating a framework for all that follows."
          ]
        }
      ]
    };
    this.manuscripts.set(genesisManuscript.outlineId, genesisManuscript);
  }

  private initializeSampleCommentaries() {
    // Genesis 1:1 commentary
    const genesis1_1Commentary: Commentary = {
      id: this.commentaryCurrentId++,
      bookId: 1, // Genesis
      chapter: 1,
      verse: 1,
      content: "The Hebrew word for \"created\" (bara) is used exclusively with God as the subject in the Old Testament. It signifies creation ex nihilo—out of nothing. This is a concept unique to biblical theology, as most ancient creation myths involved gods fashioning the world from pre-existing material.",
      source: "John Walton, Ancient Near Eastern Thought and the Old Testament"
    };
    this.commentaries.set(`1:1:1`, genesis1_1Commentary); // bookId:chapter:verse

    // Genesis 1:2 commentary
    const genesis1_2Commentary: Commentary = {
      id: this.commentaryCurrentId++,
      bookId: 1, // Genesis
      chapter: 1,
      verse: 2,
      content: "The \"deep\" (tehom) has sometimes been connected to the Babylonian goddess Tiamat from the Enuma Elish. However, there's a crucial distinction: in Genesis, the deep is not personified or divine—it is simply part of God's creation, fully under His control.",
      source: "Kenneth Mathews, New American Commentary"
    };
    this.commentaries.set(`1:1:2`, genesis1_2Commentary);

    // Genesis 1:3-5 commentary
    const genesis1_3Commentary: Commentary = {
      id: this.commentaryCurrentId++,
      bookId: 1, // Genesis
      chapter: 1,
      verse: 3,
      content: "The creation of light before the sun (which doesn't appear until day 4) has puzzled many readers. Some suggest this refers to God establishing the physical property of light itself, while others propose it represents God's glorious presence. What's clear is that light—and the distinction between light and darkness—was fundamental to God's ordering of creation.",
      source: "Gordon Wenham, Word Biblical Commentary"
    };
    this.commentaries.set(`1:1:3`, genesis1_3Commentary);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Bible methods
  async getAllBooks(): Promise<Book[]> {
    return Array.from(this.books.values()).sort((a, b) => a.position - b.position);
  }

  async getBookById(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async getBookByName(name: string): Promise<Book | undefined> {
    return Array.from(this.books.values()).find(
      (book) => book.name.toLowerCase() === name.toLowerCase() || book.shortName.toLowerCase() === name.toLowerCase()
    );
  }

  async getVersesByBookAndChapter(bookId: number, chapter: number): Promise<Verse[]> {
    const book = await this.getBookById(bookId);
    if (!book) return [];

    // If we don't have verses for this book/chapter, fetch from Bible content
    const cacheKey = `${bookId}:${chapter}`;
    if (!this.verses.has(+cacheKey)) {
      // Get book content from our new structure
      let bookContent;
      
      // Check for available book content
      if (book.shortName === 'gen') {
        bookContent = bibleContent.genesis;
      } else if (book.shortName === 'exo') {
        bookContent = bibleContent.exodus;
      } else if (book.shortName === 'mat') {
        bookContent = bibleContent.matthew;
      } else if (book.shortName === 'mrk') {
        bookContent = bibleContent.mark;
      } else if (book.shortName === 'jhn') {
        bookContent = bibleContent.john;
      } else {
        // Content not available for this book yet
        return [];
      }
      
      // Find the specific chapter
      const chapterContent = bookContent.chapters.find(c => c.chapter === chapter);
      if (!chapterContent) return [];
      
      // Flatten all verses from all sections
      let verses: Verse[] = [];
      let verseId = this.verseCurrentId;
      
      chapterContent.sections.forEach(section => {
        section.verses.forEach(verseData => {
          verses.push({
            id: verseId++,
            bookId,
            chapter,
            verse: verseData.verse,
            text: verseData.text
          });
        });
      });
      
      this.verseCurrentId = verseId; // Update the verse ID counter
      this.verses.set(+cacheKey, verses);
    }
    
    return this.verses.get(+cacheKey) || [];
  }

  // Sermon methods
  async getOutlinesByBookAndChapter(bookId: number, chapter: number): Promise<Outline[]> {
    return Array.from(this.outlines.values()).filter(
      outline => outline.bookId === bookId && 
                 ((outline.startChapter === chapter) || 
                  (outline.startChapter <= chapter && outline.endChapter >= chapter))
    );
  }

  async getOutlineById(id: number): Promise<Outline | undefined> {
    return this.outlines.get(id);
  }

  async getManuscriptByOutlineId(outlineId: number): Promise<Manuscript | undefined> {
    return this.manuscripts.get(outlineId);
  }

  async getCommentariesByBookAndChapter(bookId: number, chapter: number): Promise<Commentary[]> {
    return Array.from(this.commentaries.values()).filter(
      commentary => commentary.bookId === bookId && commentary.chapter === chapter
    );
  }
}

// Import our file-based storage implementation
import { fileStorage } from './fileStorage';

// Use FileStorage for production to enable content editing through files
export const storage = fileStorage;
