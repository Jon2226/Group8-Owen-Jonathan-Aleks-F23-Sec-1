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
    try {
      const response = await axios.post('/start-trip');
      if (response.data.success && !isTripStarted) {
        setIsTripStarted(response.data.success);
        console.log('Sucessfully started trip');
      } else {
        console.log('Trip already exists');
      }
    } catch (error) {
      console.error('Error starting trip:', error);
    }
  };

  const endTrip = async () => {
    try {
      const response = await axios.post('/end-trip');
      if (response.data.success && isTripStarted) {
        setIsTripStarted(!response.data.success);
        console.log('Sucessfully ended trip');
        setLocationData({
          latitude: null,
          longitude: null,
          speed: null,
        });
      } else {
        console.log('No trip to end');
      }
    } catch (error) {
      console.error('Error ending trip:', error);
    }
  };

  const setGeolocation = () => {
    var watchID = navigator.geolocation.watchPosition(
      (position) => {
        console.log(position.coords.latitude)
        console.log(position.coords.longitude)
        setLocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed ? position.coords.speed : 0,
        });
      },
      (error) => {
        console.error('Error getting location data:', error);
      },
      { enableHighAccuracy: true, maximumAge:0
      }
    );

    setTimeout( function () {
      navigator.geolocation.clearWatch(watchID) 
  }, 
  5000 //stop checking after 5 seconds
);
  }

  useEffect(() => {
    var intervalID
    if (isTripStarted){

     intervalID = setInterval( function () {
      setGeolocation();
      }, 6000 );
    }

    return () => {
      clearInterval(intervalID)
    }

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
      {isTripStarted && (
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