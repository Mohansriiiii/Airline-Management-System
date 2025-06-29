import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bookings.css";
import { ProfileContext } from "../../Helper/ProfileContext";
// import axios from "axios";

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("none");
  const [currentBookings, setCurrentBookings] = useState([]);
  const [error, setError] =useState(null);
  const navigate = useNavigate();
  const {profile} = useContext(ProfileContext);

  const handleMouseEnter = (tab) => {
    setActiveTab(tab);
    if (tab === "current") {
      fetchCurrentBookings(profile.email);
    }
  };

  const handleMouseLeave = () => {
    setActiveTab("none");
  };

  const handleBackClick = () => {
    navigate("/Profile");
  };

  const fetchCurrentBookings = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/current-bookings?email=${email}`);
      if(!response.ok){
        throw new Error("Failed to fetch current bookings");
      }
      const data = await response.json();
      setCurrentBookings(data);
    } catch (error) {
      console.error("Error fetching current bookings:", error);
      setError("Error fetching current bookings. Please try again later.");
    }
  };

  function displayLayovers(layovers){
    return layovers === 0 ? "Non-Stop" : `${layovers} Layovers`;
  }

  return (
    <div className="current-bookings-container">
      <button className="back-button-book" onClick={handleBackClick}>
        Back
      </button>
      <div className="tabs-book">
        <div
          className={`tab-book ${activeTab === "current" ? "active" : ""}`}
          onMouseEnter={() => handleMouseEnter("current")}
          onMouseLeave={handleMouseLeave}
        >
          Current Bookings
        </div>
        <div
          className={`tab-book ${activeTab === "cancelled" ? "active" : ""}`}
          onMouseEnter={() => handleMouseEnter("cancelled")}
          onMouseLeave={handleMouseLeave}
        >
          Cancelled Bookings
        </div>
        <div
          className={`tab-book ${activeTab === "past" ? "active" : ""}`}
          onMouseEnter={() => handleMouseEnter("past")}
          onMouseLeave={handleMouseLeave}
        >
          Past Flights
        </div>
      </div>
      <div className="content-book">
        {activeTab === "current" && (
          <div className="bookings-content">
            {error && <p className="error-message">{error}</p>}
            {currentBookings.length > 0 ? (
              currentBookings.map((booking) => (
              <div key={booking._id} className="book-cont">
                <div className="col0-b">
                  <img
                    className="img"
                    src="https://images.ixigo.com/img/common-resources/airline-new/AI.png"
                    alt="flightimg"
                  /><br />
                  <div>{booking.traveller?.lastName || 'N/A'}<br />{new Date(booking.flightId?.travelDate).toLocaleDateString()}</div>
                 
                </div>
                <div className="col1-book">
                  <h4 className="air">
                    {booking.flightId?.companyName || 'N/A'}
                    <br />
                    <span className="flightnum">{booking.flightId?.flightNumber || 'N/A'}</span>
                  </h4>
                </div>
                <div className="col2-book">
                  <p className="location">
                    {booking.flightId ? new Date(booking.flightId.startTime).toLocaleTimeString() : 'N/A'}
                    <br />
                    <span className="city">{booking.flightId?.startingCity || 'N/A'}</span>
                  </p>
                </div>
                <div className="col3-book">
                  <p className="time">
                  {booking.flightId ? `${Math.floor((new Date(booking.flightId?.endTime)-new Date(booking.flightId?.startTime))/60000)} min` : 'N/A'}
                    <hr />
                    <span>{booking.flightId ? displayLayovers(booking.flightId?.layovers) : 'N/A'}</span>
                  </p>
                </div>
                <div className="col4-book">
                  <p className="location">
                    {booking.flightId ? new Date(booking.flightId.endTime).toLocaleTimeString() : 'N/A'}
                    <br />
                    <span className="city">{booking.flightId?.destinationCity || 'N/A'}</span>
                  </p>
                </div>
              </div>))
            ) : (
              <p>No available data</p>
            )}
          </div>
        )}
        {activeTab === "cancelled" && (
          <div className="bookings-content">
            <p>No available data</p>
          </div>
        )}
        {activeTab === "past" && (
          <div className="bookings-content">
            <p>No available data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
