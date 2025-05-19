import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ToastProvider } from "./components/ui/toast";
import MatchingGame from "./MatchingGame";
import "@fontsource/inter";

function App() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MatchingGame />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
