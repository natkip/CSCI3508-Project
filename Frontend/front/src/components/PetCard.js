import React from "react";
import "../App.css"; // Make sure styles apply

export default function PetCard({ pet }) {
  return (
    <div className="pet-card">
      <img src={pet.image} alt={pet.name} />
      <div className="pet-card-content">
        <h2>{pet.name}</h2>
        <p>{pet.breed}</p>
        <p>{pet.location}</p>
        <button>Adopt me</button>
      </div>
    </div>
  );
}
