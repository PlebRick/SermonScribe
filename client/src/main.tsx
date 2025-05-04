import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { initializeBibleContent } from "./lib/bibleContentLoader";

// Initialize Bible content for global access
initializeBibleContent();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
