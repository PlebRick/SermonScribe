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

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

export default function Header({ toggleMobileSidebar }: HeaderProps) {
  const { toggleTheme, isDark } = useTheme();
  const { columnState, toggleColumn } = useColumnState();
  const { isMobile } = useMobile();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[hsl(var(--sidebar-dark))] shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
            <h1 className="font-serif text-xl font-bold">Expository Sermons</h1>
          </div>
        </div>
        
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
          
          {!isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleColumn(COLUMN_STATE.SIDEBAR)}
                className="hidden md:flex"
              >
                <Columns className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleColumn(COLUMN_STATE.BIBLE)}
                className="hidden md:flex"
              >
                <BookOpen className="h-5 w-5" />
                <span className="sr-only">Toggle Scroll column</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleColumn(COLUMN_STATE.SERMON)}
                className="hidden md:flex"
              >
                <FileText className="h-5 w-5" />
                <span className="sr-only">Toggle sermon column</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
