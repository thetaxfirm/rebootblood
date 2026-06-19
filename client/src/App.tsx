import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Eboo from "./pages/Eboo";
import Plasmapheresis from "./pages/Plasmapheresis";
import Eligibility from "./pages/Eligibility";
import Admin from "./pages/Admin";
import Learn from "./pages/Learn";
import Partners from "./pages/Partners";
import Calculator from "./pages/Calculator";
import { Privacy, Terms } from "./pages/Legal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/eboo" component={Eboo} />
      <Route path="/plasmapheresis" component={Plasmapheresis} />
      <Route path="/eligibility" component={Eligibility} />
      <Route path="/learn" component={Learn} />
      <Route path="/learn/:slug" component={Learn} />
      <Route path="/partners" component={Partners} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/admin" component={Admin} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
