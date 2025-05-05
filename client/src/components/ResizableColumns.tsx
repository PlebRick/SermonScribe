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
  const [leftWidthPercent, setLeftWidthPercent] = useState(defaultSizes[0]);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(leftWidthPercent);
  
  // Calculate visible columns and panel count
  const visibleCount = (showLeftColumn ? 1 : 0) + (showRightColumn ? 1 : 0);
  
  // Memoize the right width to always be the complement of left width
  const rightWidthPercent = 100 - leftWidthPercent;
  
  const handleDragStart = (clientX: number) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    startXRef.current = clientX;
    startWidthRef.current = leftWidthPercent;
    
    // Set cursor for the entire page during drag
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  const handleDragMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = clientX - startXRef.current;
    const deltaPercent = (deltaX / containerWidth) * 100;
    
    // Calculate new width percentage with constraints
    const newWidthPercent = Math.min(
      Math.max(20, startWidthRef.current + deltaPercent),
      80
    );
    
    setLeftWidthPercent(newWidthPercent);
  };
  
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
    
    // Add window event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleDragEnd();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX);
      
      // Add window event listeners
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX);
    }
  };
  
  const handleTouchEnd = () => {
    handleDragEnd();
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };
  
  // Memoize handlers to avoid dependency changes
  const memoizedHandlers = React.useCallback(() => {
    return {
      mouseMove: handleMouseMove,
      mouseUp: handleMouseUp,
      touchMove: handleTouchMove,
      touchEnd: handleTouchEnd
    };
  }, [isDragging]);
  
  // Clean up all event listeners on unmount
  useEffect(() => {
    const handlers = memoizedHandlers();
    
    return () => {
      window.removeEventListener('mousemove', handlers.mouseMove);
      window.removeEventListener('mouseup', handlers.mouseUp);
      window.removeEventListener('touchmove', handlers.touchMove);
      window.removeEventListener('touchend', handlers.touchEnd);
    };
  }, [memoizedHandlers]);
  
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
      className="flex flex-row w-full h-full relative border-none"
    >
      {/* Left column */}
      <div 
        style={{ width: `${leftWidthPercent}%` }} 
        className="h-full overflow-auto"
      >
        {leftColumn}
      </div>
      
      {/* Resizer handle - full height */}
      <div 
        className="absolute top-0 bottom-0 w-6 bg-transparent cursor-col-resize z-10 flex items-center justify-center"
        style={{ left: `calc(${leftWidthPercent}% - 12px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="h-full w-[3px] bg-gray-300 dark:bg-gray-600 mx-auto hover:bg-primary hover:w-[5px] transition-all rounded-full" />
      </div>
      
      {/* Right column */}
      <div 
        style={{ width: `${rightWidthPercent}%` }} 
        className="h-full overflow-auto border-none"
      >
        {rightColumn}
      </div>
    </div>
  );
}