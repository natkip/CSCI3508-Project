import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import PetsPage from "@/pages/pets-page";
import PetDetailPage from "@/pages/pet-detail-page";
import AccountPage from "@/pages/account-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";
import { MainLayout } from "./components/layouts/main-layout";
import { AuthProvider } from "./hooks/use-auth";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Use this component to provide a loading state
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
    <span>Loading application...</span>
  </div>
);

// Main Router component wrapped with AuthProvider
function AppRouter() {
  return (
    <Switch>
      <Route path="/">
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Route>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route path="/pets">
        <MainLayout>
          <PetsPage />
        </MainLayout>
      </Route>
      <Route path="/pets/:id">
        {(params) => (
          <MainLayout>
            <PetDetailPage id={parseInt(params.id)} />
          </MainLayout>
        )}
      </Route>
      <ProtectedRoute path="/account">
        <MainLayout>
          <AccountPage />
        </MainLayout>
      </ProtectedRoute>
      <ProtectedRoute path="/admin">
        <MainLayout>
          <AdminPage />
        </MainLayout>
      </ProtectedRoute>
      <Route>
        <MainLayout>
          <NotFound />
        </MainLayout>
      </Route>
    </Switch>
  );
}

// Main App component with auth provider
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Suspense>
  );
}

export default App;
