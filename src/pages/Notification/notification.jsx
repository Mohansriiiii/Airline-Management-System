import React from 'react';
import { useNavigate } from 'react-router-dom';
import './notification.css';

const NotificationsPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/Profile');
  };

  return (
    <div className="notification-container">
      <button className="back-button-notif" onClick={handleBackClick}>Back</button>
      <h1>Notifications</h1>
      <div className="notifications-content">
        <p>No available data</p>
      </div>
    </div>
  );
};

export default NotificationsPage;
