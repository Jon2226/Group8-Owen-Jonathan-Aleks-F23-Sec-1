const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(bodyParser.json());

// Start Trip
app.post('/start-trip', (req, res) => {
  res.json({ success:true });
});

// End Trip
app.post('/end-trip', (req, res) => {
  res.json({ success:true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});