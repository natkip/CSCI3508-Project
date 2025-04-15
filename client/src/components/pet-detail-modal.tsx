import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pet } from "@shared/schema";
import { 
  Check, 
  Heart, 
  HelpCircle, 
  MapPin, 
  X 
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface PetDetailModalProps {
  pet: Pet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PetDetailModal({ pet, open, onOpenChange }: PetDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();

  if (!pet) return null;

  // Simulating multiple images using the same image (in a real app, you'd use actual multiple images)
  const petImages = [
    pet.imageUrl || `https://placehold.co/800x600?text=${pet.name}`,
    `https://placehold.co/800x600?text=${pet.name}-2`,
    `https://placehold.co/800x600?text=${pet.name}-3`,
    `https://placehold.co/800x600?text=${pet.name}-4`,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {pet.name} - {pet.breed || pet.species}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={petImages[selectedImage]} 
                className="w-full h-80 object-cover" 
                alt={`${pet.name} - ${pet.breed || pet.species}`} 
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {petImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  className={`h-20 w-full object-cover rounded cursor-pointer ${selectedImage === index ? 'ring-2 ring-primary' : ''}`} 
                  alt={`Photo of ${pet.name}`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
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
            
            <h4 className="font-medium text-gray-900">About</h4>
            <p className="mt-2 text-gray-600">
              {pet.description || `Meet ${pet.name}, a lovely ${pet.age || ''} ${pet.breed || pet.species} looking for a forever home. Contact us to learn more about this wonderful pet!`}
            </p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                <ul className="text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <span className="w-24 text-gray-500">Species:</span>
                    <span className="capitalize">{pet.species}</span>
                  </li>
                  {pet.breed && (
                    <li className="flex items-center">
                      <span className="w-24 text-gray-500">Breed:</span>
                      <span>{pet.breed}</span>
                    </li>
                  )}
                  {pet.age && (
                    <li className="flex items-center">
                      <span className="w-24 text-gray-500">Age:</span>
                      <span className="capitalize">{pet.age}</span>
                    </li>
                  )}
                  {pet.gender && (
                    <li className="flex items-center">
                      <span className="w-24 text-gray-500">Gender:</span>
                      <span className="capitalize">{pet.gender}</span>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Good with</h4>
                <ul className="text-gray-600 space-y-1">
                  <li className="flex items-center">
                    {pet.goodWithKids ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : pet.goodWithKids === false ? (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    ) : (
                      <HelpCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    )}
                    <span>Kids</span>
                  </li>
                  <li className="flex items-center">
                    {pet.goodWithDogs ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : pet.goodWithDogs === false ? (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    ) : (
                      <HelpCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    )}
                    <span>Dogs</span>
                  </li>
                  <li className="flex items-center">
                    {pet.goodWithCats ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : pet.goodWithCats === false ? (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    ) : (
                      <HelpCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    )}
                    <span>Cats</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {pet.location && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <p className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 text-primary mr-2" />
                  {pet.location}
                </p>
              </div>
            )}
          </div>
        </div>
        <Separator className="my-4" />
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {!user ? (
            <div className="w-full space-y-2">
              <p className="text-sm text-gray-500">Sign in to adopt or save this pet</p>
              <Link href="/auth" className="w-full">
                <Button className="w-full" onClick={() => onOpenChange(false)}>
                  Sign in to Adopt
                </Button>
              </Link>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <Button className="flex-1">
                Adopt Me
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-primary text-primary hover:bg-primary/10"
              >
                <Heart className="mr-2 h-4 w-4" />
                Save to Favorites
              </Button>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
