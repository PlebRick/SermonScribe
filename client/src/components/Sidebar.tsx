import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import { useBible } from "@/contexts/BibleContext";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@shared/schema";
import { cn } from "@/lib/utils";
import { TESTAMENTS } from "@/lib/constants";
import { oldTestamentBooks, newTestamentBooks } from "@/lib/bible-data";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  closeMobileSidebar?: () => void;
  onToggleSidebar?: () => void;
}

export default function Sidebar({ isMobile, isOpen, closeMobileSidebar, onToggleSidebar }: SidebarProps) {
  const [expandedTestaments, setExpandedTestaments] = useState<Record<string, boolean>>({
    [TESTAMENTS.OLD]: true,
    [TESTAMENTS.NEW]: false
  });
  
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  
  const { setCurrentLocation } = useBible();

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });

  const toggleTestament = (testament: string) => {
    setExpandedTestaments(prev => ({
      ...prev,
      [testament]: !prev[testament]
    }));
  };

  const toggleBook = (bookId: number) => {
    setExpandedBooks(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const handleChapterClick = (bookId: number, chapter: number) => {
    setCurrentLocation(bookId, chapter);
    if (isMobile && closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  // Group books from API by testament - using data from API call
  // Only fall back to imported constants if the API call fails
  const apiOldTestamentBooks = books
    .filter((book) => book.testament === TESTAMENTS.OLD)
    .sort((a, b) => a.position - b.position);
    
  const apiNewTestamentBooks = books
    .filter((book) => book.testament === TESTAMENTS.NEW)
    .sort((a, b) => a.position - b.position);
  
  // Use API books or fall back to imported constant books
  const oldTestamentBooksToDisplay = apiOldTestamentBooks.length > 0 
    ? apiOldTestamentBooks 
    : oldTestamentBooks.sort((a, b) => a.position - b.position);
    
  const newTestamentBooksToDisplay = apiNewTestamentBooks.length > 0 
    ? apiNewTestamentBooks 
    : newTestamentBooks.sort((a, b) => a.position - b.position);

  if (!isOpen) {
    // Only render collapsed version for desktop
    if (!isMobile) {
      return (
        <aside className="w-12 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[hsl(var(--sidebar-dark))] flex flex-col items-center py-4">
          <div className="flex flex-col items-center gap-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Expand sidebar</span>
            </Button>
          </div>
        </aside>
      );
    }
    return null;
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="font-medium text-lg">Bible Navigation</h2>
          <BookOpen className="h-5 w-5 ml-2 text-primary" />
        </div>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Collapse sidebar</span>
            </Button>
          )}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={closeMobileSidebar}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="text-sm">
            {/* Old Testament */}
            <div className="mb-4">
              <div 
                className="flex items-center py-1 cursor-pointer hover:text-primary"
                onClick={() => toggleTestament(TESTAMENTS.OLD)}
              >
                <ChevronRight 
                  className={cn(
                    "mr-2 h-4 w-4 transition-transform", 
                    expandedTestaments[TESTAMENTS.OLD] && "rotate-90"
                  )} 
                />
                <span className="font-medium">Old Testament</span>
              </div>
              
              {expandedTestaments[TESTAMENTS.OLD] && (
                <div className="pl-6 mt-1">
                  {oldTestamentBooksToDisplay.map((book: Book) => (
                    <div key={book.id} className="mb-2">
                      <div 
                        className="flex items-center py-1 cursor-pointer hover:text-primary"
                        onClick={() => toggleBook(book.id)}
                      >
                        <ChevronRight 
                          className={cn(
                            "mr-2 h-4 w-4 transition-transform", 
                            expandedBooks[book.id] && "rotate-90"
                          )} 
                        />
                        <span>{book.name}</span>
                      </div>
                      
                      {expandedBooks[book.id] && (
                        <div className="pl-6">
                          {Array.from({ length: book.chapterCount }, (_, i) => i + 1).map(chapter => (
                            <div 
                              key={`${book.id}-${chapter}`}
                              className="py-1 cursor-pointer hover:text-primary"
                              onClick={() => handleChapterClick(book.id, chapter)}
                            >
                              <span>Chapter {chapter}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* New Testament */}
            <div>
              <div 
                className="flex items-center py-1 cursor-pointer hover:text-primary"
                onClick={() => toggleTestament(TESTAMENTS.NEW)}
              >
                <ChevronRight 
                  className={cn(
                    "mr-2 h-4 w-4 transition-transform", 
                    expandedTestaments[TESTAMENTS.NEW] && "rotate-90"
                  )} 
                />
                <span className="font-medium">New Testament</span>
              </div>
              
              {expandedTestaments[TESTAMENTS.NEW] && (
                <div className="pl-6 mt-1">
                  {newTestamentBooksToDisplay.map((book: Book) => (
                    <div key={book.id} className="mb-2">
                      <div 
                        className="flex items-center py-1 cursor-pointer hover:text-primary"
                        onClick={() => toggleBook(book.id)}
                      >
                        <ChevronRight 
                          className={cn(
                            "mr-2 h-4 w-4 transition-transform", 
                            expandedBooks[book.id] && "rotate-90"
                          )} 
                        />
                        <span>{book.name}</span>
                      </div>
                      
                      {expandedBooks[book.id] && (
                        <div className="pl-6">
                          {Array.from({ length: book.chapterCount }, (_, i) => i + 1).map(chapter => (
                            <div 
                              key={`${book.id}-${chapter}`}
                              className="py-1 cursor-pointer hover:text-primary"
                              onClick={() => handleChapterClick(book.id, chapter)}
                            >
                              <span>Chapter {chapter}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <div className={cn(
        "fixed inset-0 z-40",
        !isOpen && "hidden"
      )}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeMobileSidebar}></div>
        <div 
          className={cn(
            "absolute inset-y-0 left-0 w-64 bg-white dark:bg-[hsl(var(--sidebar-dark))] transform transition-transform duration-300", 
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[hsl(var(--sidebar-dark))] transition-all duration-300 overflow-hidden">
      {sidebarContent}
    </aside>
  );
}
