import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { BibleProvider } from "./contexts/BibleContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <BibleProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </BibleProvider>
  );
}

export default App;
