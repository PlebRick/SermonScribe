import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Outline, Manuscript, Commentary, Book, ManuscriptSection, type Verse } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [selectedBook, setSelectedBook] = useState<number>(1);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedOutline, setSelectedOutline] = useState<number | null>(null);

  // Update selected chapter when book changes
  useEffect(() => {
    // Reset to chapter 1 when book changes
    setSelectedChapter(1);
  }, [selectedBook]);

  // Queries
  const { data: books } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    refetchOnWindowFocus: false,
  });

  // We now use the books data directly instead of making a separate query for book
  // This simplifies our code and avoids the need for an extra API call

  const { data: outlines, refetch: refetchOutlines } = useQuery<Outline[]>({
    queryKey: ["/api/outlines", selectedBook, selectedChapter],
    enabled: !!selectedBook && !!selectedChapter,
    refetchOnWindowFocus: false,
  });
  
  const { data: manuscript } = useQuery<Manuscript>({
    queryKey: ["/api/manuscripts", selectedOutline],
    enabled: !!selectedOutline,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const saveOutlineMutation = useMutation({
    mutationFn: async (outline: Outline) => {
      return apiRequest("POST", "/api/admin/outlines", outline);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Outline saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/outlines"] });
      refetchOutlines();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save outline: " + error,
        variant: "destructive",
      });
    },
  });
  
  const deleteOutlineMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/outlines/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Outline deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/outlines"] });
      setSelectedOutline(null);
      refetchOutlines();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete outline: " + error,
        variant: "destructive",
      });
    },
  });

  const saveManuscriptMutation = useMutation({
    mutationFn: async (manuscript: Manuscript) => {
      return apiRequest("POST", "/api/admin/manuscripts", manuscript);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Manuscript saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save manuscript: " + error,
        variant: "destructive",
      });
    },
  });

  const deleteManuscriptMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/manuscripts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Manuscript deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete manuscript: " + error,
        variant: "destructive",
      });
    },
  });

  const saveCommentaryMutation = useMutation({
    mutationFn: async (commentary: Commentary) => {
      return apiRequest("POST", "/api/admin/commentaries", commentary);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Commentary saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/commentaries"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save commentary: " + error,
        variant: "destructive",
      });
    },
  });
  
  const deleteCommentaryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/commentaries/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Commentary deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/commentaries"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete commentary: " + error,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Link href="/">
          <Button variant="outline">
            Back to Main Site
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="book-select">Book</Label>
          <Select 
            value={selectedBook?.toString()} 
            onValueChange={(value) => {
              const bookId = parseInt(value, 10);
              console.log("Book selected:", bookId);
              setSelectedBook(bookId);
              
              // Fetch book details directly when selected
              const selectedBookData = books?.find(b => b.id === bookId);
              console.log("Selected book data:", selectedBookData);
              if (selectedBookData) {
                console.log("Chapter count:", selectedBookData.chapterCount);
              }
            }}
          >
            <SelectTrigger id="book-select">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {books && (books as Book[]).sort((a: Book, b: Book) => a.position - b.position).map((book: Book) => (
                <SelectItem key={book.id} value={book.id.toString()}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="chapter-select">Chapter</Label>
          <Select 
            value={selectedChapter.toString()} 
            onValueChange={(value) => setSelectedChapter(parseInt(value, 10))}
          >
            <SelectTrigger id="chapter-select">
              <SelectValue placeholder="Select chapter" />
            </SelectTrigger>
            <SelectContent>
              {books && selectedBook && (() => {
                const selectedBookData = books.find(b => b.id === selectedBook);
                console.log("Rendering chapter dropdown for book:", selectedBookData);
                
                if (selectedBookData && selectedBookData.chapterCount) {
                  return Array.from(
                    { length: selectedBookData.chapterCount }, 
                    (_, i) => i + 1
                  ).map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()}>
                      {chapter}
                    </SelectItem>
                  ));
                }
                return null;
              })()}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="outlines" onValueChange={(tab) => {
          // When switching tabs, reset the selected outline if we need to
          if (tab === "outlines" || tab === "manuscripts") {
            // Make sure we fetch outlines again when switching tabs
            queryClient.invalidateQueries({ queryKey: ["/api/outlines", selectedBook, selectedChapter] });
          }
        }}>
        <TabsList className="mb-4">
          <TabsTrigger value="outlines">Outlines</TabsTrigger>
          <TabsTrigger value="manuscripts">Manuscripts</TabsTrigger>
          <TabsTrigger value="commentaries">Commentaries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="outlines">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Existing Outlines</h2>
              {outlines && outlines.length > 0 ? (
                <div className="space-y-4">
                  {outlines.map((outline: Outline) => (
                    <Card key={outline.id} className="relative">
                      <div className="cursor-pointer" onClick={() => setSelectedOutline(outline.id)}>
                        <CardHeader>
                          <CardTitle>{outline.title}</CardTitle>
                          <CardDescription>
                            {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5">
                            {outline.points.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this outline?")) {
                              deleteOutlineMutation.mutate(outline.id);
                            }
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No outlines found for this chapter.</p>
              )}
              <Button 
                className="mt-4"
                onClick={() => {
                  setSelectedOutline(null);
                }}
              >
                Create New Outline
              </Button>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">
                {selectedOutline ? "Edit Outline" : "New Outline"}
              </h2>
              <OutlineEditor 
                bookId={selectedBook} 
                chapter={selectedChapter} 
                outlineId={selectedOutline}
                onSave={(outline) => saveOutlineMutation.mutate(outline)}
                outlines={outlines || []}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="manuscripts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Outlines</h2>
              {outlines && outlines.length > 0 ? (
                <div className="space-y-4">
                  {outlines.map((outline: Outline) => (
                    <Card key={outline.id} className="relative">
                      <div className="cursor-pointer" onClick={() => setSelectedOutline(outline.id)}>
                        <CardHeader>
                          <CardTitle>{outline.title}</CardTitle>
                          <CardDescription>
                            {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
                          </CardDescription>
                        </CardHeader>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this outline?")) {
                              deleteOutlineMutation.mutate(outline.id);
                            }
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No outlines found for this chapter.</p>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Manuscript</h2>
              {selectedOutline ? (
                <div className="space-y-4">
                  {/* Show delete button only if a manuscript exists */}
                  {manuscript && manuscript.id && (
                    <div className="flex justify-end mb-4">
                      <Button 
                        variant="outline" 
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this manuscript?")) {
                            deleteManuscriptMutation.mutate(manuscript.id);
                            queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
                          }
                        }}
                      >
                        Delete Manuscript
                      </Button>
                    </div>
                  )}
                  <ManuscriptEditor 
                    outlineId={selectedOutline} 
                    onSave={(manuscript) => saveManuscriptMutation.mutate(manuscript)}
                  />
                </div>
              ) : (
                <p>Select an outline to edit or create a manuscript.</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="commentaries">
          <div className="grid grid-cols-1 gap-6">
            <h2 className="text-xl font-bold mb-4">Verse Commentaries</h2>
            <CommentaryEditor 
              bookId={selectedBook} 
              chapter={selectedChapter}
              onSave={(commentary) => saveCommentaryMutation.mutate(commentary)}
              onDelete={(id) => deleteCommentaryMutation.mutate(id)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OutlineEditor({ 
  bookId, 
  chapter, 
  outlineId,
  onSave,
  outlines
}: { 
  bookId: number, 
  chapter: number, 
  outlineId: number | null,
  onSave: (outline: Outline) => void,
  outlines: Outline[]
}) {
  const [title, setTitle] = useState("");
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(10);
  const [points, setPoints] = useState<string[]>([""]);

  const { data: outline } = useQuery<Outline>({
    queryKey: ["/api/outlines", outlineId],
    enabled: !!outlineId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (outline) {
      setTitle(outline.title);
      setStartVerse(outline.startVerse);
      setEndVerse(outline.endVerse);
      setPoints(outline.points);
    } else {
      // Reset form for new outline
      setTitle("");
      setStartVerse(1);
      setEndVerse(10);
      setPoints([""]);
    }
  }, [outline, outlineId]);

  const addPoint = () => {
    setPoints([...points, ""]);
  };

  const updatePoint = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const removePoint = (index: number) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove empty points
    const filteredPoints = points.filter(point => point.trim() !== "");
    
    const outlineData: Outline = {
      id: outlineId || undefined,
      title,
      bookId,
      startChapter: chapter,
      endChapter: chapter,
      startVerse,
      endVerse,
      points: filteredPoints
    };
    
    onSave(outlineData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-verse">Start Verse</Label>
          <Input
            id="start-verse"
            type="number"
            min={1}
            value={startVerse}
            onChange={(e) => setStartVerse(parseInt(e.target.value, 10))}
            required
          />
        </div>
        <div>
          <Label htmlFor="end-verse">End Verse</Label>
          <Input
            id="end-verse"
            type="number"
            min={startVerse}
            value={endVerse}
            onChange={(e) => setEndVerse(parseInt(e.target.value, 10))}
            required
          />
        </div>
      </div>
      
      <div>
        <Label>Outline Points</Label>
        {points.map((point, index) => (
          <div key={index} className="flex items-center mt-2">
            <Input
              value={point}
              onChange={(e) => updatePoint(index, e.target.value)}
              placeholder={`Point ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removePoint(index)}
              className="ml-2"
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPoint}
          className="mt-2"
        >
          Add Point
        </Button>
      </div>
      
      <Button type="submit" className="w-full">
        Save Outline
      </Button>
    </form>
  );
}

function ManuscriptEditor({ 
  outlineId, 
  onSave 
}: { 
  outlineId: number,
  onSave: (manuscript: Manuscript) => void
}) {
  const [sections, setSections] = useState<ManuscriptSection[]>([
    { title: "", content: "" }
  ]);

  const { data: manuscript } = useQuery<Manuscript>({
    queryKey: ["/api/manuscripts", outlineId],
    enabled: !!outlineId,
    refetchOnWindowFocus: false,
  });

  const { data: outline } = useQuery<Outline>({
    queryKey: ["/api/outlines", outlineId],
    enabled: !!outlineId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (manuscript) {
      // Handle existing manuscript format conversion if needed
      if (Array.isArray(manuscript.content)) {
        if ('paragraphs' in manuscript.content[0]) {
          // Convert old format to new format
          const convertedSections = (manuscript.content as any[]).map(oldSection => ({
            title: oldSection.title || '',
            content: oldSection.paragraphs ? oldSection.paragraphs.join('<br/>') : ''
          }));
          setSections(convertedSections);
        } else {
          // Already in new format
          setSections(manuscript.content as ManuscriptSection[]);
        }
      } else {
        // Default to empty section if content is not as expected
        setSections([{ title: "", content: "" }]);
      }
    } else {
      // Initialize with a default section for new manuscripts
      // If we have an outline, use its title as a starting point
      if (outline) {
        setSections([{ 
          title: outline.title || "Introduction", 
          content: "<p>Enter your manuscript content here...</p>" 
        }]);
      } else {
        setSections([{ title: "", content: "" }]);
      }
    }
  }, [manuscript, outline, outlineId]);

  const addSection = () => {
    setSections([...sections, { title: "", content: "" }]);
  };

  const updateSectionTitle = (index: number, title: string) => {
    const newSections = [...sections];
    newSections[index].title = title;
    setSections(newSections);
  };

  const updateSectionContent = (index: number, content: string) => {
    const newSections = [...sections];
    newSections[index].content = content;
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out completely empty sections
    const filteredSections = sections
      .filter(section => section.title.trim() !== "" || section.content.trim() !== "");
    
    const manuscriptData: Manuscript = {
      id: manuscript?.id,
      outlineId,
      content: filteredSections
    };
    
    onSave(manuscriptData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {outline && (
        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="text-lg font-medium mb-2">{outline.title}</h3>
          <div className="text-sm text-muted-foreground mb-2">
            {outline.bookId}:{outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
          </div>
          <div>
            <strong>Outline Points:</strong>
            <ul className="list-disc pl-5 mt-1">
              {outline.points && Array.isArray(outline.points) && outline.points.map((point: string, idx: number) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <Input
                value={section.title}
                onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                placeholder="Section Title"
                className="font-bold text-lg"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(sectionIndex)}
              >
                Remove Section
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RichTextEditor 
              content={section.content} 
              onChange={(html) => updateSectionContent(sectionIndex, html)}
            />
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={addSection}
        >
          Add Section
        </Button>
        
        <Button type="submit">
          Save Manuscript
        </Button>
      </div>
    </form>
  );
}

function CommentaryEditor({ 
  bookId, 
  chapter,
  onSave,
  onDelete
}: { 
  bookId: number, 
  chapter: number,
  onSave: (commentary: Commentary) => void,
  onDelete: (id: number) => void
}) {
  const [verse, setVerse] = useState(1);
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: commentaries, refetch: refetchCommentaries } = useQuery<Commentary[]>({
    queryKey: ["/api/commentaries", bookId, chapter],
    enabled: !!bookId && !!chapter,
    refetchOnWindowFocus: false,
  });

  const { data: verses } = useQuery<Verse[]>({
    queryKey: ["/api/verses", bookId, chapter],
    enabled: !!bookId && !!chapter,
    refetchOnWindowFocus: false,
  });

  const handleEditCommentary = (commentary: Commentary) => {
    setEditingId(commentary.id);
    setVerse(commentary.verse);
    setContent(commentary.content);
    setSource(commentary.source);
  };

  const handleClear = () => {
    setEditingId(null);
    setVerse(1);
    setContent("");
    setSource("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const commentaryData: Commentary = {
      id: editingId || undefined,
      bookId,
      chapter,
      verse,
      content,
      source
    };
    
    onSave(commentaryData);
    handleClear();
    refetchCommentaries();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Commentaries</h3>
        {commentaries && commentaries.length > 0 ? (
          <div className="space-y-4">
            {commentaries.map((commentary: Commentary) => (
              <Card key={commentary.id}>
                <CardHeader>
                  <CardTitle>Verse {commentary.verse}</CardTitle>
                  <CardDescription>{commentary.source}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Display formatted content if it's HTML, otherwise display as plain text */}
                  {commentary.content.includes('<') && commentary.content.includes('>') ? (
                    <div 
                      className="prose dark:prose-invert max-w-none" 
                      dangerouslySetInnerHTML={{ __html: commentary.content }}
                    />
                  ) : (
                    <p>{commentary.content}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleEditCommentary(commentary)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this commentary?")) {
                        onDelete(commentary.id);
                        refetchCommentaries();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>No commentaries found for this chapter.</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Commentary" : "New Commentary"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="verse">Verse</Label>
            <Select 
              value={verse.toString()} 
              onValueChange={(value) => setVerse(parseInt(value, 10))}
            >
              <SelectTrigger id="verse">
                <SelectValue placeholder="Select verse" />
              </SelectTrigger>
              <SelectContent>
                {verses && verses.map((v: Verse) => (
                  <SelectItem key={v.verse} value={v.verse.toString()}>
                    {v.verse}: {v.text.substring(0, 30)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="content">Commentary</Label>
            <div className="mt-2 border rounded-md overflow-hidden">
              <RichTextEditor 
                content={content} 
                onChange={setContent}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Commentary name, author"
              required
            />
          </div>
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleClear}>
              {editingId ? "Cancel" : "Clear"}
            </Button>
            <Button type="submit">
              Save Commentary
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}