import { useState, useEffect } from "react";
import { useBible } from "@/contexts/BibleContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { SERMON_TABS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Combine, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SermonColumnProps {
  isOpen: boolean;
  toggleColumn: () => void;
  isMobile: boolean;
}

export default function SermonColumn({ isOpen, toggleColumn, isMobile }: SermonColumnProps) {
  const { 
    currentBook, 
    currentChapter, 
    outlines, 
    isLoading, 
    activeOutlineId, 
    setActiveOutlineId,
    activeTab,
    setActiveTab
  } = useBible();

  const formatVerseRange = (outline: any) => {
    if (outline.startChapter === outline.endChapter) {
      return `${currentBook?.name} ${outline.startChapter}:${outline.startVerse}-${outline.endVerse}`;
    }
    return `${currentBook?.name} ${outline.startChapter}:${outline.startVerse}-${outline.endChapter}:${outline.endVerse}`;
  };

  const { data: manuscript = null, isLoading: isLoadingManuscript } = useQuery<any>({
    queryKey: [`/api/manuscripts/${activeOutlineId}`],
    enabled: activeTab === SERMON_TABS.MANUSCRIPT && !!activeOutlineId,
  });

  const { data: commentaries = [], isLoading: isLoadingCommentaries } = useQuery<any[]>({
    queryKey: [`/api/commentaries/${currentBook?.id}/${currentChapter}`],
    enabled: activeTab === SERMON_TABS.COMMENTARY && !!currentBook?.id && !!currentChapter,
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleOutlineClick = (outlineId: number) => {
    setActiveOutlineId(outlineId);
    setActiveTab(SERMON_TABS.MANUSCRIPT);
  };

  if (!isOpen) return null;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 bg-white dark:bg-[hsl(var(--content-dark))] border-b border-gray-200 dark:border-gray-700">
        <div className="p-4 flex justify-between items-center">
          <h2 className="font-serif text-xl font-semibold">
            {isLoading ? (
              <Skeleton className="h-7 w-48" />
            ) : outlines.length > 0 ? (
              activeOutlineId && outlines.find(o => o.id === activeOutlineId) 
                ? outlines.find(o => o.id === activeOutlineId)?.title 
                : "Sermon Outlines"
            ) : (
              "No Sermons Available"
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
              <span className="sr-only">Toggle sermon column</span>
            </Button>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full rounded-none border-b border-gray-200 dark:border-gray-700 bg-transparent">
            <TabsTrigger 
              value={SERMON_TABS.OUTLINE} 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              Outline
            </TabsTrigger>
            <TabsTrigger 
              value={SERMON_TABS.MANUSCRIPT} 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              Manuscript
            </TabsTrigger>
            <TabsTrigger 
              value={SERMON_TABS.COMMENTARY} 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              Commentary
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {/* Outline Tab Content */}
          {activeTab === SERMON_TABS.OUTLINE && (
            <div className="space-y-6">
              {isLoading ? (
                <OutlineSkeleton />
              ) : outlines.length > 0 ? (
                outlines.map(outline => (
                  <Card 
                    key={outline.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:border-primary",
                      activeOutlineId === outline.id && "border-primary"
                    )}
                    onClick={() => handleOutlineClick(outline.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{outline.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatVerseRange(outline)}
                          </p>
                        </div>
                        <span className="text-primary">
                          <ChevronRight className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {(outline.points as string[]).map((point, idx) => (
                          <p key={idx} className="text-sm">{point}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No outlines available for this chapter.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Manuscript Tab Content */}
          {activeTab === SERMON_TABS.MANUSCRIPT && (
            <div className="space-y-6">
              {isLoadingManuscript ? (
                <ManuscriptSkeleton />
              ) : manuscript ? (
                <div>
                  <div className="mb-6">
                    <h3 className="font-serif font-bold text-xl mb-1">
                      {outlines.find(o => o.id === activeOutlineId)?.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activeOutlineId && outlines.find(o => o.id === activeOutlineId) 
                        ? formatVerseRange(outlines.find(o => o.id === activeOutlineId)) 
                        : ""}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {(manuscript.content as any[]).map((section, idx) => (
                      <div key={idx} className="space-y-4">
                        <h4 className="font-medium text-lg">{section.title}</h4>
                        {/* Check for the new format with HTML content or fall back to old format */}
                        {section.content ? (
                          <div 
                            className="prose dark:prose-invert max-w-none prose-headings:text-primary prose-headings:font-semibold prose-p:my-2 prose-ul:my-1 prose-ol:my-1" 
                            dangerouslySetInnerHTML={{ __html: section.content }}
                          />
                        ) : section.paragraphs ? (
                          // Handle legacy format
                          section.paragraphs.map((paragraph: string, pIdx: number) => (
                            <p key={pIdx}>{paragraph}</p>
                          ))
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">
                    {activeOutlineId 
                      ? "No manuscript available for this outline." 
                      : "Select an outline to view its manuscript."}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Commentary Tab Content */}
          {activeTab === SERMON_TABS.COMMENTARY && (
            <div className="space-y-6">
              {isLoadingCommentaries ? (
                <CommentarySkeleton />
              ) : commentaries.length > 0 ? (
                commentaries.map(commentary => (
                  <div key={commentary.id} className="space-y-4">
                    <h3 className="font-bold text-lg">
                      {currentBook?.name} {commentary.chapter}:{commentary.verse}
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-[hsl(220,13%,15%)] rounded-lg">
                      {/* Display formatted content if it's HTML, otherwise display as plain text */}
                      {commentary.content.includes('<') && commentary.content.includes('>') ? (
                        <div 
                          className="prose dark:prose-invert max-w-none prose-headings:text-primary prose-headings:font-semibold prose-p:my-2 prose-ul:my-1 prose-ol:my-1" 
                          dangerouslySetInnerHTML={{ __html: commentary.content }}
                        />
                      ) : (
                        <p className="mb-2">{commentary.content}</p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        — {commentary.source}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No commentaries available for this chapter.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function OutlineSkeleton() {
  return (
    <>
      {[1, 2].map(i => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

function ManuscriptSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="mb-6">
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>
      
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function CommentarySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="p-4 bg-gray-50 dark:bg-[hsl(220,13%,15%)] rounded-lg">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-48 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
