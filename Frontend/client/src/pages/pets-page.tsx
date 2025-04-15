import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pet, FilterPetsData } from "@shared/schema";
import { PetCard } from "@/components/pet-card";
import { PetFilter } from "@/components/pet-filter";
import { PetDetailModal } from "@/components/pet-detail-modal";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

export default function PetsPage() {
  const [filters, setFilters] = useState<FilterPetsData>({});
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 8;

  // Construct query params from filters
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.species) queryParams.append("species", filters.species);
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.age) filters.age.forEach(age => queryParams.append("age", age));
  if (filters.size) filters.size.forEach(size => queryParams.append("size", size));
  if (filters.gender) filters.gender.forEach(gender => queryParams.append("gender", gender));
  if (filters.goodWith) filters.goodWith.forEach(goodWith => queryParams.append("goodWith", goodWith));

  const { data: pets, isLoading } = useQuery<Pet[]>({
    queryKey: [`/api/pets?${queryParams.toString()}`],
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterPetsData) => {
    setFilters(newFilters);
  };

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
    setModalOpen(true);
  };

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets ? pets.slice(indexOfFirstPet, indexOfLastPet) : [];
  const totalPages = pets ? Math.ceil(pets.length / petsPerPage) : 0;

  // Logic for page numbers
  const pageNumbers = [];
  const pageWindow = 2; // Display 2 pages before and after current page

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // First page
      i === totalPages || // Last page
      (i >= currentPage - pageWindow && i <= currentPage + pageWindow) // Pages around current
    ) {
      pageNumbers.push(i);
    } else if (
      i === currentPage - pageWindow - 1 || 
      i === currentPage + pageWindow + 1
    ) {
      // Add ellipsis
      pageNumbers.push(-1);
    }
  }

  // Remove duplicates
  const uniquePageNumbers = pageNumbers.filter((num, idx, arr) => 
    num === -1 ? arr.indexOf(num) === idx : true
  );

  return (
    <div id="pets" className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find Your Perfect Pet
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Browse through our adoptable pets and find your new companion today.
          </p>
        </div>

        {/* Filter Section */}
        <div className="mt-8">
          <PetFilter onFilter={handleFilterChange} isLoading={isLoading} />
        </div>

        {/* Pet Listings */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Loading pets...</span>
            </div>
          ) : pets && pets.length > 0 ? (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentPets.map((pet) => (
                  <div key={pet.id} onClick={() => handlePetClick(pet)}>
                    <PetCard pet={pet} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {uniquePageNumbers.map((number, idx) => (
                        number === -1 ? (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={number}>
                            <PaginationLink
                              isActive={currentPage === number}
                              onClick={() => setCurrentPage(number)}
                              className="cursor-pointer"
                            >
                              {number}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No pets found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or search term to find more pets.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pet Detail Modal */}
      <PetDetailModal 
        pet={selectedPet} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}
