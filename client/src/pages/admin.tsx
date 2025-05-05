import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
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
                      </div>
                      <div className="absolute top-3 right-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this outline?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The outline will be permanently deleted.
                                Any associated manuscripts or commentaries might become orphaned.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteOutlineMutation.mutate(outline.id);
                                }}
                                className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Outlines</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOutline(null);
                      // Switch to the outlines tab to create a new outline
                      const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                      if (outlineTab) outlineTab.click();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Outline
                  </Button>
                </div>
                {outlines && outlines.length > 0 ? (
                  <div className="space-y-4">
                    {outlines.map((outline: Outline) => (
                      <Card key={outline.id} className={`relative cursor-pointer ${selectedOutline === outline.id ? 'border-primary' : ''}`}>
                        <div className="flex" onClick={() => setSelectedOutline(outline.id)}>
                          <CardHeader className="flex-1">
                            <CardTitle className="text-sm">{outline.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
                            </CardDescription>
                          </CardHeader>
                          <div className="p-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-red-500 h-6 w-6"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to delete this outline?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. The outline will be permanently deleted.
                                    Any associated manuscripts or commentaries might become orphaned.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteOutlineMutation.mutate(outline.id);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center my-8">
                    <p className="mb-4">No outlines found for this chapter.</p>
                    <Button 
                      onClick={() => {
                        setSelectedOutline(null);
                        // Switch to the outlines tab to create a new outline
                        const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                        if (outlineTab) outlineTab.click();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create First Outline
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-3">
                {selectedOutline ? (
                  <div className="space-y-4">
                    <div className="flex justify-between mb-4">
                      <h2 className="text-xl font-bold">
                        {manuscript && manuscript.id ? "Edit Manuscript" : "Add New Manuscript"}
                      </h2>
                      <div className="flex space-x-2">
                        {manuscript && manuscript.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this manuscript?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The manuscript will be permanently deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => {
                                    deleteManuscriptMutation.mutate(manuscript.id);
                                    queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
                                  }}
                                  className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                    <ManuscriptEditor 
                      outlineId={selectedOutline} 
                      onSave={(manuscript) => saveManuscriptMutation.mutate(manuscript)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="mb-4 text-lg text-center">Select an outline to edit or create a manuscript</p>
                    <p className="text-sm text-muted-foreground mb-6 text-center">
                      Manuscripts are always connected to an outline. To create a new manuscript with a different verse range,
                      first create a new outline.
                    </p>
                    <Button 
                      onClick={() => {
                        setSelectedOutline(null);
                        // Switch to the outlines tab to create a new outline
                        const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                        if (outlineTab) outlineTab.click();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create New Outline
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="commentaries">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Outlines</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOutline(null);
                      // Switch to the outlines tab to create a new outline
                      const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                      if (outlineTab) outlineTab.click();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Outline
                  </Button>
                </div>
                {outlines && outlines.length > 0 ? (
                  <div className="space-y-4">
                    {outlines.map((outline: Outline) => (
                      <Card key={outline.id} className={`relative cursor-pointer ${selectedOutline === outline.id ? 'border-primary' : ''}`}>
                        <div className="cursor-pointer" onClick={() => setSelectedOutline(outline.id)}>
                          <CardHeader>
                            <CardTitle className="text-sm">{outline.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
                            </CardDescription>
                          </CardHeader>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center my-8">
                    <p className="mb-4">No outlines found for this chapter.</p>
                    <Button 
                      onClick={() => {
                        setSelectedOutline(null);
                        // Switch to the outlines tab to create a new outline
                        const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                        if (outlineTab) outlineTab.click();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create First Outline
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-3">
                {selectedOutline ? (
                  <div className="space-y-4">
                    <div className="flex justify-between mb-4">
                      <h2 className="text-xl font-bold">Commentaries</h2>
                    </div>
                    <CommentaryEditor 
                      bookId={selectedBook} 
                      chapter={selectedChapter}
                      outlineId={selectedOutline}
                      onSave={(commentary) => saveCommentaryMutation.mutate(commentary)}
                      onDelete={(id) => deleteCommentaryMutation.mutate(id)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="mb-4 text-lg text-center">Select an outline to edit or create commentaries</p>
                    <p className="text-sm text-muted-foreground mb-6 text-center">
                      Commentaries are always connected to an outline. To create a new commentary with a different verse range,
                      first create a new outline.
                    </p>
                    <Button 
                      onClick={() => {
                        setSelectedOutline(null);
                        // Switch to the outlines tab to create a new outline
                        const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                        if (outlineTab) outlineTab.click();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create New Outline
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
      setTitle(outline.title || "");
      setStartVerse(outline.startVerse || 1);
      setEndVerse(outline.endVerse || 10);
      // Ensure points is always an array
      setPoints(Array.isArray(outline.points) ? outline.points : [""]);
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
    
    // Cast to any to avoid TypeScript errors with optional fields
    const outlineData: any = {
      id: outlineId || undefined,
      title,
      bookId,
      startChapter: chapter,
      endChapter: chapter,
      startVerse: startVerse || 1,
      endVerse: endVerse || 1,
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
  const [content, setContent] = useState("");

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
      // Extract content from the first section, or combine all sections
      if (Array.isArray(manuscript.content)) {
        if (manuscript.content.length > 0) {
          if ('content' in manuscript.content[0]) {
            // Use the first section's content directly
            setContent(manuscript.content[0].content || "");
          } else if ('paragraphs' in manuscript.content[0]) {
            // Convert old format
            const paragraphs = (manuscript.content as any[])
              .flatMap(section => section.paragraphs || [])
              .join('<br/>');
            setContent(paragraphs);
          }
        }
      } else {
        // Default to empty content if format is unexpected
        setContent("");
      }
    } else {
      // Initialize with empty content for new manuscripts
      setContent("<p>Enter your manuscript content here...</p>");
    }
  }, [manuscript, outline, outlineId]);

  const updateSectionContent = (_index: number, newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a single section with the outline title and content
    // Cast to any to avoid TypeScript errors with optional fields
    const manuscriptData: any = {
      id: manuscript?.id,
      outlineId,
      content: [{ 
        title: outline?.title || "", 
        content: content 
      }]
    };
    
    onSave(manuscriptData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {outline && (
        <div className="bg-muted p-4 rounded-md mb-4">
          <h2 className="text-xl font-bold mb-2">{outline.title}</h2>
          <p className="text-sm text-muted-foreground">
            {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
          </p>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <RichTextEditor 
            content={content} 
            onChange={(html) => updateSectionContent(0, html)}
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" className="px-8">
          Save Manuscript
        </Button>
      </div>
    </form>
  );
}

function CommentaryEditor({ 
  bookId, 
  chapter,
  outlineId,
  onSave,
  onDelete
}: { 
  bookId: number, 
  chapter: number,
  outlineId: number,
  onSave: (commentary: Commentary) => void,
  onDelete: (id: number) => void
}) {
  const [content, setContent] = useState("");
  const [source, setSource] = useState("Study Notes");

  const { data: commentaries, refetch: refetchCommentaries } = useQuery<Commentary[]>({
    queryKey: ["/api/commentaries", bookId, chapter, outlineId],
    enabled: !!bookId && !!chapter,
    refetchOnWindowFocus: false,
  });

  const { data: outline } = useQuery<Outline>({
    queryKey: ["/api/outlines", outlineId],
    enabled: !!outlineId,
    refetchOnWindowFocus: false,
  });

  // Get the single commentary for this outline if it exists
  const currentCommentary = commentaries?.find(c => c.outlineId === outlineId);

  useEffect(() => {
    if (currentCommentary) {
      setContent(currentCommentary.content || "");
      setSource(currentCommentary.source || "Study Notes");
    } else {
      // Initialize with empty content for new commentary
      setContent("<p>Enter your commentary notes here...</p>");
      setSource("Study Notes");
    }
  }, [currentCommentary, outlineId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cast to any to avoid TypeScript errors with optional fields
    const commentaryData: any = {
      id: currentCommentary?.id,
      bookId,
      chapter,
      verse: outline?.startVerse || 1,
      outlineId,
      content,
      source
    };
    
    onSave(commentaryData);
    refetchCommentaries();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {currentCommentary ? "Edit Commentary" : "Add New Commentary"} 
        </h3>
        {currentCommentary && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this commentary?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The commentary will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => {
                    if (currentCommentary?.id) {
                      onDelete(currentCommentary.id);
                      refetchCommentaries();
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {outline && (
          <div className="bg-muted p-4 rounded-md mb-4">
            <h2 className="text-xl font-bold mb-2">{outline.title}</h2>
            <p className="text-sm text-muted-foreground">
              {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
            </p>
          </div>
        )}

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <RichTextEditor 
              content={content} 
              onChange={(html) => setContent(html)}
            />
          </CardContent>
        </Card>
        
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Commentary name, author"
              className="mb-4"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Save Commentary
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}