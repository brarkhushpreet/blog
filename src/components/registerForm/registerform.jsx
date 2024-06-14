"use client";
import React, { useState } from "react";
import axios from "axios"; // Import axios
import styles from "./registerForm.module.css";
import Link from "next/link";

const initialState = {
  username: "",
  email: "",
  ConfirmPassword:"",
  password:"",
};

const RegisterForm = () => {
  const [error,setError]= useState(null);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData
      );
       setError(response?.data)
       console.log(error);
      
       
    } catch (error) {
      console.error("Error while logging in:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="username"
        name="username"
        onChange={handleChange}
      />
       <input
        type="email"
        placeholder="email"
        name="email"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="password"
        name="password"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Confirm password"
        name="Confirmpassword"
        onChange={handleChange}
      />
     {error?.error}
      <button>Register</button>

      <Link href="/login">
        {"Already have an acount?"} <b>Login</b>
      </Link>
    </form>
  );
};

export default RegisterForm;
