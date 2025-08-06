import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

import Layoutfood from "./Layoutfood";
import Addfood from "./Addfood";
import About from "./About";
import Contact from "./Contact";
import ImageUploader from "./Imageuploader";
import Login from "./loginsignup/Login";
import Signup from "./loginsignup/Signin"
import StoreFood from "./Storeitems";
import Profile from "./Profile";
import Chatbot from "./Chatbox";


function App() {
  const [data, setdata] = useState();

 
  return (
    <BrowserRouter  basename="/">
      <Routes>
        <Route path="/" element={<Layoutfood />} />
        <Route path="/addfood" element={<Addfood />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/image" element={<ImageUploader />} />
        <Route path="/Login" element={<Login/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/storefood" element={<StoreFood/>} />
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/bot" element={<Chatbot/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
