import { ReactNode } from "react";
import { AuthProvider as UseAuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <UseAuthProvider>
          {children}
        </UseAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
