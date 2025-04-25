import React from "react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white">
      <div className="text-xl font-bold text-blue-600">🐾 Adopt a Pet</div>
      <div className="space-x-4 text-sm text-gray-600">
        <span>Dogs</span>
        <span>Cats</span>
        <span>Other Pets</span>
        <span>Log in</span>
        <span>Sign up</span>
      </div>
    </nav>
  );
}
