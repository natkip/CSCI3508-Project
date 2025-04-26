import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchForm from "./components/SearchForm";
import PetCard from "./components/PetCard";
import SearchPage from "./pages/SearchPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

// Define your dummy pet data
const pets = [
  {
    name: "Bella",
    breed: "Labrador Retriever",
    location: "Denver, CO",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Labrador_on_Quantock_%282175262184%29.jpg/960px-Labrador_on_Quantock_%282175262184%29.jpg",
  },
  {
    name: "Milo",
    breed: "Orange Tabby",
    location: "Austin, TX",
    image: "https://www.rover.com/blog/wp-content/uploads/cat-breathing-fast-orange-kitten.jpg",
  },
  {
    name: "Max",
    breed: "Australian Shepherd",
    location: "Phoenix, AZ",
    image: "https://www.akc.org/wp-content/uploads/2017/11/Australian-Shepherd.1.jpg",
  },
  {
    name: "Luna",
    breed: "Red Siberian Husky",
    location: "San Diego, CA",
    image: "https://media.istockphoto.com/id/1338954116/photo/dog-portrait-outside-at-the-park-on-summer.jpg?s=612x612&w=0&k=20&c=6sRSNWMhZj4QxeTuLS2JZLzjR_os-Gbfnil6mNjga6I=",
  },
];

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchForm />
              <div className="pet-grid">
                {pets.map((pet, index) => (
                  <PetCard key={index} pet={pet} />
                ))}
              </div>
            </>
          }
        />
        <Route path="/search" element={<SearchPage pets={pets} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
