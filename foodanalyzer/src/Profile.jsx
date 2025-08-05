import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./App.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:7000/foods/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setEditedUser(response.data);
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
    // Here you would typically make an API call to update user data
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const StatCard = ({ title, value }) => (
    <div className="profile-stats-card">
      <div className="profile-stats-content">
        <div className="profile-stats-text">
          <h4>{title}</h4>
          <p className="profile-stats-value">{value}</p>
        </div>
        <div className="profile-stats-icon-container">
          <svg className="profile-stats-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      
      {/* Modern Profile Section */}
      <div className="profile-page-container">
        <div className="profile-main-container">
          {/* Profile Header */}
          <div className="profile-header-card">
            <div className="profile-header-gradient"></div>
            <div className="profile-header-content">
              <div className="profile-header-flex">
                {/* Profile Avatar */}
                <div className="profile-avatar-container">
                  <div className="profile-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <button className="profile-camera-btn">
                    <svg className="profile-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                
                {/* Profile Info */}
                <div className="profile-info-section">
                  {isEditing ? (
                    <div className="profile-edit-inputs">
                      <input
                        type="text"
                        value={editedUser.name || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        className="profile-name-input"
                        placeholder="Enter your name"
                      />
                      <input
                        type="email"
                        value={editedUser.email || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="profile-email-input"
                        placeholder="Enter your email"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="profile-name-display">{user.name || "User"}</h1>
                      <p className="profile-email-display">
                        <svg className="profile-email-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user.email || "No email provided"}
                      </p>
                    </div>
                  )}
                </div>
                 
                {/* Action Buttons */}
                <div className="profile-actions">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="profile-btn profile-btn-green"
                      >
                        <svg className="profile-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="profile-btn profile-btn-gray"
                      >
                        <svg className="profile-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="profile-btn profile-btn-green"
                    >
                      <svg className="profile-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit Profile</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="profile-btn profile-btn-red"
                  >
                    <svg className="profile-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card - Only Foods Added */}
          <div className="profile-stats-container">
            <StatCard
              title="Foods Added"
              value={user?.foods?.length || 0}
            />
          </div>

          {/* Tabs */}
          <div className="profile-tabs-card">
            <div className="profile-tabs-nav">
              {['overview', 'activity', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`profile-tab-btn ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="profile-tabs-content">
              {activeTab === 'overview' && (
                <div className="profile-overview-section">
                  <h3 className="profile-overview-title">Account Overview</h3>
                  <div className="profile-overview-grid">
                    <div className="profile-overview-column">
                      <div className="profile-info-row">
                        <span className="profile-info-label">Full Name</span>
                        <span className="profile-info-value">{user.name || "Not provided"}</span>
                      </div>
                      <div className="profile-info-row">
                        <span className="profile-info-label">Email Address</span>
                        <span className="profile-info-value">{user.email || "Not provided"}</span>
                      </div>
                    </div>
                    <div className="profile-overview-column">
                      <div className="profile-info-row">
                        <span className="profile-info-label">Foods Added</span>
                        <span className="profile-info-value highlight">{user.foods?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div>
                  <h3 className="profile-overview-title">Recent Activity</h3>
                  {user.foods && user.foods.length > 0 ? (
                    <div className="profile-activity-list">
                      {user.foods.slice(0, 5).map((food, index) => (
                        <div key={index} className="profile-activity-item">
                          <div className="profile-activity-icon-container">
                            <svg className="profile-activity-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                          </div>
                          <div className="profile-activity-content">
                            <p className="profile-activity-title">Added food item</p>
                            <p className="profile-activity-time">Food analysis completed</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="profile-no-activity">
                      <svg className="profile-no-activity-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                      <p>No food items added yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="profile-overview-title">Account Settings</h3>
                  <div className="profile-settings-section">
                    <label className="profile-settings-label">
                      Email Notifications
                    </label>
                    <div className="profile-checkbox-group">
                      <label className="profile-checkbox-item">
                        <input type="checkbox" className="profile-checkbox" defaultChecked />
                        <span className="profile-checkbox-label">Analysis completion notifications</span>
                      </label>
                      <label className="profile-checkbox-item">
                        <input type="checkbox" className="profile-checkbox" />
                        <span className="profile-checkbox-label">Weekly food reports</span>
                      </label>
                    </div>
                  </div>
                  <div className="profile-settings-section">
                    <label className="profile-settings-label">
                      Privacy Settings
                    </label>
                    <div className="profile-checkbox-group">
                      <label className="profile-checkbox-item">
                        <input type="checkbox" className="profile-checkbox" defaultChecked />
                        <span className="profile-checkbox-label">Make profile public</span>
                      </label>
                      <label className="profile-checkbox-item">
                        <input type="checkbox" className="profile-checkbox" defaultChecked />
                        <span className="profile-checkbox-label">Share analysis data for research</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default Profile;