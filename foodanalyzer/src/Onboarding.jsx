import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const ACTIVITY_LEVELS = [
    { value: 'sedentary',   label: 'Sedentary',       desc: 'Little or no exercise' },
    { value: 'light',       label: 'Light',           desc: 'Exercise 1-3 times/week' },
    { value: 'moderate',    label: 'Moderate',        desc: 'Exercise 3-5 times/week' },
    { value: 'active',      label: 'Active',          desc: 'Daily exercise or intense sports' },
    { value: 'very_active', label: 'Very Active',     desc: 'Intense exercise 6-7 times/week' }
];

const GOALS = [
    { value: 'weight_loss', label: 'Weight Loss',     desc: 'Lose approx 0.5kg/week' },
    { value: 'weight_gain', label: 'Weight Gain',     desc: 'Gain approx 0.5kg/week' },
    { value: 'maintenance', label: 'Maintenance',     desc: 'Stay at your current weight' }
];

function Onboarding() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        age: "",
        gender: "male",
        weight: "",
        heightInput: "",
        activity: "moderate",
        goal: "maintenance",
        conditions: []
    });

    const parseHeight = (h) => {
      if (!h) return 0;
      h = h.toString().toLowerCase().trim();

      // Case 1: 5'11", 5 11, 5ft 11 (Only match if first digit is 1-9 and it's a stand-alone digit)
      const ftInMatch = h.match(/^(\d{1})\s*(?:'|ft|feet)?\s*(\d+)?\s*(?:"|in|inches)?$/);
      if (ftInMatch) {
        const ft = parseInt(ftInMatch[1]);
        const inc = parseInt(ftInMatch[2] || 0);
        return Math.round((ft * 30.48) + (inc * 2.54));
      }

      // Case 2: 175cm, 175
      const cmMatch = h.match(/^(\d+)\s*(?:cm|centimeters)?$/);
      if (cmMatch) return parseInt(cmMatch[1]);

      return parseInt(h) || 0;
    };

    const toggleCondition = (val) => {
        setFormData(prev => ({
            ...prev,
            conditions: prev.conditions.includes(val) 
                ? prev.conditions.filter(c => c !== val) 
                : [...prev.conditions, val]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = { ...formData, height: parseHeight(formData.heightInput) };
            await axios.patch(`/foods/profile/onboarding/${userId}`, dataToSubmit);
            navigate("/"); // Back to home to start logging!
        } catch (err) {
            console.error("Onboarding error:", err);
            alert("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ label, name, type, placeholder, icon, suffix }) => (
        <div className="mb-6">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">
                {label}
            </label>
            <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">
                    {icon}
                </span>
                <input
                    type={type}
                    value={formData[name] !== undefined ? formData[name] : ""}
                    onChange={(e) => setFormData({...formData, [name]: (type === 'number' && e.target.value === '') ? '' : e.target.value})}
                    placeholder={placeholder}
                    required
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl pl-12 pr-12 py-4 text-on-surface font-medium placeholder:text-outline/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant/50">{suffix}</span>}
            </div>
        </div>
    );

    return (
        <div className="bg-surface min-h-screen text-on-surface font-body overflow-x-hidden">
            <Navbar />
            
            <main className="pt-32 pb-24 px-6 flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full"
                >
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                            <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                            Personalized Insights
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">Complete your Profile</h1>
                        <p className="text-on-surface-variant text-lg max-w-sm mx-auto">
                            We use your data to calculate accurate calorie goals for your unique body.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-[3rem] p-8 md:p-12 shadow-bloom border border-outline-variant/30">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Age" name="age" type="number" placeholder="25" icon="calendar_today" suffix="yrs" />
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">Gender</label>
                                <div className="grid grid-cols-2 gap-3 p-1 bg-surface-container rounded-2xl">
                                    {['male', 'female'].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData({...formData, gender: g})}
                                            className={`py-3 rounded-xl font-bold capitalize transition-all ${formData.gender === g ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Weight" name="weight" type="number" placeholder="70" icon="weight" suffix="kg" />
                            <InputField label="Height" name="heightInput" type="text" placeholder={`5'11"`} icon="height" suffix="ft/cm" />
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">Activity Level</label>
                            <div className="space-y-3">
                                {ACTIVITY_LEVELS.map(lvl => (
                                    <button
                                        key={lvl.value}
                                        type="button"
                                        onClick={() => setFormData({...formData, activity: lvl.value})}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${formData.activity === lvl.value ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface border-outline-variant/30 text-on-surface hover:border-primary/50'}`}
                                    >
                                        <div>
                                            <p className="font-bold">{lvl.label}</p>
                                            <p className={`text-xs ${formData.activity === lvl.value ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{lvl.desc}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.activity === lvl.value ? 'border-on-primary bg-on-primary/20' : 'border-outline-variant group-hover:border-primary'}`}>
                                            {formData.activity === lvl.value && <div className="w-3 h-3 rounded-full bg-on-primary animate-scale-in" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">Fitness Goal</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {GOALS.map(g => (
                                    <button
                                        key={g.value}
                                        type="button"
                                        onClick={() => setFormData({...formData, goal: g.value})}
                                        className={`p-4 rounded-2xl border text-center transition-all ${formData.goal === g.value ? 'bg-secondary-container text-on-secondary-container border-secondary-container shadow-md' : 'border-outline-variant/30 hover:border-primary'}`}
                                    >
                                        <p className="font-bold text-sm">{g.label}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">Health Conditions (Optional)</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'diabetes', label: 'Diabetes' },
                                    { id: 'hypertension', label: 'High BP' },
                                    { id: 'cholesterol', label: 'Cholesterol' },
                                    { id: 'acid_reflux', label: 'Acid Reflux' },
                                    { id: 'pcos', label: 'PCOS' },
                                    { id: 'thyroid', label: 'Thyroid' }
                                ].map(cond => (
                                    <button
                                        key={cond.id}
                                        type="button"
                                        onClick={() => toggleCondition(cond.id)}
                                        className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${formData.conditions.includes(cond.id) ? 'bg-error-container text-on-error-container border-error-container shadow-sm' : 'border-outline-variant/30 text-on-surface-variant hover:border-error/50'}`}
                                    >
                                        {cond.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-[2rem] bg-primary text-on-primary font-heading font-black text-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                            ) : (
                                <>
                                    Complete Setup
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}

export default Onboarding;
