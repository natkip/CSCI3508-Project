import React from "react";
import { useLocation } from "react-router-dom";
import PetCard from "../components/PetCard";
import SearchForm from "../components/SearchForm"; // ⬅️ Import SearchForm here

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage({ pets }) {
  const query = useQuery();
  const type = query.get("type") || "";
  const breed = query.get("breed") || "";
  const zip = query.get("zip") || "";

  const filtered = pets.filter((pet) => {
    const matchType = type
      ? pet.type?.toLowerCase() === type.toLowerCase()
      : true;
    const matchBreed = breed
      ? pet.breed?.toLowerCase().includes(breed.toLowerCase())
      : true;
    const matchZip = zip
      ? pet.location?.toLowerCase().includes(zip.toLowerCase())
      : true;
    return matchType && matchBreed && matchZip;
  });

  return (
    <div>
      {/* 🧡 Add the SearchForm at the top */}
      <SearchForm />

      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Search Results</h2>

      <div className="pet-grid">
        {filtered.length > 0 ? (
          filtered.map((pet, index) => <PetCard key={index} pet={pet} />)
        ) : (
          <p style={{ textAlign: "center" }}>No pets found.</p>
        )}
      </div>
    </div>
  );
}
