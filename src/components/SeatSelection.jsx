import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, Chip, Tooltip } from '@mui/material';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, theater, date, time } = location.state || {};
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movie || !theater) {
      navigate('/movies');
      return;
    }

    const fetchScreens = async () => {
      try {
        const res = await axios.get(`/api/screens/theater/${theater._id}`);
        setScreens(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (theater?._id) fetchScreens();
  }, [movie, theater, navigate]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.find(s => s.row === seat.row && s.number === seat.number)) {
      setSelectedSeats(selectedSeats.filter(s => !(s.row === seat.row && s.number === seat.number)));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceedToBooking = () => {
    const totalAmount = selectedSeats.length * 200; // Assuming ₹200 per seat
    navigate('/payment', {
      state: {
        bookingDetails: { movie, theater, screen: selectedScreen, date, time },
        selectedSeats,
        totalAmount
      }
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading screens...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#333', fontWeight: 'bold', mb: 4 }}>
          Select Seats for {movie?.title}
        </Typography>
        <Typography variant="h5" gutterBottom align="center" sx={{ color: '#666', mb: 4 }}>
          Theater: {theater?.name}
        </Typography>

        {!selectedScreen ? (
          <Grid container spacing={3}>
            {screens.map((screen) => (
              <Grid item xs={12} sm={6} md={4} key={screen._id}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                  onClick={() => setSelectedScreen(screen)}
                >
                  <Typography variant="h6" gutterBottom>
                    Screen {screen.screenNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {screen.capacity}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
              Screen {selectedScreen.screenNumber}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ width: '80%', maxWidth: 600 }}>
                {Array.from({ length: 10 }, (_, rowIndex) => (
                  <Box key={rowIndex} sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {Array.from({ length: 15 }, (_, seatIndex) => {
                      const seat = selectedScreen.seats.find(s => s.row === String.fromCharCode(65 + rowIndex) && s.number === seatIndex + 1);
                      const isSelected = selectedSeats.find(s => s.row === String.fromCharCode(65 + rowIndex) && s.number === seatIndex + 1);
                      return (
                        <motion.div
                          key={seatIndex}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Tooltip title={`Row ${String.fromCharCode(65 + rowIndex)}, Seat ${seatIndex + 1} - ${seat?.type || 'standard'}`} arrow>
                            <Box
                              sx={{
                                width: 30,
                                height: 30,
                                m: 0.5,
                                borderRadius: 1,
                                backgroundColor: isSelected ? '#4caf50' : seat?.type === 'premium' ? '#ff9800' : '#2196f3',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                '&:hover': {
                                  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                                },
                              }}
                              onClick={() => handleSeatSelect({ row: String.fromCharCode(65 + rowIndex), number: seatIndex + 1, type: seat?.type || 'standard' })}
                            >
                              {seatIndex + 1}
                            </Box>
                          </Tooltip>
                        </motion.div>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Chip label="Standard" sx={{ mr: 2, backgroundColor: '#2196f3', color: 'white' }} />
              <Chip label="Premium" sx={{ mr: 2, backgroundColor: '#ff9800', color: 'white' }} />
              <Chip label="Selected" sx={{ backgroundColor: '#4caf50', color: 'white' }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setSelectedScreen(null)}
                sx={{ color: '#666', borderColor: '#666' }}
              >
                Back to Screens
              </Button>
              <Button
                variant="contained"
                onClick={handleProceedToBooking}
                disabled={selectedSeats.length === 0}
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  },
                }}
              >
                Proceed to Booking ({selectedSeats.length} seats)
              </Button>
            </Box>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default SeatSelection;
