import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile_edit.css';
import { ProfileContext } from '../../Helper/ProfileContext.jsx';
import { useCountryCodes } from '../../Helper/useCountryCodes';
import { useSearchableCountryCodeInput } from '../../Helper/useSearchableCountryCodeInput';
import { AuthContext } from '../../auth/AuthContext';
import userlogo from '../../assets/user.png';

const ProfileEdit = () => {
  const { profile, setProfile } = useContext(ProfileContext);
  const { user, dispatch } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  if (!user || !user._id) {
    return <div className="body-container"><div className="edit-container"><p>Please log in to edit your profile.</p></div></div>;
  }

  // Function to parse the full mobile number into country code and mobile number
  const parseMobileNumber = (fullNumber) => {
    if (!fullNumber) return { code: '+91', number: '' };

    // Regex to extract country code (e.g., +1, +91) and the rest of the number
    // It handles cases like "+91 (India) 123456789" or "+91 123456789"
    const match = fullNumber.match(/^(\+\d+)(?:\s*\(.*\))?\s*(.*)$/);
    if (match) {
      // match[1] is the country code (e.g., "+91")
      // match[2] is the rest of the number (e.g., "123456789")
      return { code: match[1], number: match[2].replace(/[^\d]/g, '') }; // Clean digits from number part
    } else {
      // If no country code found, assume default and fullNumber is the mobile number
      return { code: '+91', number: fullNumber.replace(/[^\d]/g, '') }; // Clean digits from full number
    }
  };

  const { code: initialCountryCode, number: initialMobileNumber } = parseMobileNumber(profile.mobileNumber);
  // console.log('profile.mobileNumber from context:', profile.mobileNumber);
  // console.log('Parsed initialCountryCode:', initialCountryCode);
  // console.log('Parsed initialMobileNumber:', initialMobileNumber);

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [mobileNumber, setMobileNumber] = useState(initialMobileNumber);
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture || null);
  const [showMobileInput, setShowMobileInput] = useState(!!profile.mobileNumber);

  const { countryCodes, loading, error } = useCountryCodes();
  const { 
    countryCode, 
    searchTerm, 
    showDropdown, 
    filteredCountryCodes, 
    dropdownRef, 
    handleInputChange, 
    handleInputFocus, 
    handleOptionClick,
    handleInputBlur,
    setCountryCode
  } = useSearchableCountryCodeInput(initialCountryCode, countryCodes);

  const navigate = useNavigate();

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const userId = user._id; 
    if (!userId) {
      alert('User ID not found. Please log in again to upload profile picture.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/upload-profile-picture/${userId}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        alert(data.message);
        setProfilePicture(data.data.profilePicture); // Update local state with Cloudinary URL
        // Also update AuthContext and ProfileContext with the new picture URL
        dispatch({ type: 'login', payload: { ...user, profilePicture: data.data.profilePicture } });
        setProfile(prevProfile => ({ 
          ...prevProfile, 
          profilePicture: data.data.profilePicture 
        }));
      } else {
        alert(`Error uploading picture: ${data.message}`);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddMobileNumber = () => {
    setShowMobileInput(true);
  };

  const handleRemoveMobileNumber = () => {
    setShowMobileInput(false);
    setMobileNumber('');
  };

  useEffect(() => {
    if (!loading && countryCodes.length > 0) {
      if (initialCountryCode && countryCodes.some(c => c.code === initialCountryCode)) {
        setCountryCode(initialCountryCode);
      } else if (countryCodes.length > 0) {
        setCountryCode(countryCodes[0].code);
      }
    }
  }, [loading, countryCodes, initialCountryCode, setCountryCode]);

  const refreshProfilePictureUrl = async () => {
    try {
      const userId = user._id;
      if (!userId) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/refresh-profile-picture/${userId}`);
      const data = await response.json();

      if (data.status === "SUCCESS") {
        setProfilePicture(data.data.profilePicture);
        dispatch({ type: 'login', payload: { ...user, profilePicture: data.data.profilePicture } });
        setProfile(prevProfile => ({ 
          ...prevProfile, 
          profilePicture: data.data.profilePicture 
        }));
      }
    } catch (error) {
      console.error('Error refreshing profile picture URL:', error);
    }
  };

  // Add useEffect to check and refresh URL when component mounts
  useEffect(() => {
    if (profilePicture) {
      refreshProfilePictureUrl();
    }
  }, []);

  const handleRemoveProfilePicture = async () => {
    const userId = user._id;
    if (!userId) {
      alert('User ID not found. Please log in again to remove profile picture.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/remove-profile-picture/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        alert(data.message);
        setProfilePicture(null);
        dispatch({ type: 'login', payload: { ...user, profilePicture: null } });
        setProfile(prevProfile => ({ 
          ...prevProfile, 
          profilePicture: null 
        }));
      } else {
        alert(`Error removing picture: ${data.message}`);
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Failed to remove profile picture. Please try again.');
    }
  };

  const saveProfile = async () => {
    const cleanMobileNumber = mobileNumber.replace(/[^\d]/g, ''); 
    const fullMobileNumber = showMobileInput ? `${countryCode} ${cleanMobileNumber}` : '';

    const updatedData = {
      fullName,
      email,
      mobileNumber: fullMobileNumber,
    };

    try {
      const userId = user._id; // Access _id directly from user object

      if (!userId) {
        alert('User ID not found. Please log in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        alert(data.message);
        // Update ProfileContext with data from backend and existing profilePicture state
        setProfile({
          fullName: data.data.name, // Backend uses 'name', frontend uses 'fullName'
          email: data.data.email,
          mobileNumber: data.data.mobileNumber,
          profilePicture: profilePicture // Keep the current profilePicture state which is now the Cloudinary URL
        });

        // Update AuthContext as well if email or name changed (critical for login consistency)
        dispatch({ type: 'login', payload: data.data }); // payload is already the user object

        navigate('/Profile');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div className="body-container"><div className="edit-container"><p>Loading country codes...</p></div></div>;
  }

  if (error) {
    return <div className="body-container"><div className="edit-container"><p>{error}</p></div></div>;
  }

  return (
    <div className="body-container">
      <div className="edit-container">
        <div className="edit-header">
          <h2 className="edit-h2">Profile</h2>
        </div>
        <form className="profile-form">
          <div className="profile-picture-section">
            <div 
              className="profile-picture-container" 
              onClick={handleProfilePictureClick}
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="profile-picture-preview" />
              ) : (
                <div className="add-profile-picture">
                  <span>+ Add Profile Pic</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            {profilePicture && (
              <button 
                type="button" 
                className="remove-profile-picture-btn"
                onClick={handleRemoveProfilePicture}
              >
                Remove Profile Picture
              </button>
            )}
          </div>
          <label className="edit-label" htmlFor="full-name">Full Name</label>
          <input
            className="edit-input"
            type="text"
            id="full-name"
            name="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label className="edit-label" htmlFor="email">
            Email
            <span className="email-note">(Email cannot be changed)</span>
          </label>
          <input
            className="edit-input locked-input"
            type="email"
            id="email"
            name="email"
            value={email}
            readOnly
          />
          {showMobileInput ? (
            <>
              <label className="edit-label" htmlFor="mobile-number">Mobile Number</label>
              <div className="mobile-input-group" ref={dropdownRef}>
                <div className="country-code-wrapper">
                  <input
                    type="text"
                    className="country-code-input"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="+Code"
                  />
                  {showDropdown && filteredCountryCodes.length > 0 && (
                    <ul className="country-code-dropdown-list">
                      {filteredCountryCodes.map((country) => (
                        <li key={country.code} onClick={() => handleOptionClick(country.code)}>
                          {country.code} ({country.name})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <input
                  className="edit-input mobile-input"
                  type="text"
                  id="mobile-number"
                  name="mobile-number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
              <button 
                type="button" 
                className="remove-mobile-btn"
                onClick={handleRemoveMobileNumber}
              >
                Remove Mobile Number
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className="add-mobile-btn"
              onClick={handleAddMobileNumber}
            >
              + Add Mobile Number
            </button>
          )}
        </form>
        <button className="save-edit" type="button" onClick={saveProfile}>Save</button>
      </div>
    </div>
  );
};

export default ProfileEdit;