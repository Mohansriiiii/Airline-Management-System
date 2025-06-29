import React, { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import { ProfileContext } from '../../Helper/ProfileContext';
import userlogo from '../../assets/user.png'; 

const Profile = () => {
  const { profile } = useContext(ProfileContext);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="body-profile">
      <div className="profile-container">
        <div className="profile-card">
          <div className="header-profile">
            {profile.profilePicture ? (
              <div className="profile-pic-container">
                <img src={profile.profilePicture} alt="Profile Picture" className="profile-pic" />
              </div>
            ) : null}
            <h2 className="h2-profile">Welcome, {profile.fullName}</h2>
          </div>
          <svg viewBox="0 0 1440 320" className="curve">
            <path fill="#ff7e5f" fillOpacity="1" d="M0,224C480,288,960,128,1440,192L1440,320L0,320Z"></path>
          </svg>
        </div>
        <div className="profile-option">
          <a href="#" className="profile-link" onClick={() => handleNavigation('/ProfileEdit')}>
            <span>Edit Profile</span>
          </a>
        </div>
        <div className="stats">
          <div className="stat-link" onClick={() => handleNavigation('/BookingsPage')}>
            <div className="stat">
              <p>Bookings</p>
            </div>
          </div>
          <div className="stat-link" onClick={() => handleNavigation('/PreferencesPage')}>
            <div className="stat">
              <p>Preferences</p>
            </div>
          </div>
          <div className="stat-link" onClick={() => handleNavigation('/NotificationsPage')}>
            <div className="stat">
              <p>Notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
