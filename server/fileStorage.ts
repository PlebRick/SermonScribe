import fs from 'fs';
import path from 'path';
import {
  User, InsertUser,
  Book, 
  Verse, 
  Outline, 
  Manuscript, 
  Commentary
} from '@shared/schema';
import { IStorage } from './storage';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Ensure the content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.mkdirSync(path.join(CONTENT_DIR, 'books'), { recursive: true });
  fs.mkdirSync(path.join(CONTENT_DIR, 'verses'), { recursive: true });
  fs.mkdirSync(path.join(CONTENT_DIR, 'outlines'), { recursive: true });
  fs.mkdirSync(path.join(CONTENT_DIR, 'manuscripts'), { recursive: true });
  fs.mkdirSync(path.join(CONTENT_DIR, 'commentaries'), { recursive: true });
}

export class FileStorage implements IStorage {
  private users: Map<number, User>;
  private userCurrentId: number;

  constructor() {
    this.users = new Map();
    this.userCurrentId = 1;
    
    // Initialize with some data if empty
    this.ensureContentExists();
  }

  private ensureContentExists() {
    // Ensure all directories exist
    const dirs = [
      path.join(CONTENT_DIR, 'books'),
      path.join(CONTENT_DIR, 'verses'),
      path.join(CONTENT_DIR, 'outlines'),
      path.join(CONTENT_DIR, 'manuscripts'),
      path.join(CONTENT_DIR, 'commentaries')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Check if books directory is empty
    const booksDir = path.join(CONTENT_DIR, 'books');
    if (fs.readdirSync(booksDir).length === 0) {
      // Initialize with sample data
      this.initializeData();
    } else {
      // For testing - force recreation of all data
      console.log("Reinitializing data to ensure all books and verses are available");
      this.initializeData();
    }
  }

  private initializeData() {
    // Initialize Bible books
    this.initializeBibleBooks();
    
    // Initialize sample sermons
    this.initializeSampleOutlines();
    this.initializeSampleManuscripts();
    this.initializeSampleCommentaries();
  }

  private initializeBibleBooks() {
    // Initialize more books from both Old and New Testaments
    const books: Book[] = [
      // Old Testament
      {
        id: 1,
        name: "Genesis",
        shortName: "gen",
        testament: "old",
        position: 1,
        chapterCount: 50
      },
      {
        id: 2,
        name: "Exodus",
        shortName: "exo",
        testament: "old",
        position: 2,
        chapterCount: 40
      },
      {
        id: 3,
        name: "Leviticus",
        shortName: "lev",
        testament: "old",
        position: 3,
        chapterCount: 27
      },
      {
        id: 4,
        name: "Numbers",
        shortName: "num",
        testament: "old",
        position: 4,
        chapterCount: 36
      },
      {
        id: 5,
        name: "Deuteronomy",
        shortName: "deu",
        testament: "old",
        position: 5,
        chapterCount: 34
      },
      // New Testament
      {
        id: 40,
        name: "Matthew",
        shortName: "mat",
        testament: "new",
        position: 40,
        chapterCount: 28
      },
      {
        id: 41,
        name: "Mark",
        shortName: "mrk",
        testament: "new",
        position: 41,
        chapterCount: 16
      },
      {
        id: 42,
        name: "Luke",
        shortName: "luk",
        testament: "new",
        position: 42,
        chapterCount: 24
      },
      {
        id: 43,
        name: "John",
        shortName: "jhn",
        testament: "new",
        position: 43,
        chapterCount: 21
      },
      {
        id: 44,
        name: "Acts",
        shortName: "act",
        testament: "new",
        position: 44,
        chapterCount: 28
      }
    ];
    
    // Save each book to a file
    books.forEach(book => {
      const filePath = path.join(CONTENT_DIR, 'books', `${book.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(book, null, 2));
    });
    
    // Add sample verses for Genesis 1
    const genesisChapter1Verses: Verse[] = [
      {
        id: 1,
        bookId: 1,
        chapter: 1,
        verse: 1,
        text: "In the beginning God created the heaven and the earth."
      },
      {
        id: 2,
        bookId: 1,
        chapter: 1,
        verse: 2,
        text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters."
      },
      {
        id: 3,
        bookId: 1,
        chapter: 1,
        verse: 3,
        text: "And God said, Let there be light: and there was light."
      },
      {
        id: 4,
        bookId: 1,
        chapter: 1,
        verse: 4,
        text: "And God saw the light, that it was good: and God divided the light from the darkness."
      },
      {
        id: 5,
        bookId: 1,
        chapter: 1,
        verse: 5,
        text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day."
      }
    ];
    
    // Add sample verses for Genesis 2
    const genesisChapter2Verses: Verse[] = [
      {
        id: 31,
        bookId: 1,
        chapter: 2,
        verse: 1,
        text: "Thus the heavens and the earth were finished, and all the host of them."
      },
      {
        id: 32,
        bookId: 1,
        chapter: 2,
        verse: 2,
        text: "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made."
      },
      {
        id: 33,
        bookId: 1,
        chapter: 2,
        verse: 3,
        text: "And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made."
      }
    ];
    
    // Add sample verses for Matthew 1
    const matthewChapter1Verses: Verse[] = [
      {
        id: 1001,
        bookId: 40,
        chapter: 1,
        verse: 1,
        text: "The book of the generation of Jesus Christ, the son of David, the son of Abraham."
      },
      {
        id: 1002,
        bookId: 40,
        chapter: 1,
        verse: 2,
        text: "Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren;"
      },
      {
        id: 1003,
        bookId: 40,
        chapter: 1,
        verse: 3,
        text: "And Judas begat Phares and Zara of Thamar; and Phares begat Esrom; and Esrom begat Aram;"
      },
      {
        id: 1004,
        bookId: 40,
        chapter: 1,
        verse: 4,
        text: "And Aram begat Aminadab; and Aminadab begat Naasson; and Naasson begat Salmon;"
      },
      {
        id: 1005,
        bookId: 40,
        chapter: 1,
        verse: 5,
        text: "And Salmon begat Booz of Rachab; and Booz begat Obed of Ruth; and Obed begat Jesse;"
      }
    ];
    
    const versesDir = path.join(CONTENT_DIR, 'verses');
    
    // Create and save Genesis chapter 1 verses
    const gen1ChapterDir = path.join(versesDir, '1-1'); // bookId-chapter
    if (!fs.existsSync(gen1ChapterDir)) {
      fs.mkdirSync(gen1ChapterDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(gen1ChapterDir, 'verses.json'), 
      JSON.stringify(genesisChapter1Verses, null, 2)
    );
    
    // Create and save Genesis chapter 2 verses
    const gen2ChapterDir = path.join(versesDir, '1-2'); // bookId-chapter
    if (!fs.existsSync(gen2ChapterDir)) {
      fs.mkdirSync(gen2ChapterDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(gen2ChapterDir, 'verses.json'), 
      JSON.stringify(genesisChapter2Verses, null, 2)
    );
    
    // Create and save Matthew chapter 1 verses
    const matt1ChapterDir = path.join(versesDir, '40-1'); // bookId-chapter
    if (!fs.existsSync(matt1ChapterDir)) {
      fs.mkdirSync(matt1ChapterDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(matt1ChapterDir, 'verses.json'), 
      JSON.stringify(matthewChapter1Verses, null, 2)
    );
  }

  private initializeSampleOutlines() {
    const genesisOutline: Outline = {
      id: 1,
      title: "Creation: God's Sovereign Act",
      bookId: 1,
      startChapter: 1,
      startVerse: 1,
      endChapter: 1,
      endVerse: 5,
      points: [
        "The Creator God (Gen 1:1)",
        "The Initial Creation State (Gen 1:2)",
        "The Creative Word (Gen 1:3)",
        "The Divine Evaluation (Gen 1:4)",
        "The First Time Marker (Gen 1:5)"
      ]
    };
    
    const genesisOutline2: Outline = {
      id: 2,
      title: "The Creation of the Firmament",
      bookId: 1,
      startChapter: 1,
      startVerse: 6,
      endChapter: 1,
      endVerse: 8,
      points: [
        "God's Command for Division (Gen 1:6)",
        "God's Action of Making (Gen 1:7)",
        "The Naming and Second Day (Gen 1:8)"
      ]
    };
    
    const genesisOutline3: Outline = {
      id: 3,
      title: "The Gathering of Waters and Appearance of Land",
      bookId: 1,
      startChapter: 1,
      startVerse: 9,
      endChapter: 1,
      endVerse: 13,
      points: [
        "The Command for Gathering (Gen 1:9)",
        "The Naming of Land and Seas (Gen 1:10)",
        "The Command for Vegetation (Gen 1:11)",
        "The Production of Plants (Gen 1:12)",
        "The Third Day (Gen 1:13)"
      ]
    };
    
    const outlinesDir = path.join(CONTENT_DIR, 'outlines');
    const bookChapterDir = path.join(outlinesDir, '1-1'); // bookId-chapter
    if (!fs.existsSync(bookChapterDir)) {
      fs.mkdirSync(bookChapterDir, { recursive: true });
    }
    
    // Save outlines
    [genesisOutline, genesisOutline2, genesisOutline3].forEach(outline => {
      fs.writeFileSync(
        path.join(outlinesDir, `${outline.id}.json`),
        JSON.stringify(outline, null, 2)
      );
    });
    
    // Also save an index of outline IDs for this chapter
    fs.writeFileSync(
      path.join(bookChapterDir, 'index.json'),
      JSON.stringify([1, 2, 3], null, 2)
    );
  }

  private initializeSampleManuscripts() {
    const genesisManuscript: Manuscript = {
      id: 1,
      outlineId: 1,
      content: [
        {
          title: "Introduction",
          paragraphs: [
            "Genesis 1:1-5 presents us with the foundational act of creation, establishing God's sovereignty over all things from the very beginning of time.",
            "In these five verses, we discover profound truths about God's nature, His creative power, and His orderly approach to shaping the universe."
          ]
        },
        {
          title: "I. The Creator God (Gen 1:1)",
          paragraphs: [
            "\"In the beginning God created the heaven and the earth.\" This simple yet profound statement establishes the most fundamental truth of our faith: that there is one God who is the source and creator of everything that exists.",
            "The Hebrew word for \"created\" (bara) is used exclusively with God as its subject. This indicates that the kind of creation described here is something only God can do - bringing something into existence from nothing.",
            "This verse refutes numerous false worldviews: atheism (by affirming God's existence), polytheism (by presenting one God), pantheism (by distinguishing God from His creation), materialism (by showing matter had a beginning), and evolutionism (by crediting creation to God's direct action rather than chance processes)."
          ]
        },
        {
          title: "II. The Initial Creation State (Gen 1:2)",
          paragraphs: [
            "\"And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.\"",
            "This verse describes the initial state of creation before God began to organize and fill it. The phrase \"without form and void\" (tohu wabohu in Hebrew) indicates emptiness and formlessness - not chaos, but rather incompleteness awaiting God's further creative work.",
            "Even in this initial state, God's presence is active - \"the Spirit of God moved\" (or hovered) over the waters. This hovering suggests watchful care and readiness to act, like a bird hovering over its nest, protective and attentive.",
            "Here we see the first indication of the Trinity in Scripture, with the Spirit of God active in creation."
          ]
        }
      ]
    };
    
    const manuscriptsDir = path.join(CONTENT_DIR, 'manuscripts');
    fs.writeFileSync(
      path.join(manuscriptsDir, `${genesisManuscript.id}.json`),
      JSON.stringify(genesisManuscript, null, 2)
    );
  }

  private initializeSampleCommentaries() {
    const genesis1_1Commentary: Commentary = {
      id: 1,
      bookId: 1,
      chapter: 1,
      verse: 1,
      content: "This opening verse of the Bible is fundamental to the Christian worldview. The phrase 'In the beginning God' immediately establishes the priority and preexistence of God before all things. The Hebrew word 'bara' (created) is only ever used with God as the subject, indicating a unique divine creative activity.",
      source: "Biblical Commentary Series"
    };
    
    const genesis1_2Commentary: Commentary = {
      id: 2,
      bookId: 1,
      chapter: 1,
      verse: 2,
      content: "The formlessness described here doesn't indicate chaos but rather an unfinished state awaiting God's further creative ordering. The Spirit of God hovering over the waters presents a beautiful picture of God's attentive care over creation even in its initial stages.",
      source: "Expository Commentary"
    };
    
    const genesis1_3Commentary: Commentary = {
      id: 3,
      bookId: 1,
      chapter: 1,
      verse: 3,
      content: "God's creation by speaking demonstrates the power of His word. This creative word establishes a pattern that continues throughout the creation account, where God speaks and matter obeys. This verse has often been connected to John 1:1-3, where Christ is identified as the Word through whom all things were made.",
      source: "Reformed Study Guide"
    };
    
    const commentariesDir = path.join(CONTENT_DIR, 'commentaries');
    const chapterDir = path.join(commentariesDir, '1-1'); // bookId-chapter
    if (!fs.existsSync(chapterDir)) {
      fs.mkdirSync(chapterDir, { recursive: true });
    }
    
    // Save commentaries
    [genesis1_1Commentary, genesis1_2Commentary, genesis1_3Commentary].forEach(commentary => {
      fs.writeFileSync(
        path.join(commentariesDir, `${commentary.id}.json`),
        JSON.stringify(commentary, null, 2)
      );
    });
    
    // Also save an index file for this chapter
    fs.writeFileSync(
      path.join(chapterDir, 'index.json'),
      JSON.stringify([1, 2, 3], null, 2)
    );
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Convert to array to avoid iterator issues
    const users = Array.from(this.users.values());
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Bible methods
  async getAllBooks(): Promise<Book[]> {
    const booksDir = path.join(CONTENT_DIR, 'books');
    const files = fs.readdirSync(booksDir).filter(file => file.endsWith('.json'));
    
    const books: Book[] = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(booksDir, file), 'utf-8');
      const book = JSON.parse(content) as Book;
      books.push(book);
    }
    
    return books;
  }

  async getBookById(id: number): Promise<Book | undefined> {
    const filePath = path.join(CONTENT_DIR, 'books', `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Book;
  }

  async getBookByName(name: string): Promise<Book | undefined> {
    const books = await this.getAllBooks();
    return books.find(book => 
      book.name.toLowerCase() === name.toLowerCase() || 
      book.shortName.toLowerCase() === name.toLowerCase()
    );
  }

  async getVersesByBookAndChapter(bookId: number, chapter: number): Promise<Verse[]> {
    const chapterDir = path.join(CONTENT_DIR, 'verses', `${bookId}-${chapter}`);
    if (!fs.existsSync(chapterDir)) {
      return [];
    }
    
    const filePath = path.join(chapterDir, 'verses.json');
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Verse[];
  }

  // Sermon methods
  async getOutlinesByBookAndChapter(bookId: number, chapter: number): Promise<Outline[]> {
    const indexPath = path.join(CONTENT_DIR, 'outlines', `${bookId}-${chapter}`, 'index.json');
    if (!fs.existsSync(indexPath)) {
      return [];
    }
    
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const outlineIds = JSON.parse(indexContent) as number[];
    
    const outlines: Outline[] = [];
    for (const id of outlineIds) {
      const filePath = path.join(CONTENT_DIR, 'outlines', `${id}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        outlines.push(JSON.parse(content) as Outline);
      }
    }
    
    return outlines;
  }

  async getOutlineById(id: number): Promise<Outline | undefined> {
    const filePath = path.join(CONTENT_DIR, 'outlines', `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Outline;
  }

  async getManuscriptByOutlineId(outlineId: number): Promise<Manuscript | undefined> {
    // For simplicity, we're assuming manuscript IDs match outline IDs
    const filePath = path.join(CONTENT_DIR, 'manuscripts', `${outlineId}.json`);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Manuscript;
  }

  async getCommentariesByBookAndChapter(bookId: number, chapter: number): Promise<Commentary[]> {
    const indexPath = path.join(CONTENT_DIR, 'commentaries', `${bookId}-${chapter}`, 'index.json');
    if (!fs.existsSync(indexPath)) {
      return [];
    }
    
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const commentaryIds = JSON.parse(indexContent) as number[];
    
    const commentaries: Commentary[] = [];
    for (const id of commentaryIds) {
      const filePath = path.join(CONTENT_DIR, 'commentaries', `${id}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        commentaries.push(JSON.parse(content) as Commentary);
      }
    }
    
    return commentaries;
  }

  // Content management methods
  async saveOutline(outline: Outline): Promise<Outline> {
    // Ensure the outline has an ID
    if (!outline.id) {
      // Find the highest ID and increment
      const outlineFiles = fs.readdirSync(path.join(CONTENT_DIR, 'outlines'))
        .filter(file => file.endsWith('.json'));
      
      const ids = outlineFiles.map(file => parseInt(file.replace('.json', ''), 10))
        .filter(id => !isNaN(id));
      
      outline.id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }
    
    // Save the outline file
    const filePath = path.join(CONTENT_DIR, 'outlines', `${outline.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(outline, null, 2));
    
    // Update the index for this book and chapter
    const chapterDir = path.join(CONTENT_DIR, 'outlines', `${outline.bookId}-${outline.startChapter}`);
    if (!fs.existsSync(chapterDir)) {
      fs.mkdirSync(chapterDir, { recursive: true });
    }
    
    const indexPath = path.join(chapterDir, 'index.json');
    let outlineIds: number[] = [];
    
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      outlineIds = JSON.parse(indexContent) as number[];
      
      // Add the ID if it's not already in the index
      if (!outlineIds.includes(outline.id)) {
        outlineIds.push(outline.id);
        fs.writeFileSync(indexPath, JSON.stringify(outlineIds, null, 2));
      }
    } else {
      // Create new index with this outline
      outlineIds = [outline.id];
      fs.writeFileSync(indexPath, JSON.stringify(outlineIds, null, 2));
    }
    
    return outline;
  }

  async saveManuscript(manuscript: Manuscript): Promise<Manuscript> {
    // Ensure the manuscript has an ID
    if (!manuscript.id) {
      // Find the highest ID and increment
      const manuscriptFiles = fs.readdirSync(path.join(CONTENT_DIR, 'manuscripts'))
        .filter(file => file.endsWith('.json'));
      
      const ids = manuscriptFiles.map(file => parseInt(file.replace('.json', ''), 10))
        .filter(id => !isNaN(id));
      
      manuscript.id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }
    
    // Save the manuscript file
    const filePath = path.join(CONTENT_DIR, 'manuscripts', `${manuscript.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(manuscript, null, 2));
    
    return manuscript;
  }

  async saveCommentary(commentary: Commentary): Promise<Commentary> {
    // Ensure the commentary has an ID
    if (!commentary.id) {
      // Find the highest ID and increment
      const commentaryFiles = fs.readdirSync(path.join(CONTENT_DIR, 'commentaries'))
        .filter(file => file.endsWith('.json'));
      
      const ids = commentaryFiles.map(file => parseInt(file.replace('.json', ''), 10))
        .filter(id => !isNaN(id));
      
      commentary.id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }
    
    // Save the commentary file
    const filePath = path.join(CONTENT_DIR, 'commentaries', `${commentary.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(commentary, null, 2));
    
    // Update the index for this book and chapter
    const chapterDir = path.join(CONTENT_DIR, 'commentaries', `${commentary.bookId}-${commentary.chapter}`);
    if (!fs.existsSync(chapterDir)) {
      fs.mkdirSync(chapterDir, { recursive: true });
    }
    
    const indexPath = path.join(chapterDir, 'index.json');
    let commentaryIds: number[] = [];
    
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      commentaryIds = JSON.parse(indexContent) as number[];
      
      // Add the ID if it's not already in the index
      if (!commentaryIds.includes(commentary.id)) {
        commentaryIds.push(commentary.id);
        fs.writeFileSync(indexPath, JSON.stringify(commentaryIds, null, 2));
      }
    } else {
      // Create new index with this commentary
      commentaryIds = [commentary.id];
      fs.writeFileSync(indexPath, JSON.stringify(commentaryIds, null, 2));
    }
    
    return commentary;
  }

  async deleteOutline(id: number): Promise<boolean> {
    const filePath = path.join(CONTENT_DIR, 'outlines', `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    // Read outline to get book and chapter
    const content = fs.readFileSync(filePath, 'utf-8');
    const outline = JSON.parse(content) as Outline;
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    // Update the index
    const indexPath = path.join(CONTENT_DIR, 'outlines', `${outline.bookId}-${outline.startChapter}`, 'index.json');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      let outlineIds = JSON.parse(indexContent) as number[];
      
      outlineIds = outlineIds.filter(oId => oId !== id);
      fs.writeFileSync(indexPath, JSON.stringify(outlineIds, null, 2));
    }
    
    return true;
  }

  async deleteManuscript(id: number): Promise<boolean> {
    const filePath = path.join(CONTENT_DIR, 'manuscripts', `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    fs.unlinkSync(filePath);
    return true;
  }

  async deleteCommentary(id: number): Promise<boolean> {
    const filePath = path.join(CONTENT_DIR, 'commentaries', `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    // Read commentary to get book and chapter
    const content = fs.readFileSync(filePath, 'utf-8');
    const commentary = JSON.parse(content) as Commentary;
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    // Update the index
    const indexPath = path.join(CONTENT_DIR, 'commentaries', `${commentary.bookId}-${commentary.chapter}`, 'index.json');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      let commentaryIds = JSON.parse(indexContent) as number[];
      
      commentaryIds = commentaryIds.filter(cId => cId !== id);
      fs.writeFileSync(indexPath, JSON.stringify(commentaryIds, null, 2));
    }
    
    return true;
  }
}

export const fileStorage = new FileStorage();