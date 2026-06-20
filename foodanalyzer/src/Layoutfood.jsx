import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import SearchBar from './Searchbar';
import FoodDetails from './FoodDetails';
import Navbar from './Navbar';
import Footer from './Footer';

function Layoutfood() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const diseaseFightingFoods = [
    {
      title: "Fatty Fish",
      icon: "biotech",
      iconBg: "bg-secondary-container/50",
      iconColor: "text-on-secondary-container",
      borderClass: "",
      description: "Rich in Omega-3s, fatty fish like salmon and sardines help reduce inflammation and lower the risk of heart disease and arthritis.",
      bullets: ["Heart Health", "Anti-Inflammatory"],
    },
    {
      title: "Leafy Greens",
      icon: "medication",
      iconBg: "bg-primary-fixed/50",
      iconColor: "text-primary",
      borderClass: "border-t-4 border-primary",
      description: "Kale, spinach, and collard greens are dense with Vitamin K and folates that protect against cognitive decline and bone loss.",
      bullets: ["Brain Function", "Bone Strength"],
    },
    {
      title: "Nuts & Seeds",
      icon: "nutrition",
      iconBg: "bg-tertiary-fixed/50",
      iconColor: "text-on-tertiary-fixed-variant",
      borderClass: "",
      description: "Walnuts and flaxseeds contain alpha-linolenic acid, which supports metabolic health and can help in cancer prevention.",
      bullets: ["Metabolic Support", "Cell Protection"],
    },
    {
      title: "Berries",
      icon: "stars",
      iconBg: "bg-error-container/50",
      iconColor: "text-error",
      borderClass: "",
      description: "Packed with powerful antioxidants and anthocyanins, berries protect your cells from free radical damage and boost immunity.",
      bullets: ["Immunity Boost", "Antioxidants"],
    },
    {
      title: "Garlic",
      icon: "spa",
      iconBg: "bg-secondary-fixed/50",
      iconColor: "text-on-secondary-fixed",
      borderClass: "border-t-4 border-secondary",
      description: "Contains allicin, a compound known for its strong medicinal properties, helping lower blood pressure and combat sickness.",
      bullets: ["Blood Pressure", "Combats Sickness"],
    },
    {
      title: "Turmeric",
      icon: "blur_on",
      iconBg: "bg-[rgba(255,219,201,0.5)]",
      iconColor: "text-tertiary",
      borderClass: "",
      description: "Its active compound curcumin is a potent anti-inflammatory and antioxidant that improves brain function and lowers heart disease risk.",
      bullets: ["Anti-inflammatory", "Brain Function"],
    }
  ];

  const handleSearch = async (term) => {
    if (!term.trim()) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/Login');
      return;
    }

    setSearchTerm(term);
    setLoading(true);
    setError(null);
    setFoodData(null);

    try {
      const rawBase = import.meta.env.VITE_API_URL || "";
      const apiBase = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;
      const response = await fetch(`${apiBase}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodText: term, userId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Food not found');
      }

      setFoodData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          {foodData ? (
            <motion.section
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col px-4 max-w-[95vw] mx-auto w-full min-h-[calc(100vh-250px)] pb-12"
            >
              <div className="flex-none pt-8 pb-4">
                <button
                  onClick={() => { setFoodData(null); setSearchTerm(''); }}
                  className="flex items-center gap-2 text-primary font-bold hover:-translate-x-1 transition-transform bg-surface-container shadow-sm px-5 py-2 rounded-full w-fit border border-surface-container-high text-sm"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back to Search
                </button>
              </div>
              <div className="flex-grow pb-8">
                <FoodDetails food={foodData} />
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hero Section */}
              <section className="relative pt-32 pb-20 px-8 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/40 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary-fixed/30 rounded-full blur-[80px] -z-10"></div>

                <div className="max-w-[95vw] mx-auto flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container/50 rounded-full mb-8">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    <span className="text-xs font-bold tracking-widest uppercase text-on-secondary-container">Healthier Choices Start Here</span>
                  </div>

                  <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-8 leading-[1.1]">
                    Food Nutrition <span className="text-primary italic">Analyzer</span>
                  </h1>

                  <SearchBar onSearch={handleSearch} />

                  {loading && (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-error-container text-on-error-container p-4 rounded-xl max-w-lg mx-auto mt-8 font-medium">
                      {error}
                    </div>
                  )}

                  {/* Fast Shortcuts */}
                  {!loading && (
                    <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
                      <span className="text-on-surface-variant font-medium text-sm">Popular:</span>
                      <button onClick={() => handleSearch("Apple")} className="px-4 py-1.5 bg-surface-container-low rounded-full text-xs font-bold hover:bg-primary-fixed hover:-translate-y-0.5 transition-all">Apple</button>
                      <button onClick={() => handleSearch("Chicken Breast")} className="px-4 py-1.5 bg-surface-container-low rounded-full text-xs font-bold hover:bg-primary-fixed hover:-translate-y-0.5 transition-all">Chicken</button>
                      <button onClick={() => handleSearch("Broccoli")} className="px-4 py-1.5 bg-surface-container-low rounded-full text-xs font-bold hover:bg-primary-fixed hover:-translate-y-0.5 transition-all">Broccoli</button>
                      <button onClick={() => handleSearch("Salmon")} className="px-4 py-1.5 bg-surface-container-low rounded-full text-xs font-bold hover:bg-primary-fixed hover:-translate-y-0.5 transition-all">Salmon</button>
                    </div>
                  )}
                </div>
              </section>

              {/* Popular Foods Section */}
              <section className="py-20 px-8 bg-surface-container-low">
                <div className="max-w-[95vw] mx-auto">
                  <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
                    <div className="space-y-2">
                      <h2 className="font-heading text-4xl font-bold text-on-surface">Instant Insights</h2>
                      <p className="text-on-surface-variant text-lg max-w-md">Discover the nutritional breakdown of common staples in seconds.</p>
                    </div>
                    <button className="flex items-center gap-2 font-bold text-primary group">
                      View All Foods
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform border-[1px] border-transparent" >arrow_forward</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Apple Card */}
                    <div onClick={() => handleSearch("Apple")} className="cursor-pointer group bg-surface-container rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-surface-container-high">
                      <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_j7vRht5yCF2v3_W43e7LzFYr2PwynotRYnjLKBZY1w4dZ54Qixf6tlzuBYZYMIOcuYXL1XF5KlLV7_kOqwk3djDyHW1yj7Czdo3J4j61Ox9-nlpWMt-JXZEbtaxUAq3_8hzTnpsQasb97rJHUUOVWel2wOWJE2eKG4UognkVlD4chcgis44VX9MKDv_FG6uXT-tdcIv-4a_i2ZCwd2QleKCCMzj9LoRyHUtz1ZoMym6V8_S91Q0QltIlHDEgABRHxZen4VJ2TH8y" alt="Apple" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold tracking-widest uppercase">Fruit</div>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Apple</h3>
                      <p className="text-on-surface-variant text-sm mb-4">Rich in fiber and Vitamin C, great for heart health.</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-md text-[10px] font-bold">52 CAL</span>
                        <span className="px-3 py-1 bg-primary-fixed/30 text-on-primary-fixed-variant rounded-md text-[10px] font-bold">LOW GI</span>
                      </div>
                    </div>

                    {/* Chicken Card */}
                    <div onClick={() => handleSearch("Chicken Breast")} className="cursor-pointer group bg-surface-container rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-surface-container-high">
                      <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW_6AzEZ7eCJGAVs8gp2dxonJagtuhfK-rzKgezbbGiZAierS9SdmH-lLioVIJTpZovkUUq6dOx-NrWTO3r1996jMnGs4-zVTVNxT-EvZmYk3u9IrZyWa96ISdwjYMtViFIUmdUnkbXmPwZmHL7rvsg39G-yVqhuYzml0pU81BHIjtYnUONx4ded4wwD13eGWR7c5QlvI8rWlZ5lzRt6cHKCF7uFdRcmvz5ZjGAXsUhtL3L19nalDNB7nfyTetjwJ6Ez9q1nowYMnR" alt="Chicken" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold tracking-widest uppercase">Protein</div>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Chicken Breast</h3>
                      <p className="text-on-surface-variant text-sm mb-4">Lean source of high-quality protein for muscle growth.</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-md text-[10px] font-bold">165 CAL</span>
                        <span className="px-3 py-1 bg-primary-fixed/30 text-on-primary-fixed-variant rounded-md text-[10px] font-bold">HIGH PRO</span>
                      </div>
                    </div>

                    {/* Broccoli Card */}
                    <div onClick={() => handleSearch("Broccoli")} className="cursor-pointer group bg-surface-container rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-surface-container-high">
                      <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrcqVkqlgjorqqOeySZtahEeT6mzr4B1vROeDTZdtngmBEfHiDqBRcCwrZ6fRVuYjuY-SdM336d5_gbsw55rcsY5rOuSiESVidxI52m__cRwETeF7WnIKrut8z6H8NlbsOZ4PM4RYCJ-glxOydoXiFfd_aVfXGUC3_0ZQNnfMd0xmWE8cAYdEyTJd-xI0WDPhJ90egehU15I5paItNpojtVtjHXdBE8IOMv2iIKAyHi7_Fwccks5_BfM7WUXAFXvtbJfJ7w83IygRO" alt="Broccoli" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold tracking-widest uppercase">Vegetable</div>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Broccoli</h3>
                      <p className="text-on-surface-variant text-sm mb-4">Packed with vitamins, minerals, and antioxidants.</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-md text-[10px] font-bold">34 CAL</span>
                        <span className="px-3 py-1 bg-primary-fixed/30 text-on-primary-fixed-variant rounded-md text-[10px] font-bold">SUPERFOOD</span>
                      </div>
                    </div>

                    {/* Salmon Card */}
                    <div onClick={() => handleSearch("Salmon")} className="cursor-pointer group bg-surface-container rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-surface-container-high">
                      <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGbzDkVobzIH0F1QW0_tEB_LF6b-rFVUhfTRu7RkH0zhgtpPyIma4mdcUSf5GRCeFBa86MBXXclSZgnEzFw85rnMEw8U-exRiJuolRB1V35mEJYi3_kN655wvlgLJu5he7nPw8pGNi3hm8UldiHrPZMWxG-x36mdeRmsobJRdk8IhM2vv6vcon7gYf6eqGeaDR0aOLjP6XcSKlnPYCNXFov438mkukTJB0I8Vs6udOD92by7UJEa6QTWNi9JG7vx0De7LEfAwdXINa" alt="Salmon" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold tracking-widest uppercase">Fish</div>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Salmon</h3>
                      <p className="text-on-surface-variant text-sm mb-4">Excellent source of omega-3 fatty acids for brain health.</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-md text-[10px] font-bold">208 CAL</span>
                        <span className="px-3 py-1 bg-primary-fixed/30 text-on-primary-fixed-variant rounded-md text-[10px] font-bold">OMEGA-3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* NutriBotAI Promo */}
              <section className="py-14 px-8" id="nutribotai-promo">
                <div className="max-w-[95vw] mx-auto">
                  <div className="relative rounded-[2rem] overflow-hidden bg-primary p-10 md:p-20 text-on-primary">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent)]"></div>
                    <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
                      <div className="space-y-8 flex flex-col items-start">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-on-primary/10 rounded-full">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen AI</span>
                        </div>
                        <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight">
                          Meet <span style={{ color: '#4ade80' }}>NutriBotAI</span>.<br />Your Personal Nutritionist.
                        </h2>
                        <p className="text-on-primary-container text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                          Take a photo of your meal and get instant nutritional scores, personalized advice, and healthier alternatives in real-time.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                          <Link to="/bot" className="px-8 py-4 bg-[#a1d494] text-[#23501e] font-bold rounded-full hover:scale-105 transition-all shadow-xl shadow-black/20">Try It For Free</Link>
                          <Link to="/About" className="px-8 py-4 border border-on-primary/20 text-on-primary font-bold rounded-full hover:bg-on-primary/10 transition-all">Learn More</Link>
                        </div>
                      </div>
                      {/* Right: rotated card with blur matching card size */}
                      <div className="relative flex items-center justify-center">
                        {/* Blur bg — same size as card, centered behind it */}
                        <div className="absolute w-full h-full bg-secondary-fixed/30 blur-[60px] rounded-2xl"></div>
                        {/* Rotated card */}
                        <div className="relative bg-surface-container-lowest/10 backdrop-blur-3xl rounded-xl border border-white/10 p-4 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                          <img className="rounded-lg shadow-2xl" alt="AI Interface Mockup" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAUefHT3tCqrJxfhmf42FSr0qam3ljAQ5FmyVE-Wu-YhTFh3Z3H6wej1qOVO-y3UXDjSmbnUwdCNXKHIRg0NJ5_FCLLixu-TnbEmJdENPv6i67Wzc7IK0AMRCWHcfDJZhkOYRxf3TVAd--DJJ8KLsC3XJAGlePlxWwOaHTHrGlVW0IaMWnDQicB_uUQSTF9jJQpIOPg9j5ZO7aezF_WrlPrpbWxJMA8rYswS6t2BBiNzswrxz9x-bYMk6nksaeKIkeMlBG0-bR8fnL" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Popular Healthy Foods Section (Editorial Grid) */}
              <section className="py-20 px-8">
                <div className="max-w-[95vw] mx-auto">
                  <div className="text-center mb-16 space-y-4">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Popular Healthy Foods</h2>
                    <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Nourish your body with these nutrient-dense options curated by our experts.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[800px]">
                    {/* Avocado (Large Feature) */}
                    <div onClick={() => handleSearch("Avocado")} className="cursor-pointer md:col-span-8 bg-surface-container-high rounded-xl overflow-hidden group relative flex flex-col justify-end p-8 min-h-[400px]">
                      <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Avocado" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDveJ31odm8JwcEEJefuSRUc1ulUbVAzUqb_rxfDsDYEUz6nFAmU4ZaYP1u-JuisrGWaDlSi9H78Xrxq6zbbBz7r_IsmNucBeF2d8jv64wsJPH8Sq7aTTQ_L4Ptg0dH7o9he87dc-_Ra11CLFhHLpQ5XA6t39Gra0Mkx1Pa0sh001PPs2P7XCbj-Y2QVaqeYxaki-LsPMBGbvvS9YGBdspzzB0bYM9sup_rPu8qdMzMLPmCbpoFXP050kZyFhWk4ne9npRj3V5jKECm" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="relative z-10 text-white">
                        <span className="px-3 py-1 bg-[#a1d494] text-[#23501e] text-[10px] font-bold tracking-widest uppercase rounded-xl mb-4 inline-block">High in Healthy Fats &amp; Fiber</span>
                        <h3 className="font-heading text-4xl font-bold mb-2">Avocado</h3>
                        <p className="text-white/80 max-w-md">Great for heart health and keeping you full longer. Contains more potassium than bananas.</p>
                      </div>
                    </div>

                    {/* Quinoa (Tall Sidebar) */}
                    <div onClick={() => handleSearch("Quinoa")} className="cursor-pointer md:col-span-4 bg-secondary-container/20 border border-secondary/10 rounded-xl overflow-hidden group flex flex-col p-8">
                      <div className="h-48 w-full mb-8 rounded-lg overflow-hidden shrink-0">
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Quinoa" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbvzhEx-ZQYXHriPIueswARgkGnlucffcin2mZK0JE9UtE8s4SXREUznrisaIb9y9gJST4G4kVLRGG5RP-lXROZC0hH_jfIqpk0f9AMP7uueY6JBTY3kjo3fZc0unfqJD8ACiBG3Ha_4nYyPf5H5JxbpHEW5pM-DQbZ3oIdncQjY4hw_f2g8C5TkXCHBUJ8fpU_r4n8NeD7z-_qiCneOiUFZJSzMFGH80YAXS9xsvmBLyH-uWitLPIRhge3Id0rIwweN8TjKSTEO3c" />
                      </div>
                      <div className="mt-auto">
                        <span className="px-3 py-1 bg-secondary text-white text-[10px] font-bold tracking-widest uppercase rounded-xl mb-4 inline-block">Complete Protein</span>
                        <h3 className="font-heading text-2xl font-bold mb-2">Quinoa</h3>
                        <p className="text-on-surface-variant text-sm">A gluten-free grain that provides all nine essential amino acids.</p>
                        <div className="mt-6 flex items-center justify-between border-t border-outline-variant/30 pt-6">
                          <span className="text-xs font-bold text-on-surface">Manganese, Iron</span>
                          <span className="text-xs font-bold text-primary">View Stats</span>
                        </div>
                      </div>
                    </div>

                    {/* Blueberries (Small Box) */}
                    <div onClick={() => handleSearch("Blueberries")} className="cursor-pointer md:col-span-4 bg-surface-container-low rounded-xl p-8 group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Blueberries" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByjYcgaQaDdekKg3rbAeqiPUFh7LrqksCkRhJq1qDc_cFYK-w0sOmLQcWtrOQiq4kzvnwTLRFOTcvlNYuW06QzixgQ-T8Wo_LNjUmCtYWlLhQLJceEwKOmtwm_zVZuYzbl2_CzWFyk7k_C60StDrJ74QxfLDiS24wwuGEG_jHxw6mucDGYllaNLjyMd7NGMQl2LDk0IEwTVibEPAqPHZUTW9hhH8tUlEnDlwmALcKLZAGfJ-IHBEpyAADi4kBCYGNuhjmAykuezKcl" />
                        </div>
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Blueberries</h3>
                      <p className="text-on-surface-variant text-sm">Antioxidant powerhouse for cognitive function.</p>
                    </div>

                    {/* Greek Yogurt (Small Box) */}
                    <div onClick={() => handleSearch("Greek Yogurt")} className="cursor-pointer md:col-span-4 bg-[rgba(255,219,201,0.2)] rounded-xl p-8 group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Greek Yogurt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwiB5uLnPNa01o1WyIihWgsZrHDS2YQNy-0LEa6tsImGh81tVqF_hoA7tMUT2LzfIVBpvk9ko2pkTTjddCFZuhaJDJMpQegTL7hmTLfNhAgc7481I8fvjaK-h9Tg_NTj4fxYoexSn3ZJWSJz2sXGjBH3IchpOquRuL8nL6dM369HrYfU2jYlX2_IATn-vY5rXOBDG48r5dh9sR6D65N1pSdcvoIuvDEtJbBY_jbtAvRR-pYI7ZF9saFWPPGW1aUMi2d1lNlXK3k4pj" />
                        </div>
                        <span className="material-symbols-outlined text-tertiary">temp_preferences_custom</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Greek Yogurt</h3>
                      <p className="text-on-surface-variant text-sm">Rich in probiotics for gut health and calcium.</p>
                    </div>

                    {/* Spinach (Small Box) */}
                    <div onClick={() => handleSearch("Spinach")} className="cursor-pointer md:col-span-4 bg-[rgba(188,240,174,0.2)] rounded-xl p-8 group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Spinach" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-ELxc2QHrK2-ZyKn_C5FqtkdYex_DodapyJDZhgyWQwpAQhLvlgt53tfecHtYSq02HRCWsZ9JS-6yGBplRNZFxNtc2s3p7d3xSA9z-5_sbAI-yM2DwT0ZXt5-92my9QupX6zolh7a0gHbKJJpqpm1UYOGmwxjmyTrW-MRBEpqC_ucSc0ZEc2tDIdxuWB5IzsDVql18MpMXc7L_6MwUBmeWJneP8_RcCo-kqdRxLNDqwnC6jHQ-Tr9iA808cw-UU_c12FEJjZdKjZV" />
                        </div>
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Spinach</h3>
                      <p className="text-on-surface-variant text-sm">Low-calorie leaf packed with Vitamin K and Iron.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Foods That Help Fight Diseases Section */}
              <section className="py-24 px-8 bg-surface-container">
                <div className="max-w-[95vw] mx-auto">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                      <h2 className="font-heading text-4xl font-bold text-on-surface mb-4">Foods That Help Fight Diseases</h2>
                      <p className="text-on-surface-variant text-lg">Harness the power of functional foods to strengthen your immune system and long-term health.</p>
                    </div>
                    <div className="flex gap-4 hidden sm:flex">
                      <button
                        onClick={() => setCarouselIndex(0)}
                        disabled={carouselIndex === 0}
                        className={`w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center transition-colors ${carouselIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-surface-container-highest cursor-pointer'}`}
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <button
                        onClick={() => setCarouselIndex(1)}
                        disabled={carouselIndex === 1}
                        className={`w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center transition-colors ${carouselIndex === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-surface-container-highest cursor-pointer'}`}
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                      {diseaseFightingFoods.slice(carouselIndex * 3, carouselIndex * 3 + 3).map((food) => (
                        <div key={food.title} className={`bg-surface-container-lowest rounded-xl p-10 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${food.borderClass}`}>
                          <div className={`w-14 h-14 ${food.iconBg} rounded-full flex items-center justify-center mb-8`}>
                            <span className={`material-symbols-outlined ${food.iconColor} text-3xl`}>{food.icon}</span>
                          </div>
                          <h3 className="font-heading text-2xl font-bold mb-4">{food.title}</h3>
                          <p className="text-on-surface-variant leading-relaxed mb-8">{food.description}</p>
                          <ul className="space-y-3">
                            {food.bullets.map((bullet, i) => (
                              <li key={i} className="flex items-center gap-3 text-sm font-bold text-on-surface">
                                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default Layoutfood;
