import { Navbar } from "../ui/navbar";
import { Footer } from "../ui/footer";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
