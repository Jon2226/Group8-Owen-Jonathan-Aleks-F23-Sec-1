const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(bodyParser.json());

let isTripStarted = false;
let locationData = {
  latitude: null,
  longitude: null,
  speed: null,
};

// Start Trip
app.post('/start-trip', (req, res) => {
  if (!isTripStarted) {
    isTripStarted = true;
    res.json({ success: true, message: 'Trip started successfully.' });
  } else {
    res.json({ success: false, message: 'Trip is already started.' });
  }
});

// End Trip
app.post('/end-trip', (req, res) => {
  if (isTripStarted) {
    isTripStarted = false;
    res.json({ success: true, message: 'Trip ended successfully.' });
  } else {
    res.json({ success: false, message: 'No active trip to end.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});