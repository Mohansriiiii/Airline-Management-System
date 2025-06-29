import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './preference.css';

const PreferencesPage = () => {
    const [selectedMeal, setSelectedMeal] = useState('');
    const [selectedSeat, setSelectedSeat] = useState('');
    const [selectedComm, setSelectedComm] = useState('');
    const navigate = useNavigate();

    // Load preferences from local storage when component mounts
    useEffect(() => {
        const savedMeal = localStorage.getItem('selectedMeal');
        const savedSeat = localStorage.getItem('selectedSeat');
        const savedComm = localStorage.getItem('selectedComm');

        if (savedMeal) setSelectedMeal(savedMeal);
        if (savedSeat) setSelectedSeat(savedSeat);
        if (savedComm) setSelectedComm(savedComm);
    }, []);

    // Save preferences to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('selectedMeal', selectedMeal);
    }, [selectedMeal]);

    useEffect(() => {
        localStorage.setItem('selectedSeat', selectedSeat);
    }, [selectedSeat]);

    useEffect(() => {
        localStorage.setItem('selectedComm', selectedComm);
    }, [selectedComm]);

    const handleOnClick = () => {
        alert('Saved successfully');
    };

    const handleBackClick = () => {
       navigate('/Profile');  
    };

    const handleMealChange = (event) => {
        setSelectedMeal(event.target.value);
    };

    const handleSeatChange = (event) => {
        setSelectedSeat(event.target.value);
    };

    const handleCommChange = (event) => {
        setSelectedComm(event.target.value);
    };

    return (
        <div className="preferences-container">
            <button className="back-button-prefer" onClick={handleBackClick}>Back</button>
            <h1 className="prefer-h1">Preferences</h1>
            <div className="preference-section">
                <h2>Meal Preferences</h2>
                <select value={selectedMeal} onChange={handleMealChange}>
                    <option value="">Select a meal preference</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                </select>
            </div>
            <div className="preference-section">
                <h2>Seat Preferences</h2>
                <select className="select-prefer" value={selectedSeat} onChange={handleSeatChange}>
                    <option value="">Select a seat preference</option>
                    <option value="aisle">Aisle</option>
                    <option value="window">Window</option>
                    <option value="middle">Middle</option>
                </select>
            </div>
            <div className="preference-section">
                <h2>Communication Preferences</h2>
                <select value={selectedComm} onChange={handleCommChange}>
                    <option value="">Select a communication preference</option>
                    <option value="email">Email</option>
                </select>
            </div>
            <button className="save-button-prefer" onClick={handleOnClick}>Save Preferences</button>
        </div>
    );
};

export default PreferencesPage;
