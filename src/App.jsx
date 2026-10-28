import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const SEAT_PRICE = 150;
  const seatRows = ['A', 'B', 'C', 'D'];
  const seatNumbers = [1, 2, 3, 4, 5, 6];

  const fetchMovies = () => {
    axios.get('http://localhost:5000/api/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchMovies();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }
    setIsLoggedIn(true);
  };

  const addMovie = (movieData) => {
    axios.post('http://localhost:5000/api/movies', movieData)
      .then(() => {
        alert(`${movieData.title} added successfully!`);
        fetchMovies();
      })
      .catch(err => {
        console.error(err);
        alert("Failed to connect to backend! Make sure 'node Server.js' is running.");
      });
  };

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    alert(`🎉 Booking Confirmed!\nMovie: ${selectedMovie.title}\nTheatre: ${selectedShowtime.theatre}\nTime: ${selectedShowtime.time}\nSeats: ${selectedSeats.join(', ')}\nTotal Amount: ₹${selectedSeats.length * SEAT_PRICE}`);
    
    setSelectedSeats([]);
    setSelectedShowtime(null);
    setSelectedMovie(null);
  };

  // 1. LOGIN SCREEN VIEW
  if (!isLoggedIn) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ width: '400px' }}>
          <h2 className="text-center text-primary fw-bold mb-3">🎬 IMovies</h2>
          <p className="text-center text-muted mb-4">Login to book your cinema tickets</p>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold">Login / Register</button>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN CINEMA BOOKING APP VIEW
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-primary fw-bold m-0">IMovies — Cinema Booking</h1>
          <p className="text-muted m-0">Welcome, {email}!</p>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={() => setIsLoggedIn(false)}>
          Logout
        </button>
      </div>

      <div className="text-center mb-4">
        {!selectedMovie && !selectedShowtime && (
          <div className="d-flex justify-content-center gap-3">
            <button 
              className="btn btn-success" 
              onClick={() => addMovie({
                title: "Inception",
                genre: "Sci-Fi / Action",
                duration: "2h 28m",
                posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
                description: "A thief who steals corporate secrets through dream-sharing technology.",
                showtimes: [
                  { theatre: "PVR Cinemas", times: ["10:00 AM", "2:30 PM", "7:00 PM"] },
                  { theatre: "Cinepolis", times: ["11:30 AM", "4:00 PM", "9:15 PM"] }
                ]
              })}
            >
              + Add Inception
            </button>

            <button 
              className="btn btn-info text-white" 
              onClick={() => addMovie({
                title: "Interstellar",
                genre: "Sci-Fi / Adventure",
                duration: "2h 49m",
                posterUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500",
                description: "A team of explorers travel through a wormhole in space to save humanity.",
                showtimes: [
                  { theatre: "PVR Cinemas", times: ["1:00 PM", "5:00 PM", "9:00 PM"] },
                  { theatre: "INOX", times: ["12:00 PM", "6:30 PM"] }
                ]
              })}
            >
              + Add Interstellar
            </button>
          </div>
        )}
      </div>

      {selectedShowtime ? (
        /* SEAT SELECTION GRID VIEW */
        <div className="card shadow p-4 text-center">
          <button 
            className="btn btn-secondary btn-sm mb-3 align-self-start" 
            onClick={() => setSelectedShowtime(null)}
          >
            ← Back to Showtimes
          </button>
          
          <h3 className="fw-bold">{selectedMovie.title}</h3>
          <p className="text-muted mb-1">{selectedShowtime.theatre} | Showtime: <span className="badge bg-primary fs-6">{selectedShowtime.time}</span></p>

          <div className="my-4 p-2 bg-dark text-white rounded text-center shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
            🎬 SCREEN THIS WAY
          </div>

          <div className="d-flex flex-column align-items-center gap-2 my-3">
            {seatRows.map(row => (
              <div key={row} className="d-flex align-items-center gap-2">
                <span className="fw-bold me-2 text-secondary">{row}</span>
                {seatNumbers.map(num => {
                  const seatId = `${row}${num}`;
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      className={`btn ${isSelected ? 'btn-success' : 'btn-outline-secondary'} btn-sm`}
                      style={{ width: '45px', height: '40px' }}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="card bg-light p-3 mt-4 mx-auto w-100" style={{ maxWidth: '450px' }}>
            <p className="mb-1"><strong>Selected Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
            <h5 className="text-success fw-bold">Total Price: ₹{selectedSeats.length * SEAT_PRICE}</h5>
            <button 
              className="btn btn-success mt-2 fw-bold w-100" 
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length === 0}
            >
              Book {selectedSeats.length} Ticket(s)
            </button>
          </div>
        </div>
      ) : selectedMovie ? (
        /* MOVIE SHOWTIMES VIEW */
        <div className="card shadow p-4">
          <button className="btn btn-secondary btn-sm mb-3 align-self-start" onClick={() => setSelectedMovie(null)}>
            ← Back to Movies
          </button>
          <h2 className="fw-bold">{selectedMovie.title}</h2>
          <p className="text-muted">{selectedMovie.genre} | {selectedMovie.duration}</p>
          <p>{selectedMovie.description}</p>
          
          <h4 className="mt-4 mb-3 text-primary">Select Theatre & Showtime</h4>
          {selectedMovie.showtimes && selectedMovie.showtimes.length > 0 ? (
            selectedMovie.showtimes.map((item, index) => (
              <div className="card mb-3 p-3 bg-light" key={index}>
                <h5 className="fw-bold text-dark">{item.theatre}</h5>
                <div className="d-flex gap-2 mt-2">
                  {item.times.map((time, tIndex) => (
                    <button 
                      key={tIndex} 
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setSelectedShowtime({ theatre: item.theatre, time });
                        setSelectedSeats([]);
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No showtimes available for this movie.</p>
          )}
        </div>
      ) : (
        /* MOVIE LISTING VIEW */
        <div className="row">
          {movies.map((movie) => (
            <div className="col-md-4 mb-4" key={movie._id}>
              <div className="card h-100 shadow-sm">
                <img 
                  src={movie.posterUrl} 
                  className="card-img-top" 
                  alt={movie.title} 
                  style={{ height: '280px', objectFit: 'cover' }} 
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{movie.title}</h5>
                  <p className="card-text text-muted small">{movie.genre} | {movie.duration}</p>
                  <button 
                    className="btn btn-primary mt-auto w-100"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    Select Showtime & Seats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;