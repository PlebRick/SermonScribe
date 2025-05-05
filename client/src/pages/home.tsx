import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BibleColumn from "@/components/BibleColumn";
import SermonColumn from "@/components/SermonColumn";
import MobileNavigation from "@/components/MobileNavigation";
import { useMobile } from "@/hooks/use-mobile";
import { useColumnState } from "@/hooks/use-column-state";
import { COLUMN_STATE, MOBILE_VIEWS } from "@/lib/constants";

export default function Home() {
  const { isMobile } = useMobile();
  const { columnState, toggleColumn, setMobileView } = useColumnState();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState(MOBILE_VIEWS.BIBLE);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar 
            isMobile={false} 
            isOpen={!sidebarCollapsed} 
            onToggleSidebar={toggleSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <Sidebar 
          isMobile={isMobile} 
          isOpen={mobileSidebarOpen} 
          closeMobileSidebar={closeMobileSidebar}
          onToggleSidebar={toggleSidebar} 
        />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <BibleColumn 
            isOpen={columnState[COLUMN_STATE.BIBLE]} 
            toggleColumn={() => toggleColumn(COLUMN_STATE.BIBLE)}
            isMobile={isMobile}
          />
          
          <SermonColumn 
            isOpen={columnState[COLUMN_STATE.SERMON]} 
            toggleColumn={() => toggleColumn(COLUMN_STATE.SERMON)}
            isMobile={isMobile}
          />
        </main>
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
