import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import '../App.css';

function Signup() {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://foodanaylzer.onrender.com/foods/signup', {
        name,
        email,
        Password,
      });
      console.log("Signup Success:", response.data);
      navigate('/Login');
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Create Your Account</h1>
      <form onSubmit={handleSignup} className="signup-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your full name"
            required
            onChange={(e) => setname(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setemail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create a password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="signup-button">Sign Up</button>
        <p className="signup-Link">Already have an Account?<Link to="/Login">Login</Link></p>
      </form>
    </div>
  );
}

export default Signup;
