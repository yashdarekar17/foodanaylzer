import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import Layoutfood from "./Layoutfood";
import About from "./About";
import Contact from "./Contact";
import ImageUploader from "./Imageuploader";
import Login from "./loginsignup/Login";
import Signup from "./loginsignup/Signin"
import Profile from "./Profile";
import Chatbot from "./Chatbox";
import Insights from "./Insights";
import Onboarding from "./Onboarding";

function App() {
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const checkProfile = async () => {
      if (userId) {
        try {
          const token = localStorage.getItem("token");
          await axios.get(`/foods/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (err) {
          console.error("Profile check error:", err);
        }
      }
    };
    checkProfile();
  }, [userId]);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Layoutfood />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/image" element={<ImageUploader />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/bot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
