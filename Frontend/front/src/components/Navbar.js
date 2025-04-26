import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/">🐾 Adopt a Pet</Link>
      </div>
      <div className="space-x-4 text-sm text-gray-600">
        <Link to="/search?type=Dog">Dogs</Link>
        <Link to="/search?type=Cat">Cats</Link>
        <Link to="/search?type=Rabbit">Other Pets</Link>

        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <span style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
