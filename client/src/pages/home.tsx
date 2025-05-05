import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BibleColumn from "@/components/BibleColumn";
import SermonColumn from "@/components/SermonColumn";
import MobileNavigation from "@/components/MobileNavigation";
import { useMobile } from "@/hooks/use-mobile";
import { useColumnState } from "@/hooks/use-column-state";
import { COLUMN_STATE, MOBILE_VIEWS } from "@/lib/constants";
import { BookOpen, ChevronRight } from "lucide-react";

export default function Home() {
  const { isMobile } = useMobile();
  const { columnState, toggleColumn, setMobileView } = useColumnState();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState(MOBILE_VIEWS.BIBLE);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // Local state for managing column visibility directly
  const [isBibleVisible, setIsBibleVisible] = useState(true);
  const [isSermonVisible, setIsSermonVisible] = useState(true);
  
  // Direct toggle functions for column visibility with more accurate logging
  const toggleBibleVisibility = () => {
    const newState = !isBibleVisible;
    console.log('TOGGLING BIBLE COLUMN TO:', newState);
    setIsBibleVisible(newState);
    
    // If we're hiding this one but the other one is also hidden, show the other one
    if (!newState && !isSermonVisible) {
      setIsSermonVisible(true);
      console.log('Auto-showing sermon column');
    }
  };
  
  const toggleSermonVisibility = () => {
    const newState = !isSermonVisible;
    console.log('TOGGLING SERMON COLUMN TO:', newState);
    setIsSermonVisible(newState);
    
    // If we're hiding this one but the other one is also hidden, show the other one
    if (!newState && !isBibleVisible) {
      setIsBibleVisible(true);
      console.log('Auto-showing bible column');
    }
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleSetMobileView = (view: "bible" | "sermon") => {
    setMobileView(view);
    setActiveMobileView(view);
  };

  useEffect(() => {
    // If on mobile, set the active view based on which column is visible
    if (isMobile) {
      if (columnState[COLUMN_STATE.BIBLE]) {
        setActiveMobileView(MOBILE_VIEWS.BIBLE);
      } else if (columnState[COLUMN_STATE.SERMON]) {
        setActiveMobileView(MOBILE_VIEWS.SERMON);
      }
    }
  }, [columnState, isMobile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleMobileSidebar={toggleMobileSidebar}
        toggleBibleVisibility={toggleBibleVisibility}
        toggleSermonVisibility={toggleSermonVisibility}
        isBibleVisible={isBibleVisible}
        isSermonVisible={isSermonVisible}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - either collapsed or expanded version */}
        {!isMobile && (
          sidebarCollapsed ? (
            // Collapsed sidebar with only icon
            <div className="w-14 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[hsl(var(--sidebar-dark))] flex flex-col items-center py-8">
              <BookOpen className="h-6 w-6 text-primary mb-4" />
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            // Expanded sidebar
            <Sidebar 
              isMobile={false} 
              isOpen={true} 
              onToggleSidebar={toggleSidebar}
            />
          )
        )}
        
        {/* Mobile Sidebar - overlay when opened */}
        {isMobile && (
          <Sidebar 
            isMobile={true} 
            isOpen={mobileSidebarOpen} 
            closeMobileSidebar={closeMobileSidebar}
            onToggleSidebar={toggleSidebar} 
          />
        )}
        
        {/* Main Content - directly handle visibility here */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Bible Column - always render with special class for direct DOM manipulation */}
          <div 
            className="flex-1 overflow-hidden bible-column-container"
            style={{ display: isBibleVisible ? 'block' : 'none' }}
          >
            <BibleColumn 
              isOpen={true} 
              toggleColumn={() => toggleColumn(COLUMN_STATE.BIBLE)}
              isMobile={isMobile}
            />
          </div>
          
          {/* Sermon Column - always render with special class for direct DOM manipulation */}
          <div 
            className="flex-1 overflow-hidden sermon-column-container"
            style={{ display: isSermonVisible ? 'block' : 'none' }}
          >
            <SermonColumn 
              isOpen={true} 
              toggleColumn={() => toggleColumn(COLUMN_STATE.SERMON)}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileNavigation 
          setMobileView={handleSetMobileView}
          activeView={activeMobileView}
          toggleMobileSidebar={toggleMobileSidebar}
        />
      )}
    </div>
  );
}
