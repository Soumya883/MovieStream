import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, Box, Grid, Chip, Paper, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText, Tabs, Tab, TextField, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY'
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('/api/bookings', config);
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.put(`/api/bookings/${bookingId}/cancel`, {}, config);
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading your bookings...</Typography>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}>
          My Profile
        </Typography>

        <Paper elevation={3} sx={{ background: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                color: '#ccc',
                '&.Mui-selected': {
                  color: '#ff6b35',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ff6b35',
              },
            }}
          >
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<ReceiptIcon />} label="Bookings" />
            <Tab icon={<LocalOfferIcon />} label="Offers" />
            <Tab icon={<CreditCardIcon />} label="Payment" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: '#ff6b35', mr: 3 }}>
                    <AccountCircleIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      Welcome Back!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ccc' }}>
                      Member since 2024
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Account Information
                  </Typography>
                  <IconButton
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{ color: '#ff6b35' }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                {isEditing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#ff6b35' },
                          '&:hover fieldset': { borderColor: '#ff6b35' },
                          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                        },
                        '& .MuiInputLabel-root': { color: '#ccc' },
                        '& .MuiOutlinedInput-input': { color: '#fff' },
                      }}
                    />
                    <TextField
                      label="Phone"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#ff6b35' },
                          '&:hover fieldset': { borderColor: '#ff6b35' },
                          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                        },
                        '& .MuiInputLabel-root': { color: '#ccc' },
                        '& .MuiOutlinedInput-input': { color: '#fff' },
                      }}
                    />
                    <TextField
                      label="Location"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#ff6b35' },
                          '&:hover fieldset': { borderColor: '#ff6b35' },
                          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                        },
                        '& .MuiInputLabel-root': { color: '#ccc' },
                        '& .MuiOutlinedInput-input': { color: '#fff' },
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <IconButton
                        onClick={() => {
                          // Here you would typically send the data to the backend
                          // For now, we'll just update the local state
                          setIsEditing(false);
                        }}
                        sx={{ color: '#4caf50' }}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditData({
                            email: 'user@example.com',
                            phone: '+1 (555) 123-4567',
                            location: 'New York, NY'
                          });
                          setIsEditing(false);
                        }}
                        sx={{ color: '#f44336' }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon sx={{ color: '#ff6b35' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={editData.email}
                        sx={{ '& .MuiListItemText-primary': { color: '#fff' }, '& .MuiListItemText-secondary': { color: '#ccc' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon sx={{ color: '#ff6b35' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={editData.phone}
                        sx={{ '& .MuiListItemText-primary': { color: '#fff' }, '& .MuiListItemText-secondary': { color: '#ccc' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon sx={{ color: '#ff6b35' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={editData.location}
                        sx={{ '& .MuiListItemText-primary': { color: '#fff' }, '& .MuiListItemText-secondary': { color: '#ccc' } }}
                      />
                    </ListItem>
                  </List>
                )}
              </motion.div>
            )}

            {tabValue === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  My Bookings
                </Typography>
                {bookings.length === 0 ? (
                  <Paper elevation={1} sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                    <Typography variant="h6" sx={{ color: '#ccc' }}>
                      You haven't made any bookings yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={3}>
                    {bookings.map((booking) => (
                      <Grid item xs={12} md={6} key={booking._id}>
                        <Card
                          component={motion.div}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 107, 53, 0.2)'
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#fff' }}>
                              {booking.movie?.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }} gutterBottom>
                              Theater: {booking.theater?.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }} gutterBottom>
                              Screen: {booking.screen?.screenNumber}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }} gutterBottom>
                              Date: {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }} gutterBottom>
                              Seats: {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }} gutterBottom>
                              Total Price: ${booking.totalPrice}
                            </Typography>
                            <Chip
                              label={booking.status}
                              color={booking.status === 'confirmed' ? 'success' : 'error'}
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                          {booking.status === 'confirmed' && (
                            <Box sx={{ p: 2 }}>
                              <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => handleCancelBooking(booking._id)}
                                sx={{
                                  color: '#f44336',
                                  borderColor: '#f44336',
                                  '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    borderColor: '#f44336',
                                  },
                                }}
                              >
                                Cancel Booking
                              </Button>
                            </Box>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </motion.div>
            )}

            {tabValue === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Special Offers
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ bgcolor: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.3)' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#ff6b35' }}>
                          🎬 Student Discount
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ccc' }}>
                          20% off on all movie tickets with valid student ID
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ bgcolor: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.3)' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#ff6b35' }}>
                          🎭 Family Package
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ccc' }}>
                          Buy 4 tickets, get 1 free for family movie nights
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {tabValue === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Payment Methods
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCardIcon sx={{ color: '#ff6b35', mr: 2 }} />
                          <Box>
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                              **** **** **** 1234
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }}>
                              Visa • Expires 12/25
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCardIcon sx={{ color: '#ff6b35', mr: 2 }} />
                          <Box>
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                              **** **** **** 5678
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }}>
                              Mastercard • Expires 08/26
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UserProfile;
