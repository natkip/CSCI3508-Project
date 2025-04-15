import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { ReactNode } from "react";

export function ProtectedRoute({
  path,
  children,
  adminOnly = false,
}: {
  path: string;
  children: ReactNode;
  adminOnly?: boolean;
}) {
  return (
    <Route path={path}>
      {() => {
        try {
          const { user, isLoading, isAdmin } = useAuth();
          
          if (isLoading) {
            return (
              <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            );
          }

          if (!user) {
            return <Redirect to="/auth" />;
          }

          if (adminOnly && !isAdmin) {
            return <Redirect to="/" />;
          }

          return children;
        } catch (error) {
          console.error("Auth error in ProtectedRoute:", error);
          return <Redirect to="/auth" />;
        }
      }}
    </Route>
  );
}
