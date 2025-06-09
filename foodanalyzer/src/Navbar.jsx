import { Link } from "react-router-dom";
function Navbar() {
    return (
      <nav className="navbar">
        <div className="container3 nav-container">
          <div className="logo">NutriScan</div>
          <ul className="nav-links">
            <Link to={"/"}>Home</Link>
            <Link to={"/About"}> About</Link>
            <Link to={"/Contact"}>Contact</Link>
            <Link to={"/addfood"}>Add the food</Link>  
          </ul>
        </div>
      </nav>
    );
  }
  
  export default Navbar;
  
