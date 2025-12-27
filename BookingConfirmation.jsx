import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button, Box, Paper, Chip } from '@mui/material';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, theater, screen, seats } = location.state || {};
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    if (!movie || !theater || !screen || !seats) {
      navigate('/');
      return;
    }
  }, [movie, theater, screen, seats, navigate]);

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      const bookingData = {
        movie: movie._id,
        theater: theater._id,
        screen: screen._id,
        seats: seats.map(seat => ({ row: seat.row, number: seat.number, type: seat.type })),
        date: new Date().toISOString().split('T')[0], // Today's date
        time: '19:00', // Default time, can be made dynamic
        totalPrice: seats.reduce((total, seat) => total + (seat.type === 'premium' ? 15 : 10), 0),
      };

      const res = await axios.post('/api/bookings', bookingData, config);
      setBooking(res.data);
      toast.success('Booking confirmed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewBookings = () => {
    navigate('/profile');
  };

  if (!movie || !theater || !screen || !seats) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {paymentStep ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
              Payment Details
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
              Total Amount: ${seats.reduce((total, seat) => total + (seat.type === 'premium' ? 15 : 10), 0)}
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setPaymentStep(false)}
                sx={{ color: '#666', borderColor: '#666' }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmBooking}
                disabled={loading}
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
                {loading ? 'Processing...' : 'Pay & Confirm Booking'}
              </Button>
            </Box>
          </Paper>
        ) : !booking ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
              Confirm Your Booking
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Movie Details
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {movie.duration} minutes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Theater & Screen
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {theater.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Screen {screen.screenNumber}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Selected Seats
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {seats.map((seat, index) => (
                        <Chip
                          key={index}
                          label={`${seat.row}${seat.number} (${seat.type})`}
                          sx={{
                            backgroundColor: seat.type === 'premium' ? '#ff9800' : '#2196f3',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Total Price: ${seats.reduce((total, seat) => total + (seat.type === 'premium' ? 15 : 10), 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ color: '#666', borderColor: '#666' }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => setPaymentStep(true)}
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                  },
                }}
              >
                Proceed to Payment
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
            </motion.div>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
              Booking Confirmed!
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
              Your booking ID: {booking._id}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Movie
                    </Typography>
                    <Typography variant="body1">
                      {movie.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Theater
                    </Typography>
                    <Typography variant="body1">
                      {theater.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Screen {screen.screenNumber}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Booking Details
                    </Typography>
                    <Typography variant="body1">
                      Seats: {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                    </Typography>
                    <Typography variant="body1">
                      Total: ${booking.totalPrice}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleGoHome}
                sx={{ color: '#666', borderColor: '#666' }}
              >
                Go Home
              </Button>
              <Button
                variant="contained"
                onClick={handleViewBookings}
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                  },
                }}
              >
                View My Bookings
              </Button>
            </Box>
          </Paper>
        )}
      </motion.div>
    </Container>
  );
};

export default BookingConfirmation;
