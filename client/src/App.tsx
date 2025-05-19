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
    
    // Load audio files with event handlers
    const audioFiles = [backgroundMusic, hitSound, successSound];
    
    // Count loaded audio files
    let loadedCount = 0;
    
    const handleAudioLoad = () => {
      loadedCount++;
      if (loadedCount === audioFiles.length) {
        // All audio files are loaded
        console.log("All audio files loaded");
        
        // Set up our audio elements in the store
        import('./lib/stores/useAudio').then(({ useAudio }) => {
          useAudio.getState().setBackgroundMusic(backgroundMusic);
          useAudio.getState().setHitSound(hitSound);
          useAudio.getState().setSuccessSound(successSound);
          
          // Finish loading
          setLoading(false);
        });
      }
    };
    
    // Handle audio loading errors
    const handleAudioError = (e: ErrorEvent) => {
      console.error("Audio loading error:", e);
      // Continue loading even if audio fails
      handleAudioLoad();
    };
    
    // Set up event listeners for each audio file
    audioFiles.forEach(audio => {
      audio.addEventListener('canplaythrough', handleAudioLoad);
      audio.addEventListener('error', handleAudioError as EventListener);
      // Force load the audio
      audio.load();
    });
    
    // If audio takes too long to load, continue anyway
    const timeout = setTimeout(() => {
      if (loadedCount < audioFiles.length) {
        console.log("Audio loading timeout, continuing anyway");
        
        import('./lib/stores/useAudio').then(({ useAudio }) => {
          useAudio.getState().setBackgroundMusic(backgroundMusic);
          useAudio.getState().setHitSound(hitSound);
          useAudio.getState().setSuccessSound(successSound);
          
          // Finish loading
          setLoading(false);
        });
      }
    }, 3000);
    
    return () => {
      // Clean up event listeners and timeout
      audioFiles.forEach(audio => {
        audio.removeEventListener('canplaythrough', handleAudioLoad);
        audio.removeEventListener('error', handleAudioError as EventListener);
      });
      clearTimeout(timeout);
    };
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
