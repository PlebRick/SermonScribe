import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { COLUMN_STATE } from "@/lib/constants";
import { useColumnState } from "@/hooks/use-column-state";
import { useMobile } from "@/hooks/use-mobile";
import { 
  BookOpen, 
  Menu, 
  Moon, 
  Sun, 
  Columns, 
  FileText,
  Scroll,
  Settings
} from "lucide-react";
import { Link } from "wouter";
import BibleSearch from "./BibleSearch";
import { useState, useEffect } from "react";

interface HeaderProps {
  toggleMobileSidebar: () => void;
  toggleBibleVisibility?: () => void;
  toggleSermonVisibility?: () => void;
  isBibleVisible?: boolean;
  isSermonVisible?: boolean;
}

export default function Header({ 
  toggleMobileSidebar,
  toggleBibleVisibility,
  toggleSermonVisibility,
  isBibleVisible = true,
  isSermonVisible = true,
}: HeaderProps) {
  const { toggleTheme, isDark } = useTheme();
  const { isMobile } = useMobile();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[hsl(var(--sidebar-dark))] shadow-sm">
      <div className="px-2 md:px-3 py-3 flex items-center justify-between">
        <div className="flex items-center pl-1">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          <div className="flex items-center">
            <Scroll className="text-primary mr-2 h-6 w-6" />
            <h1 className="font-serif text-xl font-bold">SermonScribe</h1>
          </div>
        </div>
        
        {/* Bible Search - Only show on desktop */}
        {!isMobile && <BibleSearch />}
        
        <div className="flex items-center space-x-2">
          <Link href="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Admin</span>
            </Button>
          </Link>
        
          {/* Theme toggle - works as expected */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? (
              <Moon className="h-5 w-5 text-blue-300" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-500" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* Column toggles - should be visible on desktop and highlight when active */}
          {!isMobile && (
            <>
              {/* Bible Column Toggle - uses prop function for toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBibleVisibility}
                className={`rounded-full ${isBibleVisible ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <BookOpen className={`h-5 w-5 ${isBibleVisible ? 'text-primary' : ''}`} />
                <span className="sr-only">Toggle Bible column</span>
              </Button>
              
              {/* Sermon Column Toggle - uses prop function for toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSermonVisibility}
                className={`rounded-full ${isSermonVisible ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <FileText className={`h-5 w-5 ${isSermonVisible ? 'text-primary' : ''}`} />
                <span className="sr-only">Toggle sermon column</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
