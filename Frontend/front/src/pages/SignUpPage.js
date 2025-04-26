import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ ...formData, preferences: {} }));
    navigate("/profile");
  };

  return (
    <div className="page-center">
      <AuthForm type="signup" formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
    </div>
  );
}
