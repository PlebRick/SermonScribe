import { Button } from "@/components/ui/button";
import { MOBILE_VIEWS } from "@/lib/constants";
import { Scroll, BookOpen, FileText } from "lucide-react";

interface MobileNavigationProps {
  setMobileView: (view: "bible" | "sermon") => void;
  activeView: string;
  toggleMobileSidebar: () => void;
}

export default function MobileNavigation({ 
  setMobileView, 
  activeView, 
  toggleMobileSidebar 
}: MobileNavigationProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-content-dark border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around z-30">
      <Button
        variant="ghost"
        className="p-3 rounded-full flex flex-col items-center justify-center text-xs"
        onClick={toggleMobileSidebar}
      >
        <Scroll className="h-5 w-5 text-primary mb-1" />
        <span>Scroll</span>
      </Button>
      
      <Button
        variant={activeView === MOBILE_VIEWS.BIBLE ? "default" : "ghost"}
        className="p-3 rounded-full flex flex-col items-center justify-center text-xs"
        onClick={() => setMobileView("bible")}
      >
        <BookOpen className="h-5 w-5 mb-1" />
        <span>Text</span>
      </Button>
      
      <Button
        variant={activeView === MOBILE_VIEWS.SERMON ? "default" : "ghost"}
        className="p-3 rounded-full flex flex-col items-center justify-center text-xs"
        onClick={() => setMobileView("sermon")}
      >
        <FileText className="h-5 w-5 mb-1" />
        <span>Sermon</span>
      </Button>
    </div>
  );
}
