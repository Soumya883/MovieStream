import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Button, Box, Grid, Tabs, Tab, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const TheaterSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie } = location.state || {};
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(0); // 0 for list, 1 for map

  useEffect(() => {
    if (!movie) {
      navigate('/movies');
      return;
    }

    const fetchTheaters = async () => {
      try {
        const res = await axios.get('/api/theaters');
        setTheaters(res.data.theaters);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchTheaters();
  }, [movie, navigate]);

  const handleTheaterSelect = (theater) => {
    if (!movie || !movie._id) {
      console.error('Movie data is missing');
      return;
    }
    navigate(`/date-time-selection/${movie._id}/${theater._id}`, {
      state: { movie, theater }
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading theaters...</Typography>
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
          Select a Theater for {movie?.title}
        </Typography>
        <Grid container spacing={3}>
          {theaters.map((theater) => (
            <Grid item xs={12} sm={6} md={4} key={theater._id}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1489599735734-79b4b9c7e0b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Theater"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#333' }}>
                    {theater.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {theater.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {theater.capacity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Screens: {theater.screens?.length || 0}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleTheaterSelect(theater)}
                    sx={{
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                      },
                    }}
                  >
                    Select Theater
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default TheaterSelection;
