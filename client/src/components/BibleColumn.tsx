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

  // Use inline style for visibility instead of just CSS classes
  const style = {
    display: isOpen ? 'flex' : 'none',
    flexDirection: 'column' as const,
    flex: 1,
    borderRight: '1px solid var(--border-color)',
    overflow: 'hidden'
  };

  // Set border color based on theme
  const borderColor = 'var(--border-color)';

  // Debug output for visibility
  console.log('Bible column visibility:', isOpen ? 'visible' : 'hidden');

  return (
    <div 
      className="flex-1 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
      style={{ display: isOpen ? 'flex' : 'none' }}>
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
                renderVerses(verses, currentBook?.shortName || '', currentChapter)
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

function renderVerses(verses: any[], bookShortName: string, chapter: number) {
  if (!verses.length) return null;
  
  // Try to get section data from our structured content
  let sections: Array<{
    title: string;
    verses: Array<{
      verse: number;
      text: string;
    }>;
  }> = [];
  
  try {
    // We'll use our structured content data when available for any book
    if (window.__BIBLE_CONTENT__ && bookShortName) {
      console.log('Trying to load data for', bookShortName, 'chapter', chapter);
      
      // Access books by their shortnames - cast to Record to fix TypeScript issues
      const bibleContent = window.__BIBLE_CONTENT__ as Record<string, any>;
      const bookKey = Object.keys(bibleContent).find(key => {
        // Match either by direct name or by shortName property
        return key === bookShortName.toLowerCase() || 
               (bibleContent[key]?.shortName === bookShortName.toLowerCase());
      });
      
      if (bookKey && bibleContent[bookKey]) {
        const bookData = bibleContent[bookKey];
        
        console.log(`${bookShortName} content available:`, true);
        
        if (bookData.chapters && bookData.chapters.length) {
          console.log(`${bookShortName} chapters:`, bookData.chapters.length);
          
          // Find the chapter object in the chapters array
          const chapterData = bookData.chapters.find((c: { chapter: number }) => c.chapter === chapter);
          if (chapterData && chapterData.sections) {
            console.log('Found chapter data, sections:', chapterData.sections.length);
            sections = chapterData.sections;
          } else {
            console.log('No chapter data found for chapter', chapter);
          }
        } else {
          console.log('No chapters found in book data');
        }
      } else {
        console.log(`Content for ${bookShortName} not found in bible content`);
        console.log('Available books:', Object.keys(bibleContent).join(', '));
      }
    }
  } catch (err) {
    console.error('Error getting section data:', err);
  }
  
  console.log('Final sections array:', sections?.length || 0);
  
  // If we got section data, render with proper headings
  if (sections && sections.length > 0) {
    return (
      <>
        {sections.map((section, sIndex) => (
          <div key={`section-${sIndex}`} className="space-y-4 mb-8">
            {section.title && (
              <h3 className="text-lg font-semibold text-primary/90 mb-2">{section.title}</h3>
            )}
            <p className="leading-relaxed">
              {section.verses.map((verseData, vIndex: number) => {
                // Find the full verse data to get the text
                const verse = verses.find(v => v.verse === verseData.verse);
                if (!verse) return null;
                
                return (
                  <span key={verse.id || `v-${verseData.verse}`}>
                    <span className="font-semibold text-primary">{verse.verse}</span> {verse.text}{' '}
                  </span>
                );
              })}
            </p>
          </div>
        ))}
      </>
    );
  }
  
  // Fallback: Group verses by ranges if we couldn't get section data
  const versesMap = new Map<string, any[]>();
  
  verses.forEach((verse) => {
    // Group verses into sections of 5
    const sectionIndex = Math.floor((verse.verse - 1) / 5);
    const sectionTitle = `Verses ${sectionIndex * 5 + 1}-${Math.min((sectionIndex + 1) * 5, verses[verses.length - 1]?.verse || 1)}`;
    
    if (!versesMap.has(sectionTitle)) {
      versesMap.set(sectionTitle, []);
    }
    
    versesMap.get(sectionTitle)?.push(verse);
  });
  
  return (
    <>
      {Array.from(versesMap.entries()).map(([sectionTitle, sectionVerses], sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-primary/90 mb-2">{sectionTitle}</h3>
          <p className="leading-relaxed">
            {sectionVerses.map((verse) => (
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
