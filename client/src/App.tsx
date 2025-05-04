import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";
import { BibleProvider } from "./contexts/BibleContext";
import { ThemeProvider } from "./components/ThemeProvider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BibleProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </BibleProvider>
    </ThemeProvider>
  );
}

export default App;
