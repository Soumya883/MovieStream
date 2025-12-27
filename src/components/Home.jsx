import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Card, CardContent, CardActions, CardMedia, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [featuredTheaters, setFeaturedTheaters] = useState([]);
  const [loadingTheaters, setLoadingTheaters] = useState(true);

  useEffect(() => {
    // Fetch movies
    axios.get('/api/movies')
      .then(response => {
        setFeaturedMovies(response.data.movies.slice(0, 4));
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });

    // Fetch theaters
    axios.get('/api/theaters')
      .then(response => {
        setFeaturedTheaters(response.data.theaters.slice(0, 3));
        setLoadingTheaters(false);
      })
      .catch(error => {
        console.error('Error fetching theaters:', error);
        setLoadingTheaters(false);
      });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        }
      }
    ]
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
          textAlign: 'center',
          minHeight: { xs: '50vh', sm: '60vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: { xs: 2, sm: 3 }
              }}
            >
              Welcome to MovieStream
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Typography
              variant="h5"
              component="p"
              gutterBottom
              sx={{
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                px: { xs: 1, sm: 0 }
              }}
            >
              Discover and book your favorite Hindi movies with ease. Experience the magic of cinema like never before!
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/movies"
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: 2,
                '&:hover': { transform: 'scale(1.05)' },
                minWidth: { xs: '200px', sm: 'auto' }
              }}
            >
              Browse Movies
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Featured Movies Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4, color: '#333', fontWeight: 'bold' }}>
          🎬 Featured Movies
        </Typography>
        <Slider {...sliderSettings}>
          {featuredMovies.map(movie => (
            <Box key={movie._id} sx={{ px: 1 }}>
              <Card
                sx={{
                  maxWidth: 345,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  mx: 'auto',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {movie.description.length > 100 ? `${movie.description.substring(0, 100)}...` : movie.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      ⏱️ {movie.duration} min
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                      ⭐ {movie.rating}/10
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    to={`/movies/${movie._id}`}
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Slider>
      </Container>

      {/* Featured Theaters Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4, color: '#333', fontWeight: 'bold' }}>
            🏛️ Premier Theaters
          </Typography>
          {loadingTheaters ? (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ px: 1 }}>
                  <Card sx={{ maxWidth: 345, borderRadius: 3 }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent sx={{ p: 2 }}>
                      <Skeleton variant="text" height={32} width="70%" />
                      <Skeleton variant="text" height={20} width="50%" />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Skeleton variant="text" height={20} width="40%" />
                        <Skeleton variant="text" height={20} width="35%" />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Skeleton variant="rectangular" height={36} width="100%" />
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          ) : (
            <Slider {...sliderSettings}>
              {featuredTheaters.map(theater => (
                <Box key={theater._id} sx={{ px: 1 }}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      },
                      mx: 'auto',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={`https://images.unsplash.com/photo-${['1478720568477-152d9b164e26', '1506905925346-21bda4d32df4', '1489599735734-79b4b0abaf9e', '1517604931442-7e0c8ed2963c', '1489599735734-79b4b0abaf9e', '1506905925346-21bda4d32df4'][theater._id.charCodeAt(0) % 6]}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80`}
                      alt={theater.name}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                        {theater.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        📍 {theater.location}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          🎭 {theater.screens?.length || 0} Screens
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                          👥 {theater.capacity} Seats
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/theater-selection/${theater._id}`}
                        sx={{
                          fontWeight: 'bold',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 100%)',
                          }
                        }}
                      >
                        View Shows
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Slider>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4, color: '#333', fontWeight: 'bold' }}>
          ✨ Why Choose MovieStream?
        </Typography>
        <Slider {...sliderSettings}>
          <Box sx={{ px: 1 }}>
            <Card sx={{ maxWidth: 300, textAlign: 'center', p: 2, borderRadius: 3, mx: 'auto' }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>🎫</Typography>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Easy Booking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Book your tickets in just a few clicks with our intuitive interface
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ px: 1 }}>
            <Card sx={{ maxWidth: 300, textAlign: 'center', p: 2, borderRadius: 3, mx: 'auto' }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>🎭</Typography>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Premium Theaters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experience movies in state-of-the-art theaters across the city
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ px: 1 }}>
            <Card sx={{ maxWidth: 300, textAlign: 'center', p: 2, borderRadius: 3, mx: 'auto' }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>⭐</Typography>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Best Prices
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get the best deals on movie tickets with our competitive pricing
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Slider>
      </Container>
    </Box>
  );
};

export default Home;
