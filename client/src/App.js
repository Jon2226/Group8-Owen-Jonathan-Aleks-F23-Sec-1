import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    speed: null,
  });

  const startTrip = async () => {
    endTrip();
    try {
      const response = await axios.post('/start-trip');
      if (response.data.success) {
        setIsTripStarted(true);
        console.log(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error starting trip:', error);
    }
  };

  const endTrip = async () => {
    try {
      const response = await axios.post('/end-trip');
      if (response.data.success) {
        setIsTripStarted(false);
        console.log(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error ending trip:', error);
    }
  };

  useEffect(() => {
    // Fetch and update location data when trip is active
    if (isTripStarted){
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed ? position.coords.speed : 0,
        });
      },
      (error) => {
        console.error('Error getting location data:', error);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
      
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
    }
    else{
      setLocationData({
        latitude: null,
        longitude: null,
        speed: null,
      });
    }
    
    //need to make this loop every 5 seconds or so
  }, [isTripStarted]);

  
  return (
    <div className="App">
      <div className="App-title"> 
        <div></div>
        <h1>Driverlytics</h1>
        <button className="login-button">Login</button>
      </div>
      <h2>Trip Status: {isTripStarted ? 'Active' : 'Inactive'}</h2>
      <button className="start-button" onClick={startTrip}>Start Trip</button>
      <button className="end-button" onClick={endTrip}>End Trip</button>
      { (
        <div>
          <h2>Tracking Data</h2>
          <p>Latitude: {locationData.latitude}</p>
          <p>Longitude: {locationData.longitude}</p>
          <p>Speed (m/s): {locationData.speed}</p>
        </div>
      )}
    </div>
  );
};

export default App;