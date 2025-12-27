import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Card, CardContent, TextField, Paper, Tabs, Tab, Divider } from '@mui/material';
import { Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import QrCodeIcon from '@mui/icons-material/QrCode';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, selectedSeats, totalAmount } = location.state || {};

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !name) {
      toast.error('Please fill in all payment details.');
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/bookings', {
        movie: bookingDetails.movie._id,
        theater: bookingDetails.theater._id,
        screen: bookingDetails.screen._id,
        seats: selectedSeats,
        date: bookingDetails.date,
        time: bookingDetails.time,
        totalPrice: totalAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Payment successful! Booking confirmed.');
      navigate('/booking-confirmation', {
        state: {
          bookingDetails,
          selectedSeats,
          totalAmount,
          paymentId: 'PAY_' + Date.now(),
          booking: response.data
        }
      });
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">No booking details found. Please start over.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Payment Details
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Booking Summary
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Movie: {bookingDetails.movie.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Theater: {bookingDetails.theater.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Screen: {bookingDetails.screen.screenNumber}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Seats: {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Total Amount: ₹{totalAmount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Choose Payment Method
              </Typography>
              <Tabs
                value={paymentMethod}
                onChange={(event, newValue) => setPaymentMethod(newValue)}
                variant="fullWidth"
                sx={{ mb: 3 }}
              >
                <Tab icon={<CreditCardIcon />} label="Card" />
                <Tab icon={<SmartphoneIcon />} label="UPI" />
                <Tab icon={<QrCodeIcon />} label="QR Code" />
              </Tabs>

              <AnimatePresence mode="wait">
                {paymentMethod === 0 && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box component="form" sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        margin="normal"
                        placeholder="1234 5678 9012 3456"
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Expiry Date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            margin="normal"
                            placeholder="MM/YY"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            margin="normal"
                            placeholder="123"
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        placeholder="John Doe"
                      />
                    </Box>
                  </motion.div>
                )}

                {paymentMethod === 1 && (
                  <motion.div
                    key="upi"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        label="UPI ID"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        margin="normal"
                        placeholder="yourname@upi"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Enter your UPI ID (e.g., yourname@paytm, yourname@phonepe)
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                {paymentMethod === 2 && (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        Scan QR Code to Pay
                      </Typography>
                      <Box
                        sx={{
                          width: 200,
                          height: 200,
                          bgcolor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          borderRadius: 2,
                        }}
                      >
                        <QrCodeIcon sx={{ fontSize: 80, color: '#666' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Use PhonePe, Google Pay, or any UPI app to scan and pay
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              <Divider sx={{ my: 3 }} />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePayment}
                disabled={loading}
                sx={{
                  mt: 3,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    Processing...
                  </motion.div>
                ) : (
                  `Pay ₹${totalAmount}`
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: 6,
            py: 3,
            px: 2,
            bgcolor: '#f5f5f5',
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  MovieStream
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your ultimate destination for movie tickets and entertainment.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Quick Links
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button size="small" color="inherit">About Us</Button>
                  <Button size="small" color="inherit">Contact</Button>
                  <Button size="small" color="inherit">Terms & Conditions</Button>
                  <Button size="small" color="inherit">Privacy Policy</Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Payment Partners
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartphoneIcon color="primary" />
                    <Typography variant="body2">PhonePe</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon color="primary" />
                    <Typography variant="body2">Cards</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QrCodeIcon color="primary" />
                    <Typography variant="body2">UPI</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary">
              © 2024 MovieStream. All rights reserved. | Secure payments powered by industry-leading technology.
            </Typography>
          </Container>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Payment;
