import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchForm() {
  const [type, setType] = useState("Dog");
  const [breed, setBreed] = useState("");
  const [zip, setZip] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?type=${type}&breed=${breed}&zip=${zip}`);
  };

  return (
    <form className="search-hero" onSubmit={handleSearch}>
      <h1>Find your new best friend</h1>
      <div className="search-filters">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Dog</option>
          <option>Cat</option>
          <option>Rabbit</option>
        </select>

        <input
          type="text"
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />

        <input
          type="text"
          placeholder="ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />

        <button type="submit">Search</button>
      </div>
    </form>
  );
}
