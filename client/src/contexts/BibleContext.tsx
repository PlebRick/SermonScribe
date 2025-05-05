import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Verse, Outline, Book } from "@shared/schema";
import { SERMON_TABS } from "@/lib/constants";

interface BibleContextType {
  currentBookId: number;
  currentChapter: number;
  currentBook: Book | null;
  verses: Verse[];
  outlines: Outline[];
  activeOutlineId: number | null;
  activeTab: string;
  isLoading: boolean;
  setCurrentLocation: (bookId: number, chapter: number) => void;
  setActiveOutlineId: (id: number | null) => void;
  setActiveTab: (tab: string) => void;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export function BibleProvider({ children }: { children: ReactNode }) {
  // Starting with Genesis 1
  const [currentBookId, setCurrentBookId] = useState(1);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [activeOutlineId, setActiveOutlineId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(SERMON_TABS.OUTLINE);

  // Fetch current book
  const { data: currentBook = null, isLoading: isLoadingBook } = useQuery({
    queryKey: [`/api/books/${currentBookId}`],
    enabled: !!currentBookId,
  });

  // Fetch verses for current chapter
  const { data: verses = [], isLoading: isLoadingVerses } = useQuery({
    queryKey: [`/api/verses/${currentBookId}/${currentChapter}`],
    enabled: !!currentBookId && !!currentChapter,
  });

  // Fetch outlines for current chapter
  const { data: outlines = [], isLoading: isLoadingOutlines } = useQuery({
    queryKey: [`/api/outlines/${currentBookId}/${currentChapter}`],
    enabled: !!currentBookId && !!currentChapter,
    refetchOnWindowFocus: true,
    staleTime: 0, // Force refetch every time
  });

  const setCurrentLocation = useCallback((bookId: number, chapter: number) => {
    setCurrentBookId(bookId);
    setCurrentChapter(chapter);
    setActiveOutlineId(null);
  }, []);

  return (
    <BibleContext.Provider
      value={{
        currentBookId,
        currentChapter,
        currentBook,
        verses,
        outlines,
        activeOutlineId,
        activeTab,
        isLoading: isLoadingBook || isLoadingVerses || isLoadingOutlines,
        setCurrentLocation,
        setActiveOutlineId,
        setActiveTab,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error("useBible must be used within a BibleProvider");
  }
  return context;
}
