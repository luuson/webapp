const express = require('express');
const app = express();
const videoRoutes = require('./routes/video');

// Set up view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
// Routes

app.use('/video', videoRoutes);

// Start the server
const port = 3001; // Change the port number to an available port

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

