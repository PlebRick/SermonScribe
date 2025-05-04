import { useBible } from "@/contexts/BibleContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { Combine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BibleColumnProps {
  isOpen: boolean;
  toggleColumn: () => void;
  isMobile: boolean;
}

export default function BibleColumn({ isOpen, toggleColumn, isMobile }: BibleColumnProps) {
  const { 
    currentBook, 
    currentChapter, 
    verses, 
    isLoading 
  } = useBible();
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll when changing chapters
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentBook, currentChapter]);

  if (!isOpen) return null;

  return (
    <div className="flex-1 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 bg-white dark:bg-[hsl(var(--content-dark))] border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <h2 className="font-serif text-xl font-semibold">
          {isLoading ? (
            <Skeleton className="h-7 w-32" />
          ) : (
            `${currentBook?.name || ""} ${currentChapter}`
          )}
        </h2>
        
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleColumn}
            className={cn(!isMobile && "hidden md:flex")}
          >
            <Combine className="h-5 w-5" />
            <span className="sr-only">Toggle Bible column</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="p-4 md:p-6 font-serif">
          {isLoading ? (
            <BibleSkeleton />
          ) : (
            <div className="space-y-6">
              {verses.length > 0 ? (
                renderVerses(verses)
              ) : (
                <p className="text-gray-500 italic text-center py-10">No verses available for this chapter.</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function renderVerses(verses: any[]) {
  // Group verses by sections (every 5 verses)
  const sections: any[][] = [];
  let currentSection: any[] = [];
  
  verses.forEach((verse, index) => {
    if (index % 5 === 0 && index > 0) {
      sections.push(currentSection);
      currentSection = [];
    }
    currentSection.push(verse);
  });
  
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }
  
  return (
    <>
      {sections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="space-y-4">
          <p>
            {section.map((verse, verseIndex) => (
              <span key={verse.id}>
                <span className="font-semibold text-primary">{verse.verse}</span> {verse.text}{' '}
              </span>
            ))}
          </p>
        </div>
      ))}
    </>
  );
}

function BibleSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-48 mb-4" />
      
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
