import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function Signup() {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/foods/signup', {
        name,
        email,
        Password,
      });
      console.log("Signup Success:", response.data);
      navigate('/Login');
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex font-body text-on-surface">
      {/* Left Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary-container">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGbzDkVobzIH0F1QW0_tEB_LF6b-rFVUhfTRu7RkH0zhgtpPyIma4mdcUSf5GRCeFBa86MBXXclSZgnEzFw85rnMEw8U-exRiJuolRB1V35mEJYi3_kN655wvlgLJu5he7nPw8pGNi3hm8UldiHrPZMWxG-x36mdeRmsobJRdk8IhM2vv6vcon7gYf6eqGeaDR0aOLjP6XcSKlnPYCNXFov438mkukTJB0I8Vs6udOD92by7UJEa6QTWNi9JG7vx0De7LEfAwdXINa"
          alt="Fresh Salmon and Veggies"
          className="w-full h-full object-cover transform -scale-x-100"
        />
        <div className="absolute inset-0 bg-secondary/30 mix-blend-multiply backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 w-fit">
            <span className="material-symbols-outlined text-sm text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
            <span className="text-xs font-bold tracking-widest uppercase text-white">Join the Community</span>
          </div>
          <h2 className="text-5xl font-heading font-bold text-white mb-4 leading-tight">Empower your<br />nutrition journey.</h2>
          <p className="text-white/80 text-lg max-w-md">Create an account to save foods, interact with NutriBot AI, and reach your goals faster.</p>
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
          <h1 className="text-4xl font-heading font-extrabold text-on-surface mb-2 tracking-tight">Create Account</h1>
          <p className="text-on-surface-variant mb-10 text-lg">Join NutriScan to get started.</p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                required
                onChange={(e) => setname(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
                placeholder="John Doe"
              />
            </div>

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
              <label className="text-sm font-bold text-on-surface" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
                placeholder="Create a strong password"
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
                <>Create Account <span className="material-symbols-outlined text-base">person_add</span></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-on-surface-variant">
            Already have an account? <Link to="/Login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
