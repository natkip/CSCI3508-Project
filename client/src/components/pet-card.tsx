import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pet } from "@shared/schema";
import { MapPin } from "lucide-react";

interface PetCardProps {
  pet: Pet;
}

// Helper function to determine badge color based on species
const getSpeciesBadgeColor = (species: string) => {
  switch (species.toLowerCase()) {
    case 'dog':
      return "bg-primary text-white";
    case 'cat':
      return "bg-pink-500 text-white";
    case 'rabbit':
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export function PetCard({ pet }: PetCardProps) {
  const {
    id,
    name,
    species,
    breed,
    age,
    gender,
    location,
    imageUrl,
    characteristics = [],
  } = pet;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img
          src={imageUrl || `https://placehold.co/400x300?text=${name}`}
          className="w-full h-[220px] object-cover"
          alt={`${name} - ${breed || species}`}
        />
        <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${getSpeciesBadgeColor(species)}`}>
          {breed || species}
        </span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          {age && (
            <Badge variant="secondary" className="bg-indigo-100 text-primary">
              {age}
            </Badge>
          )}
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {location || "Location not specified"}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {gender && (
            <Badge variant="outline" className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {gender}
            </Badge>
          )}
          {characteristics.slice(0, 2).map((trait, i) => (
            <Badge key={i} variant="outline" className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {trait}
            </Badge>
          ))}
        </div>
        <Link href={`/pets/${id}`}>
          <Button className="mt-4 w-full bg-primary hover:bg-primary/90">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
