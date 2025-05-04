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

  return httpServer;
}
