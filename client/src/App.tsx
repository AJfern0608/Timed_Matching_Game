import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Game from "./components/Game";
import { ToastProvider } from "./components/ui/toast";
import "@fontsource/inter";

function App() {
  const [loading, setLoading] = useState(true);

  // Preload sounds and ensure everything is ready
  useEffect(() => {
    // Create audio elements
    const backgroundMusic = new Audio('/sounds/background.mp3');
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    // Configure background music
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.4;
    
    // Import the audio store
    import('./lib/stores/useAudio').then(({ useAudio }) => {
      // Set up our audio elements in the store
      useAudio.getState().setBackgroundMusic(backgroundMusic);
      useAudio.getState().setHitSound(hitSound);
      useAudio.getState().setSuccessSound(successSound);
      
      // Finish loading
      setLoading(false);
    });
  }, []);

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
        <Game />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
