import { useState, useCallback, useEffect } from "react";
import { COLUMN_STATE } from "@/lib/constants";
import { useMobile } from "@/hooks/use-mobile";

// Define column names as type for better type safety
type ColumnName = typeof COLUMN_STATE[keyof typeof COLUMN_STATE];

// Use Record for better type mapping
interface ColumnState extends Record<ColumnName, boolean> {}

export function useColumnState() {
  const { isMobile } = useMobile();
  
  const [columnState, setColumnState] = useState<ColumnState>({
    [COLUMN_STATE.SIDEBAR]: !isMobile,
    [COLUMN_STATE.BIBLE]: true,
    [COLUMN_STATE.SERMON]: true,
  });

  // On mobile, ensure we don't show both columns at once
  useEffect(() => {
    if (isMobile && columnState[COLUMN_STATE.BIBLE] && columnState[COLUMN_STATE.SERMON]) {
      setColumnState(prev => ({
        ...prev,
        [COLUMN_STATE.SERMON]: false
      }));
    }
  }, [isMobile, columnState]);

  const toggleColumn = useCallback((columnName: keyof ColumnState) => {
    console.log(`Toggle column called for: ${columnName}, current state:`, columnState[columnName]);
    
    setColumnState(prev => {
      const newState = {
        ...prev,
        [columnName]: !prev[columnName]
      };

      // On mobile, ensure only one content column is active at a time
      if (isMobile && columnName !== COLUMN_STATE.SIDEBAR) {
        if (columnName === COLUMN_STATE.BIBLE && newState[COLUMN_STATE.BIBLE]) {
          newState[COLUMN_STATE.SERMON] = false;
        } else if (columnName === COLUMN_STATE.SERMON && newState[COLUMN_STATE.SERMON]) {
          newState[COLUMN_STATE.BIBLE] = false;
        }
      }
      
      console.log(`New state for ${columnName}:`, newState[columnName]);
      return newState;
    });
  }, [isMobile, columnState]);

  const setMobileView = useCallback((column: "bible" | "sermon") => {
    if (!isMobile) return;

    setColumnState(prev => ({
      ...prev,
      [COLUMN_STATE.BIBLE]: column === "bible",
      [COLUMN_STATE.SERMON]: column === "sermon"
    }));
  }, [isMobile]);

  return {
    columnState,
    toggleColumn,
    setMobileView
  };
}
