import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PetCard } from "@/components/pet-card";
import { useQuery } from "@tanstack/react-query";
import { Pet } from "@shared/schema";
import { Search, User, Home } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.error("Error using auth in HomePage:", error);
  }
  
  const { data: featuredPets } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });

  const displayPets = featuredPets ? featuredPets.slice(0, 4) : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Find your perfect</span>{" "}
                  <span className="block text-primary xl:inline">fur-ever friend</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Browse through hundreds of adoptable pets from shelters and rescues. Your new best friend is just a click away.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/pets">
                      <Button 
                        size="lg" 
                        className="w-full flex items-center justify-center"
                      >
                        Find a pet
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="#how-it-works">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full flex items-center justify-center bg-indigo-100 text-primary hover:bg-indigo-200 border-none"
                      >
                        How it works
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
            alt="Happy dog and owner"
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Adoption Process
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How PawFinder Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Finding your new pet companion is easy with PawFinder's simple adoption process.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    1. Browse & Search
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Browse through our database of adoptable pets. Use filters to find pets that match your lifestyle.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    2. Create an Account
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Sign up for a free account to save your favorite pets and submit adoption applications.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Home className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    3. Meet & Adopt
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Contact shelters to arrange meet-and-greets with your potential new pet and finalize the adoption.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Featured Pets Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Featured Pets
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Meet some of our adorable pets looking for their forever homes.
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {displayPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/pets">
              <Button size="lg">View All Pets</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to find your new companion?</span>
            <span className="block text-indigo-100">Start browsing available pets today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/pets">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Find a Pet
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href={user ? "/account" : "/auth"}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  {user ? "My Account" : "Sign Up"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
