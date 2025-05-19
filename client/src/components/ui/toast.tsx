import { ReactNode, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const showToast = (message: string, duration = 3000) => {
    setToast({ message, visible: true });
    
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {createPortal(
        toast.visible && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-background shadow-lg rounded-lg px-6 py-3 text-foreground animate-in fade-in slide-in-from-bottom-5">
            {toast.message}
          </div>
        ),
        document.body
      )}
    </ToastContext.Provider>
  );
}
