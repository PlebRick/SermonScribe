import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Bible books and chapters
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  testament: text("testament").notNull(),
  position: integer("position").notNull(),
  chapterCount: integer("chapter_count").notNull(),
});

export const insertBookSchema = createInsertSchema(books).omit({ id: true });
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

// Bible verses
export const verses = pgTable("verses", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  text: text("text").notNull(),
});

export const insertVerseSchema = createInsertSchema(verses).omit({ id: true });
export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type Verse = typeof verses.$inferSelect;

// Sermon outlines
export const outlines = pgTable("outlines", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  bookId: integer("book_id").notNull(),
  startChapter: integer("start_chapter").notNull(),
  startVerse: integer("start_verse").notNull(),
  endChapter: integer("end_chapter").notNull(),
  endVerse: integer("end_verse").notNull(),
  points: jsonb("points").notNull(),
});

export const insertOutlineSchema = createInsertSchema(outlines).omit({ id: true });
export type InsertOutline = z.infer<typeof insertOutlineSchema>;
export type Outline = typeof outlines.$inferSelect;

// Sermon manuscripts
export const manuscripts = pgTable("manuscripts", {
  id: serial("id").primaryKey(),
  outlineId: integer("outline_id").notNull(),
  content: jsonb("content").notNull(), // Will store sections with rich text content
});

export const insertManuscriptSchema = createInsertSchema(manuscripts).omit({ id: true });
export type InsertManuscript = z.infer<typeof insertManuscriptSchema>;
export type Manuscript = typeof manuscripts.$inferSelect;

// Custom type for strongly-typed manuscript content with rich text
export interface ManuscriptSection {
  title: string;
  content: string; // HTML content from rich text editor
}

// Commentaries
export const commentaries = pgTable("commentaries", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  outlineId: integer("outline_id"), // optional for backwards compatibility
  content: text("content").notNull(),
  source: text("source").notNull(),
});

export const insertCommentarySchema = createInsertSchema(commentaries).omit({ id: true });
export type InsertCommentary = z.infer<typeof insertCommentarySchema>;
export type Commentary = typeof commentaries.$inferSelect;

// Users table (for potential future authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
