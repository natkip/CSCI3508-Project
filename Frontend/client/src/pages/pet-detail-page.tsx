import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pet } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  Check, 
  Heart, 
  HelpCircle, 
  Loader2, 
  MapPin, 
  ArrowLeft, 
  X
} from "lucide-react";

interface PetDetailPageProps {
  id: number;
}

export default function PetDetailPage({ id }: PetDetailPageProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  
  const { data: pet, isLoading, error } = useQuery<Pet>({
    queryKey: [`/api/pets/${id}`],
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching pet:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-500">Loading pet details...</span>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pet Not Found</h2>
              <p className="text-gray-500 mb-6">
                The pet you're looking for doesn't exist or has been adopted.
              </p>
              <Button onClick={() => setLocation("/pets")}>
                Back to Pet Listings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Simulating multiple images using the same image (in a real app, you'd use actual multiple images)
  const petImages = [
    pet.imageUrl || `https://placehold.co/800x600?text=${pet.name}`,
    `https://placehold.co/800x600?text=${pet.name}-2`,
    `https://placehold.co/800x600?text=${pet.name}-3`,
    `https://placehold.co/800x600?text=${pet.name}-4`,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center px-0 hover:bg-transparent hover:text-primary"
          onClick={() => setLocation("/pets")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all pets
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={petImages[activeImage]} 
              className="w-full h-[400px] object-cover" 
              alt={`${pet.name} - ${pet.breed || pet.species}`} 
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {petImages.map((image, index) => (
              <img 
                key={index}
                src={image} 
                className={`h-20 w-full object-cover rounded cursor-pointer transition ${activeImage === index ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100'}`} 
                alt={`Photo of ${pet.name}`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Right column - Details */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
            <Badge className="bg-primary text-white capitalize">
              {pet.species}
            </Badge>
            {pet.adoptionStatus && (
              <Badge variant={pet.adoptionStatus === "available" ? "success" : "outline"} className="capitalize">
                {pet.adoptionStatus}
              </Badge>
            )}
          </div>

          {pet.breed && (
            <p className="text-lg text-gray-600 mb-4">
              {pet.breed}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {pet.age && (
              <Badge variant="secondary" className="bg-indigo-100 text-primary">
                {pet.age}
              </Badge>
            )}
            {pet.gender && (
              <Badge variant="outline" className="bg-gray-100 text-gray-600">
                {pet.gender}
              </Badge>
            )}
            {pet.size && (
              <Badge variant="outline" className="bg-gray-100 text-gray-600">
                {pet.size}
              </Badge>
            )}
            {pet.characteristics && pet.characteristics.map((trait, i) => (
              <Badge key={i} variant="outline" className="bg-gray-100 text-gray-600">
                {trait}
              </Badge>
            ))}
          </div>

          {pet.location && (
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              {pet.location}
            </div>
          )}

          <Tabs defaultValue="about" className="mb-6">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="pt-4">
              <p className="text-gray-600">
                {pet.description || `Meet ${pet.name}, a lovely ${pet.age || ''} ${pet.breed || pet.species} looking for a forever home.`}
              </p>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-32 text-gray-500">Species:</span>
                  <span className="capitalize">{pet.species}</span>
                </li>
                {pet.breed && (
                  <li className="flex items-center">
                    <span className="w-32 text-gray-500">Breed:</span>
                    <span>{pet.breed}</span>
                  </li>
                )}
                {pet.age && (
                  <li className="flex items-center">
                    <span className="w-32 text-gray-500">Age:</span>
                    <span className="capitalize">{pet.age}</span>
                  </li>
                )}
                {pet.gender && (
                  <li className="flex items-center">
                    <span className="w-32 text-gray-500">Gender:</span>
                    <span className="capitalize">{pet.gender}</span>
                  </li>
                )}
                {pet.size && (
                  <li className="flex items-center">
                    <span className="w-32 text-gray-500">Size:</span>
                    <span className="capitalize">{pet.size}</span>
                  </li>
                )}
                <li className="flex items-center">
                  <span className="w-32 text-gray-500">Status:</span>
                  <span className="capitalize">{pet.adoptionStatus || "available"}</span>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="compatibility" className="pt-4">
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-center">
                  {pet.goodWithKids ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : pet.goodWithKids === false ? (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  )}
                  <span>Good with kids</span>
                </li>
                <li className="flex items-center">
                  {pet.goodWithDogs ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : pet.goodWithDogs === false ? (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  )}
                  <span>Good with dogs</span>
                </li>
                <li className="flex items-center">
                  {pet.goodWithCats ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : pet.goodWithCats === false ? (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  )}
                  <span>Good with cats</span>
                </li>
              </ul>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex flex-col sm:flex-row gap-4">
            {!user ? (
              <>
                <p className="text-sm text-gray-500 mb-2">Sign in to adopt or save this pet</p>
                <Link href="/auth" className="w-full">
                  <Button className="w-full">
                    Sign in to Adopt
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button className="flex-1">
                  Start Adoption Process
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary text-primary hover:bg-primary/10"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Save to Favorites
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Similar pets section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Pets You Might Like</h2>
        {/* This would fetch similar pets in a real implementation */}
        <div className="text-center py-8">
          <p className="text-gray-500">
            More similar pets will be available soon!
          </p>
        </div>
      </div>
    </div>
  );
}
