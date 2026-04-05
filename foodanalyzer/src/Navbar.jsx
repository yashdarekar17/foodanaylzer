import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import profileuser from "./foodimage/profileuser.png";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("useremail");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#f9faf6]/80 backdrop-blur-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.06)]">
      <div className="relative flex justify-between items-center px-8 py-4 max-w-[95vw] mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-[#154212] font-heading">
          <Link to="/">NutriScan</Link>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 font-heading text-sm tracking-tight">
          {[
            { path: "/", label: "Home" },
            { path: "/About", label: "About" },
            { path: "/Contact", label: "Contact" },
            { path: "/insights", label: "Insights" }
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `transition-transform duration-300 ease-out ${isActive
                  ? "text-[#154212] font-semibold border-b-2 border-[#154212] pb-1"
                  : "text-[#42493e] hover:text-[#154212] hover:scale-105"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden hover:scale-105 transition-transform">
                <img src={profileuser} className="w-full h-full object-cover" alt="Profile" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border-outline-variant/20 border p-2 flex flex-col">
                  <Link to="/profile" className="px-4 py-2 hover:bg-surface-container-low rounded-lg text-sm text-on-surface">Profile</Link>
                  <Link to="/bot" className="px-4 py-2 hover:bg-surface-container-low rounded-lg text-sm text-on-surface">Nutribot</Link>
                  <button onClick={handleLogout} className="px-4 py-2 hover:bg-surface-container-low rounded-lg text-sm text-left text-error">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/Login" className="hidden md:block px-6 py-2.5 text-sm font-semibold text-[#154212] hover:opacity-70 transition-opacity">Login</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-semibold text-sm hover:scale-105 transition-transform duration-300 active:scale-95 shadow-lg shadow-primary/10">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
