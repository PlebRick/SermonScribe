import { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Helper function to handle errors uniformly
  const asyncHandler = (fn: (req: any, res: any) => Promise<any>) => 
    (req: any, res: any) => {
      Promise.resolve(fn(req, res)).catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
    };

  // Get all Bible books
  app.get("/api/books", asyncHandler(async (req, res) => {
    const books = await storage.getAllBooks();
    res.json(books);
  }));

  // Get book by ID
  app.get("/api/books/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const book = await storage.getBookById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(book);
  }));

  // Support GET /api/verses with no parameters
  app.get("/api/verses", asyncHandler(async (req, res) => {
    console.log("GET /api/verses - forwarding to book/chapter handler", req.query);
    
    // If book and chapter query params are provided, use those
    if (req.query.bookId && req.query.chapter) {
      const bookId = parseInt(req.query.bookId as string);
      const chapter = parseInt(req.query.chapter as string);
      
      if (isNaN(bookId) || isNaN(chapter)) {
        return res.status(400).json({ message: "Invalid book ID or chapter" });
      }
      
      console.log(`Fetching verses for book ${bookId}, chapter ${chapter} (from query)`);
      const verses = await storage.getVersesByBookAndChapter(bookId, chapter);
      console.log(`Found ${verses.length} verses`);
      return res.json(verses);
    }
    
    // Otherwise return an empty array
    return res.json([]);
  }));

  // Get verses by book and chapter from URL parameters
  app.get("/api/verses/:bookId/:chapter", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const chapter = parseInt(req.params.chapter);
    
    if (isNaN(bookId) || isNaN(chapter)) {
      return res.status(400).json({ message: "Invalid book ID or chapter" });
    }
    
    console.log(`Fetching verses for book ${bookId}, chapter ${chapter} (from params)`);
    const verses = await storage.getVersesByBookAndChapter(bookId, chapter);
    console.log(`Found ${verses.length} verses`);
    res.json(verses);
  }));

  // Support GET /api/outlines with no parameters
  app.get("/api/outlines", asyncHandler(async (req, res) => {
    console.log("GET /api/outlines - forwarding to book/chapter handler", req.query);
    
    // If book and chapter query params are provided, use those
    if (req.query.bookId && req.query.chapter) {
      const bookId = parseInt(req.query.bookId as string);
      const chapter = parseInt(req.query.chapter as string);
      
      if (isNaN(bookId) || isNaN(chapter)) {
        return res.status(400).json({ message: "Invalid book ID or chapter" });
      }
      
      console.log(`Fetching outlines for book ${bookId}, chapter ${chapter} (from query)`);
      const outlines = await storage.getOutlinesByBookAndChapter(bookId, chapter);
      console.log(`Found ${outlines.length} outlines`);
      return res.json(outlines);
    }
    
    // Otherwise return an empty array
    return res.json([]);
  }));

  // Get outline by ID - support both endpoints patterns
  app.get("/api/outlines/:idOrBookId/:chapterOrNothing?", asyncHandler(async (req, res) => {
    const idOrBookId = parseInt(req.params.idOrBookId);
    console.log("Outlines API request", req.url, req.params);
    
    if (isNaN(idOrBookId)) {
      return res.status(400).json({ message: "Invalid ID parameter" });
    }
    
    // Check if we have a chapter parameter - this means we're getting outlines by book/chapter
    if (req.params.chapterOrNothing) {
      const chapter = parseInt(req.params.chapterOrNothing);
      if (isNaN(chapter)) {
        return res.status(400).json({ message: "Invalid chapter" });
      }
      
      console.log(`Fetching outlines for book ${idOrBookId}, chapter ${chapter}`);
      const outlines = await storage.getOutlinesByBookAndChapter(idOrBookId, chapter);
      console.log(`Found ${outlines.length} outlines`);
      return res.json(outlines);
    }
    
    // No chapter parameter - this means we're getting a specific outline by ID
    console.log(`Fetching outline by ID ${idOrBookId}`);
    const outline = await storage.getOutlineById(idOrBookId);
    if (!outline) {
      return res.status(404).json({ message: "Outline not found" });
    }
    
    res.json(outline);
  }));

  // Get manuscript by outline ID
  app.get("/api/manuscripts/:outlineId", asyncHandler(async (req, res) => {
    const outlineId = parseInt(req.params.outlineId);
    console.log(`Fetching manuscript for outline ID: ${outlineId}`);
    
    if (isNaN(outlineId)) {
      return res.status(400).json({ message: "Invalid outline ID" });
    }
    
    let manuscript = await storage.getManuscriptByOutlineId(outlineId);
    console.log(`Manuscript result:`, manuscript ? "Found" : "Not found");
    
    // If manuscript doesn't exist, and we have the ability to save, create a default one
    if (!manuscript && storage.saveManuscript) {
      try {
        // Get the outline to use its title
        const outline = await storage.getOutlineById(outlineId);
        if (!outline) {
          return res.status(404).json({ message: "Outline not found" });
        }
        
        // Create a default manuscript
        const defaultManuscript = {
          id: 0, // This will be assigned automatically by storage layer
          outlineId: outlineId,
          content: [
            { 
              title: outline.title || "Introduction", 
              content: "<p>Enter your manuscript content here...</p>" 
            }
          ]
        };
        
        // Save it
        manuscript = await storage.saveManuscript(defaultManuscript);
        console.log("Created default manuscript for outline:", outlineId);
      } catch (error) {
        console.error("Error creating default manuscript:", error);
        return res.status(404).json({ message: "Manuscript not found and couldn't create a default one" });
      }
    } else if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found" });
    }
    
    res.json(manuscript);
  }));

  // Support GET /api/commentaries with no parameters
  app.get("/api/commentaries", asyncHandler(async (req, res) => {
    console.log("GET /api/commentaries - forwarding to book/chapter handler", req.query);
    
    // If book and chapter query params are provided, use those
    if (req.query.bookId && req.query.chapter) {
      const bookId = parseInt(req.query.bookId as string);
      const chapter = parseInt(req.query.chapter as string);
      
      if (isNaN(bookId) || isNaN(chapter)) {
        return res.status(400).json({ message: "Invalid book ID or chapter" });
      }
      
      console.log(`Fetching commentaries for book ${bookId}, chapter ${chapter} (from query)`);
      const commentaries = await storage.getCommentariesByBookAndChapter(bookId, chapter);
      console.log(`Found ${commentaries.length} commentaries`);
      return res.json(commentaries);
    }
    
    // Otherwise return an empty array
    return res.json([]);
  }));

  // Get commentaries by book and chapter from URL parameters
  app.get("/api/commentaries/:bookId/:chapter", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const chapter = parseInt(req.params.chapter);
    
    if (isNaN(bookId) || isNaN(chapter)) {
      return res.status(400).json({ message: "Invalid book ID or chapter" });
    }
    
    console.log(`Fetching commentaries for book ${bookId}, chapter ${chapter} (from params)`);
    const commentaries = await storage.getCommentariesByBookAndChapter(bookId, chapter);
    console.log(`Found ${commentaries.length} commentaries`);
    res.json(commentaries);
  }));

  // CONTENT MANAGEMENT API ENDPOINTS
  
  // Create/Update outline
  app.post("/api/admin/outlines", asyncHandler(async (req, res) => {
    if (!storage.saveOutline) {
      return res.status(501).json({ message: "Content management not supported" });
    }
    
    try {
      const outline = req.body;
      const savedOutline = await storage.saveOutline(outline);
      res.json(savedOutline);
    } catch (error) {
      console.error('Error saving outline:', error);
      res.status(400).json({ message: "Invalid outline data" });
    }
  }));

  // Delete outline
  app.delete("/api/admin/outlines/:id", asyncHandler(async (req, res) => {
    if (!storage.deleteOutline) {
      return res.status(501).json({ message: "Content management not supported" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid outline ID" });
    }
    
    const success = await storage.deleteOutline(id);
    if (!success) {
      return res.status(404).json({ message: "Outline not found" });
    }
    
    res.json({ message: "Outline deleted successfully" });
  }));

  // Create/Update manuscript
  app.post("/api/admin/manuscripts", asyncHandler(async (req, res) => {
    if (!storage.saveManuscript) {
      return res.status(501).json({ message: "Content management not supported" });
    }
    
    try {
      const manuscript = req.body;
      const savedManuscript = await storage.saveManuscript(manuscript);
      res.json(savedManuscript);
    } catch (error) {
      console.error('Error saving manuscript:', error);
      res.status(400).json({ message: "Invalid manuscript data" });
    }
  }));

  // Delete manuscript
  app.delete("/api/admin/manuscripts/:id", asyncHandler(async (req, res) => {
    if (!storage.deleteManuscript) {
      return res.status(501).json({ message: "Content management not supported" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid manuscript ID" });
    }
    
    const success = await storage.deleteManuscript(id);
    if (!success) {
      return res.status(404).json({ message: "Manuscript not found" });
    }
    
    res.json({ message: "Manuscript deleted successfully" });
  }));

  // Create/Update commentary
  app.post("/api/admin/commentaries", asyncHandler(async (req, res) => {
    if (!storage.saveCommentary) {
      return res.status(501).json({ message: "Content management not supported" });
    }
    
    try {
      const commentary = req.body;
      const savedCommentary = await storage.saveCommentary(commentary);
      res.json(savedCommentary);
    } catch (error) {
      console.error('Error saving commentary:', error);
      res.status(400).json({ message: "Invalid commentary data" });
    }
  }));

  // Delete commentary
  app.delete("/api/admin/commentaries/:id", asyncHandler(async (req, res) => {
    if (!storage.deleteCommentary) {
      return res.status(501).json({ message: "Content management not supported" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid commentary ID" });
    }
    
    const success = await storage.deleteCommentary(id);
    if (!success) {
      return res.status(404).json({ message: "Commentary not found" });
    }
    
    res.json({ message: "Commentary deleted successfully" });
  }));

  return httpServer;
}
