import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === formData.email && storedUser.password === formData.password) {
      navigate("/profile");
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="page-center">
      <AuthForm type="login" formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
    </div>
  );
}
