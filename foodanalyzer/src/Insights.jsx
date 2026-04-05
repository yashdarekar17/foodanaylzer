import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

const MacroCard = ({ label, value, unit, icon, colorClass, barColor, total = 100 }) => (
    <div className="bg-surface-container-lowest rounded-[2.5rem] p-6 shadow-bloom border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
            <div className="text-right text-xs font-black uppercase tracking-widest text-on-surface-variant/60">
                {label}
            </div>
        </div>
        <div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-heading font-black">{Math.round(value)}</span>
                <span className="text-sm font-bold text-on-surface-variant/70">{unit}</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full mt-3 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((value / total) * 100, 100)}%` }}
                    className={`h-full rounded-full ${barColor}`}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    </div>
);

// Component removed in favor of direct date selection header

function Insights() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
    
    // Meal Parsing States
    const [mealInput, setMealInput] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [mealPreview, setMealPreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // UI State
    const [expandedMealId, setExpandedMealId] = useState(null);
    
    const userId = localStorage.getItem("userId");

    const fetchInsights = async (date) => {
        try {
            const url = date ? `/foods/insights/${userId}?date=${date}` : `/foods/insights/${userId}`;
            const response = await axios.get(url);
            setStats(response.data);
            setError(false);
        } catch (err) {
            console.error("Fetch insights error:", err);
            setError(true);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`/foods/insights/history/${userId}?weekOffset=${weekOffset}`);
            setHistory(response.data);
        } catch (err) {
            console.error("Fetch history error:", err);
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            if (userId) {
                setLoading(true);
                await fetchInsights(selectedDate);
                setLoading(false);
            }
        };
        loadAll();
    }, [userId, selectedDate]);

    const handleParseMeal = async (e) => {
        e.preventDefault();
        if (!mealInput.trim()) return;
        
        setIsParsing(true);
        try {
            const res = await axios.post('/foods/meals/parse', { text: mealInput, userId });
            setMealPreview(res.data);
        } catch (err) {
            alert("Could not parse meal. Please try again.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleSaveMeal = async () => {
        if (!mealPreview) return;
        
        setIsSaving(true);
        try {
            await axios.post('/foods/meals/save', { 
                userId, 
                mealData: {
                    originalText: mealPreview.originalText,
                    items: mealPreview.items,
                    totals: mealPreview.totals
                }
            });
            setMealPreview(null);
            setMealInput("");
            fetchInsights(); // Refresh dashboard
        } catch (err) {
            alert("Error saving meal.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    if (error || !stats) return (
        <div className="min-h-screen bg-surface">
            <Navbar />
            <div className="pt-40 flex flex-col items-center justify-center text-center px-6">
                <span className="material-symbols-outlined text-6xl text-error/30 mb-4">clinical_notes</span>
                <h2 className="text-3xl font-heading font-black mb-2">Something went wrong</h2>
                <p className="text-on-surface-variant mb-6">Make sure your profile is complete to view insights.</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold">Try again</button>
            </div>
        </div>
    );

    const percent = Math.min((stats.consumed / stats.dailyGoal) * 100, 100);

    return (
        <div className="bg-surface min-h-screen text-on-surface font-body overflow-x-hidden">
            <Navbar />
            
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-black text-[10px] uppercase tracking-widest w-fit mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {selectedDate ? `Historical View: ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Daily Goal Analysis'}
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl md:text-6xl font-heading font-black">
                                {selectedDate ? "Past Insights" : "Your Insights"}
                            </h1>
                            {selectedDate && (
                                <button 
                                    onClick={() => setSelectedDate(null)}
                                    className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[16px]">today</span>
                                    Back to Today
                                </button>
                            )}
                        </div>
                    </div>
                    <div 
                        className="relative group flex items-center gap-4 text-on-surface-variant font-bold text-sm bg-surface-container-highest/20 px-6 py-3 rounded-2xl border border-outline-variant/10 hover:bg-surface-container-highest/40 transition-all cursor-pointer"
                        onClick={() => document.getElementById('dashboard-date-picker')?.showPicker()}
                    >
                        <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                        <span className="text-on-surface">
                            {selectedDate 
                                ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                                : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                            }
                        </span>
                        
                        {/* Hidden native date picker */}
                        <input 
                            id="dashboard-date-picker"
                            type="date" 
                            className="absolute opacity-0 inset-0 pointer-events-none"
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Progress Card */}
                    <div className="lg:col-span-12 xl:col-span-12">
                         <div className="bg-primary text-on-primary rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group">
                            
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-on-primary/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-on-primary/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl pointer-events-none" />

                            <div className="relative text-center md:text-left flex-grow space-y-4">
                                <h3 className="text-on-primary/70 font-black uppercase tracking-[0.2em] text-xs">Today's Calorie Pace</h3>
                                <div className="text-7xl md:text-9xl font-heading font-black">
                                    {Math.round(stats.consumed)}
                                    <span className="text-xl md:text-3xl font-bold opacity-50 tracking-normal ml-3">
                                        / {stats.dailyGoal} kcal
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md w-fit">
                                    <span className="material-symbols-outlined text-yellow-300 text-[20px]">bolt</span>
                                    <span className="font-bold text-sm md:text-base">
                                        {stats.remaining > 0 ? `${stats.remaining} kcal remaining` : `${Math.abs(stats.remaining)} kcal over goal`}
                                    </span>
                                </div>
                            </div>

                            {/* Circle Progress */}
                            <div className="flex-shrink-0 relative w-56 h-56 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-on-primary/20" />
                                    <motion.circle 
                                        cx="112" cy="112" r="100" 
                                        stroke="currentColor" strokeWidth="18" fill="transparent" 
                                        strokeDasharray={2 * Math.PI * 100}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                                        animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - percent / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        className="text-on-primary"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-4xl font-heading font-black">{Math.round(percent)}%</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Complete</p>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* Quick Add Meal Section */}
                    <div className="lg:col-span-12">
                        <div className="bg-surface-container-lowest rounded-[3rem] p-8 border border-outline-variant/30 shadow-bloom relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">magic_button</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-heading font-black">AI Quick Add Meal</h3>
                                        <p className="text-xs text-on-surface-variant font-bold">Type what you ate in natural language</p>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {!mealPreview ? (
                                        <motion.form 
                                            key="input"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onSubmit={handleParseMeal} 
                                            className="flex flex-col md:flex-row gap-4"
                                        >
                                            <input 
                                                type="text" 
                                                value={mealInput}
                                                onChange={(e) => setMealInput(e.target.value)}
                                                placeholder='e.g. "I had 2 rotis with paneer sabzi and milk"'
                                                className="flex-grow bg-surface-container rounded-2xl px-6 py-4 border border-transparent focus:border-primary/30 focus:outline-none placeholder:text-on-surface-variant/40 font-bold"
                                            />
                                            <button 
                                                disabled={isParsing || !mealInput.trim()}
                                                className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                                            >
                                                {isParsing ? (
                                                    <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                                                ) : (
                                                    <>Analyze <span className="material-symbols-outlined text-[18px]">bolt</span></>
                                                )}
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.div 
                                            key="preview"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-primary/5 rounded-3xl p-6 border border-primary/20"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                                <div>
                                                    <h4 className="text-2xl font-heading font-black mb-1">Total: {mealPreview.totals.calories} kcal</h4>
                                                    <p className="text-xs font-bold text-primary/70 uppercase tracking-widest">Nutritional Preview</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => setMealPreview(null)} className="px-6 py-3 rounded-xl border border-outline-variant font-bold text-sm hover:bg-surface transition-colors flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                                                    </button>
                                                    <button 
                                                        onClick={handleSaveMeal} 
                                                        disabled={isSaving}
                                                        className="px-8 py-3 rounded-xl bg-primary text-on-primary font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-primary/10"
                                                    >
                                                        {isSaving ? "Saving..." : <>Confirm & Save <span className="material-symbols-outlined text-[18px]">check_circle</span></>}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {mealPreview.items.map((item, idx) => (
                                                    <div key={idx} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[16px]">restaurant</span>
                                                        </div>
                                                        <div className="flex-grow">
                                                            <p className="text-sm font-bold capitalize">{item.foodName} <span className="text-on-surface-variant italic font-normal text-xs">x{item.quantity}</span></p>
                                                            <p className="text-[10px] text-on-surface-variant font-black">{item.calories} kcal</p>
                                                        </div>
                                                        {item.estimated && (
                                                            <div className="material-symbols-outlined text-primary text-[16px]" title="AI Estimated">auto_awesome</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Macros & Status */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Status Message / AI Coach */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-secondary-container/40 rounded-[3rem] p-10 border border-secondary-container flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                        >
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                                <span className="material-symbols-outlined text-on-primary text-4xl">psychology</span>
                            </div>
                            <div className="text-center md:text-left relative z-10">
                                <h4 className="font-black uppercase tracking-widest text-[10px] text-primary mb-2 italic">NutriScan Health Coach Insight</h4>
                                <p className="text-2xl font-heading font-black text-on-secondary-container leading-tight">
                                    “{stats.aiInsight}”
                                </p>
                            </div>
                        </motion.div>

                        {/* Macro Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MacroCard 
                                label="Protein" 
                                value={stats.nutritionSummary.protein} 
                                unit="g" 
                                icon="egg_alt" 
                                colorClass="bg-error-container text-error" 
                                barColor="bg-error"
                                total={150}
                            />
                            <MacroCard 
                                label="Fats" 
                                value={stats.nutritionSummary.fat} 
                                unit="g" 
                                icon="spa" 
                                colorClass="bg-tertiary-container text-tertiary" 
                                barColor="bg-tertiary"
                                total={80}
                            />
                            <MacroCard 
                                label="Carbs" 
                                value={stats.nutritionSummary.carbs} 
                                unit="g" 
                                icon="grain" 
                                colorClass="bg-primary-fixed/50 text-primary" 
                                barColor="bg-primary"
                                total={250}
                        />
                    </div>

                </div>

                    {/* Right Column: Recent Foods */}
                    <div className="lg:col-span-4 h-full">
                        <div className="bg-surface-container-lowest rounded-[3rem] p-8 md:p-10 border border-outline-variant/30 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-heading font-black">Today's Logs</h3>
                                <div className="text-xs font-black text-on-surface-variant/40 uppercase tracking-tighter">Live Activity</div>
                            </div>
                            
                            <div className="space-y-4 flex-grow">
                                {stats.recentFoods && stats.recentFoods.length > 0 ? (
                                    stats.recentFoods.map((entry, idx) => {
                                        const isMeal = entry.type === 'meal';
                                        const isExpanded = expandedMealId === entry.id;

                                        return (
                                            <motion.div 
                                                key={entry.id || idx}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`rounded-2xl border transition-all ${isExpanded ? 'bg-surface border-primary/20 shadow-lg' : 'bg-surface-container-high/40 border-transparent hover:bg-surface-container-high'}`}
                                            >
                                                <div 
                                                    className="flex items-center gap-4 p-4 cursor-pointer group"
                                                    onClick={() => isMeal && setExpandedMealId(isExpanded ? null : entry.id)}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isMeal ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                                        <span className="material-symbols-outlined text-[18px]">{isMeal ? 'fastfood' : 'restaurant'}</span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-sm capitalize">{entry.name}</p>
                                                        <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60">
                                                            {entry.calories} kcal • {isMeal ? `${entry.items.length} items` : 'Single Entry'}
                                                        </p>
                                                    </div>
                                                    {isMeal && (
                                                        <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'text-outline'}`}>
                                                            expand_more
                                                        </span>
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {isMeal && isExpanded && (
                                                        <motion.div 
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden bg-primary/5 px-4 pb-4 rounded-b-2xl space-y-2"
                                                        >
                                                            {entry.items.map((sub, sIdx) => (
                                                                <div key={sIdx} className="flex justify-between items-center text-xs p-2 bg-white/40 rounded-xl">
                                                                    <span className="font-bold capitalize">{sub.foodName} <span className="opacity-50">x{sub.quantity}</span></span>
                                                                    <span className="font-black text-[10px] uppercase tracking-tighter">{sub.calories} kcal</span>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-20 opacity-30 italic">
                                        <span className="material-symbols-outlined text-5xl mb-4">receipt_long</span>
                                        <p>No food logged yet today.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Insights;
