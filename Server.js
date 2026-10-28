const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.01:27017/imovies';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Movie Schema & Model with Showtimes
const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  duration: String,
  posterUrl: String,
  description: String,
  showtimes: [
    {
      theatre: String,
      times: [String]
    }
  ]
});

const Movie = mongoose.model('Movie', movieSchema);

// GET All Movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Add Test Movie
app.post('/api/movies', async (req, res) => {
  try {
    const movieData = req.body.title ? req.body : {
      title: "Inception",
      genre: "Sci-Fi / Action",
      duration: "2h 28m",
      posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
      showtimes: [
        { theatre: "PVR Cinemas: Director's Cut", times: ["10:00 AM", "2:30 PM", "7:00 PM"] },
        { theatre: "Cinepolis: Fun Republic", times: ["11:30 AM", "4:00 PM", "9:15 PM"] }
      ]
    };

    const movie = new Movie(movieData);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});