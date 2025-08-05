import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { clearItems } from "../../Store/Foodslice";
import { useDispatch } from "react-redux";
import axios from "axios";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [Password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7000/foods/login", {
        email,
        Password,
      });
      const {user,token}= response.data;

      console.log("Login Success:", response.data);
      localStorage.setItem("userId",user.id);
      localStorage.setItem("token",token)
      localStorage.setItem("isLoggedIn", "true");
      dispatch(clearItems());
      navigate("/"); // or your desired route
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Welcome Back</h1>
      <form onSubmit={handleLogin} className="signup-form">
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
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="signup-button">Login</button>,
        <p className="signup-Link">Don't have an Account?<Link to="/signup">Signup</Link></p>
      </form>
    </div>
  );
}

export default Login;
