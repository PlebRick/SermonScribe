import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useBible } from "@/contexts/BibleContext";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@shared/schema";

export default function BibleSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const { setCurrentLocation } = useBible();
  
  // Get all books for search
  const { data: books = [] } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });
  
  // Filter suggestions based on search query
  const suggestions = books
    .filter(book => {
      const query = searchQuery.toLowerCase();
      return book.name.toLowerCase().includes(query) || 
             book.shortName.toLowerCase().includes(query);
    })
    .slice(0, 10); // Limit to 10 suggestions
  
  // Handle navigation
  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    
    // Pattern: "Book Chapter" or just "Book"
    // Examples: "Genesis 1", "Gen 1", "Genesis", "Gen"
    const parts = query.split(/\s+/);
    const bookPart = parts[0];
    const chapterPart = parts.length > 1 ? parseInt(parts[1]) : 1; // Default to chapter 1
    
    // Find book by name or shortName, case insensitive
    const book = books.find(b => 
      b.name.toLowerCase() === bookPart.toLowerCase() || 
      b.shortName.toLowerCase() === bookPart.toLowerCase()
    );
    
    if (book) {
      // Ensure chapter is valid
      const chapter = isNaN(chapterPart) ? 1 : 
                     chapterPart > book.chapterCount ? book.chapterCount : 
                     chapterPart < 1 ? 1 : chapterPart;
      
      setCurrentLocation(book.id, chapter);
      setSearchQuery(""); // Clear input
      setShowSuggestions(false);
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        // Select the highlighted suggestion
        const book = suggestions[selectedIndex];
        setSearchQuery(`${book.name} `); // Set search to book name with space
        inputRef.current?.focus();
        setSelectedIndex(-1);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };
  
  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative flex-1 max-w-xs mx-2">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          className="pr-8 pl-3 py-1 h-9 text-sm"
          placeholder="Find book (e.g. Genesis 1)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchQuery.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </button>
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden"
        >
          <ul className="py-1">
            {suggestions.map((book, index) => (
              <li 
                key={book.id}
                className={`px-3 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-sm ${
                  index === selectedIndex ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                onClick={() => {
                  setSearchQuery(`${book.name} `);
                  inputRef.current?.focus();
                  setShowSuggestions(false);
                }}
              >
                {book.name} ({book.shortName})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}