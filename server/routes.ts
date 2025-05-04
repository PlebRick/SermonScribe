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

  // Get verses by book and chapter
  app.get("/api/verses/:bookId/:chapter", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const chapter = parseInt(req.params.chapter);
    
    if (isNaN(bookId) || isNaN(chapter)) {
      return res.status(400).json({ message: "Invalid book ID or chapter" });
    }
    
    const verses = await storage.getVersesByBookAndChapter(bookId, chapter);
    res.json(verses);
  }));

  // Get outlines by book and chapter
  app.get("/api/outlines/:bookId/:chapter", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const chapter = parseInt(req.params.chapter);
    
    if (isNaN(bookId) || isNaN(chapter)) {
      return res.status(400).json({ message: "Invalid book ID or chapter" });
    }
    
    const outlines = await storage.getOutlinesByBookAndChapter(bookId, chapter);
    res.json(outlines);
  }));

  // Get outline by ID
  app.get("/api/outlines/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid outline ID" });
    }
    
    const outline = await storage.getOutlineById(id);
    if (!outline) {
      return res.status(404).json({ message: "Outline not found" });
    }
    
    res.json(outline);
  }));

  // Get manuscript by outline ID
  app.get("/api/manuscripts/:outlineId", asyncHandler(async (req, res) => {
    const outlineId = parseInt(req.params.outlineId);
    if (isNaN(outlineId)) {
      return res.status(400).json({ message: "Invalid outline ID" });
    }
    
    const manuscript = await storage.getManuscriptByOutlineId(outlineId);
    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found" });
    }
    
    res.json(manuscript);
  }));

  // Get commentaries by book and chapter
  app.get("/api/commentaries/:bookId/:chapter", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const chapter = parseInt(req.params.chapter);
    
    if (isNaN(bookId) || isNaN(chapter)) {
      return res.status(400).json({ message: "Invalid book ID or chapter" });
    }
    
    const commentaries = await storage.getCommentariesByBookAndChapter(bookId, chapter);
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
