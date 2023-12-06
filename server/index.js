const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

app.use(bodyParser.json());

// Connect to SQLite database (or create a new one if it doesn't exist)
const db = new sqlite3.Database('trip_data.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the trip_data database.');
  }
});

// Create a table to store trip data (if not exists)
db.run(`
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_location_lat REAL,
    start_location_lon REAL,
    end_location_lat REAL,
    end_location_lon REAL,
    start_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_timestamp DATETIME,
    speed REAL
  )
`);

// Start Trip
app.post('/start-trip', (req, res) => {
  const startLocation = req.body.startLocation;

  // Insert data into the trips table
  db.run(
    'INSERT INTO trips (start_location_lat, start_location_lon) VALUES (?, ?)',
    [startLocation.latitude, startLocation.longitude],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`A new trip has been started with ID ${this.lastID}`);
      res.json({ success: true, tripId: this.lastID });
    }
  );
});

// End Trip
app.post('/end-trip', (req, res) => {
  const endLocation = req.body.endLocation;
  const tripId = req.body.tripId;

  // Update the end_location, end_timestamp, and speed for the corresponding trip
  db.run(
    'UPDATE trips SET end_location_lat = ?, end_location_lon = ?, end_timestamp = CURRENT_TIMESTAMP, speed = ? WHERE id = ?',
    [endLocation.latitude, endLocation.longitude, req.body.speed, tripId],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Trip with ID ${tripId} has been ended.`);
      res.json({ success: true });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});