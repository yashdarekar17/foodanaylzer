import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const GOALS = [
  { value: 'weight_loss',      label: 'Weight Loss' },
  { value: 'weight_gain',      label: 'Weight Gain' },
  { value: 'muscle_building',  label: 'Muscle Building' },
  { value: 'maintenance',      label: 'Maintenance (No specific goal)' },
];

const CONDITIONS = [
  { value: 'diabetes',             label: 'Diabetes' },
  { value: 'high_bp',              label: 'High Blood Pressure' },
  { value: 'lactose_intolerance',  label: 'Lactose Intolerance' },
  { value: 'cholesterol',          label: 'High Cholesterol' },
];

function Profile() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [goal, setGoal] = useState('maintenance');
  const [conditions, setConditions] = useState([]);
  const [healthSaving, setHealthSaving] = useState(false);
  const [healthSaved, setHealthSaved] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/foods/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setEditedUser(response.data);
        setGoal(response.data.goal || 'maintenance');
        setConditions(response.data.conditions || []);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleSave = () => {
    setUser({ ...editedUser });
    setIsEditing(false);
  };

  const saveHealthProfile = async () => {
    setHealthSaving(true);
    try {
      await axios.patch(`/foods/profile/onboarding/${userId}`, { 
        age: editedUser.age,
        gender: editedUser.gender || 'male',
        weight: editedUser.weight,
        heightInput: editedUser.heightInput || editedUser.height,
        activity: editedUser.activity || 'moderate',
        goal,
        conditions 
      });
      setUser({ ...user, ...editedUser, goal, conditions });
      setIsEditingHealth(false);
      setHealthSaved(true);
    } catch (err) {
      console.error('Health profile save error:', err);
      alert('Failed to save health profile. Please try again.');
    } finally {
      setHealthSaving(false);
    }
  };


  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleCancelHealth = () => {
    setEditedUser({ ...user });
    setIsEditingHealth(false);
  };

  const StatCard = ({ title, value, icon, colorClass }) => (
    <div className={`bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-6`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass}`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-heading font-black">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen text-on-surface flex flex-col font-body">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-8 max-w-[95vw] mx-auto w-full">
        {/* Profile Header */}
        <div className="relative bg-surface-container-lowest rounded-[3rem] p-8 md:p-12 mb-12 overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center gap-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-fixed/30 rounded-full blur-[100px] -z-10"></div>

          {/* Avatar Base */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary text-on-primary flex items-center justify-center text-5xl font-heading font-bold shadow-xl border-4 border-surface overflow-hidden">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <button className="absolute bottom-2 right-2 w-10 h-10 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
              <span className="material-symbols-outlined text-lg">photo_camera</span>
            </button>
          </div>

          <div className="flex-grow text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4 max-w-sm">
                <input
                  type="text"
                  value={editedUser.name || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline/30 rounded-xl px-4 py-3 font-heading font-bold text-2xl"
                />
                <input
                  type="email"
                  value={editedUser.email || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline/30 rounded-xl px-4 py-3"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-4xl md:text-5xl font-heading font-black mb-2">{user.name || "User"}</h1>
                <p className="text-on-surface-variant flex items-center justify-center md:justify-start gap-2 font-medium">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  {user.email || "No email provided"}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0 mt-6 md:mt-0">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="px-6 py-3 rounded-xl border border-outline hover:bg-surface-container transition-colors font-bold">Cancel</button>
                <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-colors font-bold shadow-md">Save Changes</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-xl border border-outline hover:bg-surface-container transition-colors font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">edit</span> Edit
                </button>
                <button onClick={handleLogout} className="px-6 py-3 rounded-xl bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors font-bold shadow-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">logout</span> Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Foods Analyzed"
            value={user?.foods?.length || 0}
            icon="query_stats"
            colorClass="bg-secondary-container/50 text-on-secondary-container"
          />
          <StatCard
            title="Active Streaks"
            value="3 Days"
            icon="local_fire_department"
            colorClass="bg-error-container/50 text-error"
          />
          <StatCard
            title="Health Score"
            value="85/100"
            icon="health_and_safety"
            colorClass="bg-primary-fixed/50 text-primary"
          />
        </div>

        {/* Tabs Content */}
        <div className="bg-surface-container-lowest rounded-[3rem] p-8 md:p-12 shadow-sm border border-outline-variant/30 min-h-[400px]">
          <div className="flex gap-8 border-b border-surface-container-high mb-8 overflow-x-auto hide-scrollbar">
            {['overview', 'health', 'activity', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 capitalize font-heading font-bold text-lg whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                {tab === 'health' ? 'Health Profile' : tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-heading font-bold mb-6">Account Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-surface-container p-6 rounded-2xl">
                        <p className="text-sm font-bold text-on-surface-variant mb-1">Full Name</p>
                        <p className="text-lg font-medium">{user.name || "Not provided"}</p>
                      </div>
                      <div className="bg-surface-container p-6 rounded-2xl">
                        <p className="text-sm font-bold text-on-surface-variant mb-1">Email Address</p>
                        <p className="text-lg font-medium">{user.email || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'health' && (
                <div className="space-y-8 max-w-lg">
                  {/* Basic Health Stats */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-heading font-bold mb-2">Health Profile</h3>
                      <p className="text-on-surface-variant">Personalized food risk metrics.</p>
                    </div>
                    {!isEditingHealth && (
                      <button onClick={() => { setEditedUser({...user}); setIsEditingHealth(true); }} className="px-5 py-2 rounded-xl border border-outline hover:bg-surface-container transition-colors font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Age</label>
                      {isEditingHealth ? (
                        <input
                          type="number"
                          value={editedUser.age || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, age: e.target.value })}
                          className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3"
                        />
                      ) : (
                        <p className="text-lg font-bold px-4 py-3 bg-surface-container/30 rounded-xl">{user.age || "--"}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Weight (kg)</label>
                      {isEditingHealth ? (
                        <input
                          type="number"
                          value={editedUser.weight || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, weight: e.target.value })}
                          className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3"
                        />
                      ) : (
                        <p className="text-lg font-bold px-4 py-3 bg-surface-container/30 rounded-xl">{user.weight || "--"} kg</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Height (e.g. 5'11" or 175cm)</label>
                    {isEditingHealth ? (
                      <input
                        type="text"
                        value={editedUser.heightInput !== undefined ? editedUser.heightInput : (user.height || "")}
                        onChange={(e) => setEditedUser({ ...editedUser, heightInput: e.target.value })}
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3"
                      />
                    ) : (
                      <p className="text-lg font-bold px-4 py-3 bg-surface-container/30 rounded-xl">{user.heightInput || user.height || "--"}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Activity Level</label>
                    {isEditingHealth ? (
                      <select
                        value={editedUser.activity || "moderate"}
                        onChange={(e) => setEditedUser({ ...editedUser, activity: e.target.value })}
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3"
                      >
                        <option value="sedentary">Sedentary (Little/no exercise)</option>
                        <option value="light">Light (1-3 days/week)</option>
                        <option value="moderate">Moderate (3-5 days/week)</option>
                        <option value="active">Active (6-7 days/week)</option>
                        <option value="very_active">Very Active (Daily intense)</option>
                      </select>
                    ) : (
                      <p className="text-lg font-bold px-4 py-3 bg-surface-container/30 rounded-xl capitalize">{user.activity || "Moderate"}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">Fitness Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => { setGoal(e.target.value); setHealthSaved(false); }}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">Health Conditions</label>
                    <input
                      type="text"
                      value={conditions[0] || ''}
                      onChange={(e) => { setConditions(e.target.value ? [e.target.value] : []); setHealthSaved(false); }}
                      placeholder="e.g. diabetes, high blood pressure, thyroid…"
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface font-medium placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>

                  {isEditingHealth && (
                    <div className="flex gap-4">
                      <button onClick={handleCancelHealth} className="px-6 py-4 border border-outline rounded-2xl font-bold text-base hover:bg-surface-container transition-all">Cancel</button>
                      <button onClick={saveHealthProfile} disabled={healthSaving} className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-60 shadow-md shadow-primary/20 flex-grow">
                        {healthSaving ? 'Saving…' : 'Save Health Profile'}
                      </button>
                    </div>
                  )}
                  
                  {!isEditingHealth && healthSaved && (
                    <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-4 py-2 rounded-xl w-fit">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span> Health Profile Updated
                    </div>
                  )}
                </div>
              )}


              {activeTab === 'activity' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-heading font-bold mb-6">Recent Activity</h3>
                  {user.foods && user.foods.length > 0 ? (
                    <div className="space-y-4">
                      {user.foods.slice(0, 5).map((food, index) => (
                        <div key={index} className="flex items-center justify-between p-6 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                              <span className="material-symbols-outlined">tapas</span>
                            </div>
                            <div>
                              <p className="font-bold">Analyzed Food Item</p>
                              <p className="text-sm text-on-surface-variant">Viewed nutritional breakdown</p>
                            </div>
                          </div>
                          <button className="text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full">View</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-on-surface-variant">
                      <span className="material-symbols-outlined text-6xl mb-4 opacity-50">hourglass_empty</span>
                      <p className="text-lg font-medium">No recent activity yet.</p>
                      <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full font-bold">Start Scanning</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-heading font-bold mb-6">Email Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 cursor-pointer p-4 bg-surface-container rounded-xl">
                        <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" defaultChecked />
                        <span className="font-medium">Analysis completion notifications</span>
                      </label>
                      <label className="flex items-center gap-4 cursor-pointer p-4 bg-surface-container rounded-xl">
                        <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
                        <span className="font-medium">Weekly food reports sent to {user.email}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-heading font-bold mb-6">Privacy</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 cursor-pointer p-4 bg-surface-container rounded-xl">
                        <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary" defaultChecked />
                        <span className="font-medium">Make profile analytics visible to community</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;