import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { clearItems } from "../../Store/Foodslice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://foodanaylzer-1.onrender.com/foods/login", {
        email,
        Password,
      });
      const { user, token } = response.data;
      localStorage.setItem("userId", user.id);
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      dispatch(clearItems());
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex font-body text-on-surface">
      {/* Left Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-container">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW_6AzEZ7eCJGAVs8gp2dxonJagtuhfK-rzKgezbbGiZAierS9SdmH-lLioVIJTpZovkUUq6dOx-NrWTO3r1996jMnGs4-zVTVNxT-EvZmYk3u9IrZyWa96ISdwjYMtViFIUmdUnkbXmPwZmHL7rvsg39G-yVqhuYzml0pU81BHIjtYnUONx4ded4wwD13eGWR7c5QlvI8rWlZ5lzRt6cHKCF7uFdRcmvz5ZjGAXsUhtL3L19nalDNB7nfyTetjwJ6Ez9q1nowYMnR"
          alt="Healthy Food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 w-fit">
            <span className="material-symbols-outlined text-sm text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <span className="text-xs font-bold tracking-widest uppercase text-white">NutriScan</span>
          </div>
          <h2 className="text-5xl font-heading font-bold text-white mb-4 leading-tight">Your gateway to<br />healthier choices.</h2>
          <p className="text-white/80 text-lg max-w-md">Access your tailored dashboard and start tracking your food's nutritional insights instantly.</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link to="/" className="absolute top-8 right-8 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-bold text-sm bg-surface-container-low px-4 py-2 rounded-full">
          <span className="material-symbols-outlined text-lg">close</span> Cancel
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-heading font-extrabold text-on-surface mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-on-surface-variant mb-10 text-lg">Log in to your NutriScan account.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                required
                onChange={(e) => setemail(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-on-surface" htmlFor="password">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                id="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold text-lg py-4 rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Log into Account <span className="material-symbols-outlined text-base">login</span></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-on-surface-variant">
            Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
