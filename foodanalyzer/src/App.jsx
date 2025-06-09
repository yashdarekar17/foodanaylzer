import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

import Layoutfood from "./Layoutfood";
import Addfood from "./Addfood";
import About from "./About";
import Contact from "./Contact";
import ImageUploader from "./Imageuploader";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
