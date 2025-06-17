import { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css"; 

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">NutriScan</div>

       
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="white">
              <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.42L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>
            </svg>
          ) : (
            
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="white">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>

       
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/About" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/Contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          <li><Link to="/addfood" onClick={() => setMenuOpen(false)}>Add the food</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

  

  
