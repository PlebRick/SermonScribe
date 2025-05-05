import React, { useState, useRef, useEffect } from 'react';

interface ResizableColumnsProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  showLeftColumn: boolean;
  showRightColumn: boolean;
  isMobile: boolean;
  defaultSizes?: number[];
}

export default function ResizableColumns({
  leftColumn,
  rightColumn,
  showLeftColumn,
  showRightColumn,
  isMobile,
  defaultSizes = [50, 50],
}: ResizableColumnsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultSizes[0]);
  const [rightWidth, setRightWidth] = useState(defaultSizes[1]);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startLeftWidthRef = useRef<number>(leftWidth);
  
  // Calculate visible columns and panel count
  const visibleCount = (showLeftColumn ? 1 : 0) + (showRightColumn ? 1 : 0);
  
  // Handle mouse down event on the resizer
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startLeftWidthRef.current = leftWidth;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle mouse move event
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - startXRef.current;
    const newLeftWidth = Math.min(
      Math.max(20, (startLeftWidthRef.current + deltaX / containerWidth * 100)), 
      80
    );
    
    setLeftWidth(newLeftWidth);
    setRightWidth(100 - newLeftWidth);
  };
  
  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // On mobile, use full width for the visible column
  if (isMobile) {
    return (
      <div className="flex flex-col w-full h-full">
        {showLeftColumn && <div className="h-full w-full">{leftColumn}</div>}
        {showRightColumn && <div className="h-full w-full">{rightColumn}</div>}
      </div>
    );
  }
  
  // If both columns are hidden or just one is visible, don't use resizable panels
  if (visibleCount < 2) {
    return (
      <div className="flex flex-row w-full h-full">
        {showLeftColumn && <div className="h-full w-full">{leftColumn}</div>}
        {showRightColumn && <div className="h-full w-full">{rightColumn}</div>}
      </div>
    );
  }
  
  // Both columns are visible, use resizable containers
  return (
    <div 
      ref={containerRef}
      className="flex flex-row w-full h-full relative" 
      style={{ cursor: isDragging ? 'col-resize' : 'auto' }}
    >
      <div 
        style={{ width: `${leftWidth}%` }} 
        className="h-full overflow-auto transition-all duration-75"
      >
        {leftColumn}
      </div>
      
      <div 
        ref={handleRef}
        className="absolute top-0 bottom-0 w-6 bg-transparent cursor-col-resize z-10 flex items-center justify-center"
        style={{ left: `calc(${leftWidth}% - 12px)` }}
        onMouseDown={handleMouseDown}
      >
        <div className="h-full w-[3px] bg-gray-300 dark:bg-gray-600 mx-auto hover:bg-primary hover:w-[5px] transition-all rounded-full" />
      </div>
      
      <div 
        style={{ width: `${rightWidth}%` }} 
        className="h-full overflow-auto transition-all duration-75"
      >
        {rightColumn}
      </div>
    </div>
  );
}