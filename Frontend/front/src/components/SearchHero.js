import React from "react";
import "../App.css";

export default function SearchHero() {
  return (
    <div className="search-hero">
      <h1>Find your new best friend</h1>
      <div className="search-filters">
        <select>
          <option>Dog</option>
          <option>Cat</option>
          <option>Rabbit</option>
        </select>

        <select>
          <option>Any breed</option>
        </select>

        <input type="text" placeholder="ZIP or postal code" />

        <button>Search</button>
      </div>
    </div>
  );
}
