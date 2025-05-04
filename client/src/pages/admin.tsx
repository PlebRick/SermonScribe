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
import { Outline, Manuscript, Commentary, Book } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [selectedBook, setSelectedBook] = useState<number>(1);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedOutline, setSelectedOutline] = useState<number | null>(null);

  // Queries
  const { data: books } = useQuery({
    queryKey: ["/api/books"],
    refetchOnWindowFocus: false,
  });

  const { data: book } = useQuery({
    queryKey: ["/api/books", selectedBook],
    enabled: !!selectedBook,
    refetchOnWindowFocus: false,
  });

  const { data: outlines, refetch: refetchOutlines } = useQuery({
    queryKey: ["/api/outlines", selectedBook, selectedChapter],
    enabled: !!selectedBook && !!selectedChapter,
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="book-select">Book</Label>
          <Select 
            value={selectedBook?.toString()} 
            onValueChange={(value) => setSelectedBook(parseInt(value, 10))}
          >
            <SelectTrigger id="book-select">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {books?.map((book: Book) => (
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
              {book && Array.from({ length: book.chapterCount }, (_, i) => i + 1).map((chapter) => (
                <SelectItem key={chapter} value={chapter.toString()}>
                  {chapter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="outlines">
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
                    <Card key={outline.id} className="cursor-pointer" onClick={() => setSelectedOutline(outline.id)}>
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
                    <Card key={outline.id} className="cursor-pointer" onClick={() => setSelectedOutline(outline.id)}>
                      <CardHeader>
                        <CardTitle>{outline.title}</CardTitle>
                        <CardDescription>
                          {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
                        </CardDescription>
                      </CardHeader>
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
                <ManuscriptEditor 
                  outlineId={selectedOutline} 
                  onSave={(manuscript) => saveManuscriptMutation.mutate(manuscript)}
                />
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

  const { data: outline } = useQuery({
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
  const [sections, setSections] = useState<{title: string, paragraphs: string[]}[]>([
    { title: "", paragraphs: [""] }
  ]);

  const { data: manuscript } = useQuery({
    queryKey: ["/api/manuscripts", outlineId],
    enabled: !!outlineId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (manuscript) {
      setSections(manuscript.content);
    } else {
      setSections([{ title: "", paragraphs: [""] }]);
    }
  }, [manuscript, outlineId]);

  const addSection = () => {
    setSections([...sections, { title: "", paragraphs: [""] }]);
  };

  const updateSectionTitle = (index: number, title: string) => {
    const newSections = [...sections];
    newSections[index].title = title;
    setSections(newSections);
  };

  const addParagraph = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].paragraphs.push("");
    setSections(newSections);
  };

  const updateParagraph = (sectionIndex: number, paragraphIndex: number, text: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].paragraphs[paragraphIndex] = text;
    setSections(newSections);
  };

  const removeParagraph = (sectionIndex: number, paragraphIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].paragraphs = newSections[sectionIndex].paragraphs
      .filter((_, i) => i !== paragraphIndex);
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty sections and paragraphs
    const filteredSections = sections
      .filter(section => section.title.trim() !== "" || section.paragraphs.some(p => p.trim() !== ""))
      .map(section => ({
        title: section.title,
        paragraphs: section.paragraphs.filter(p => p.trim() !== "")
      }));
    
    const manuscriptData: Manuscript = {
      id: manuscript?.id,
      outlineId,
      content: filteredSections
    };
    
    onSave(manuscriptData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardHeader>
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
          <CardContent className="space-y-4">
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <div key={paragraphIndex} className="space-y-2">
                <div className="flex justify-between items-start">
                  <Label>Paragraph {paragraphIndex + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParagraph(sectionIndex, paragraphIndex)}
                  >
                    Remove
                  </Button>
                </div>
                <Textarea
                  value={paragraph}
                  onChange={(e) => updateParagraph(sectionIndex, paragraphIndex, e.target.value)}
                  rows={4}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addParagraph(sectionIndex)}
            >
              Add Paragraph
            </Button>
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
  onSave 
}: { 
  bookId: number, 
  chapter: number,
  onSave: (commentary: Commentary) => void
}) {
  const [verse, setVerse] = useState(1);
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: commentaries, refetch: refetchCommentaries } = useQuery({
    queryKey: ["/api/commentaries", bookId, chapter],
    enabled: !!bookId && !!chapter,
    refetchOnWindowFocus: false,
  });

  const { data: verses } = useQuery({
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
                  <p>{commentary.content}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => handleEditCommentary(commentary)}
                  >
                    Edit
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
                {verses && verses.map((v: any) => (
                  <SelectItem key={v.verse} value={v.verse.toString()}>
                    {v.verse}: {v.text.substring(0, 30)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="content">Commentary</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
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