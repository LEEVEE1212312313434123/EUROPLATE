import type { ReactNode } from "react";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: "8px",
            padding: "12px",
          },
        }}
      />
    </>
  );
}
