import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PersonIcon from '@mui/icons-material/Person';

const Welcome = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const features = [
    {
      icon: <MovieIcon sx={{ fontSize: 40, color: '#ff6b35' }} />,
      title: 'Browse Movies',
      description: 'Discover the latest blockbuster movies and indie gems',
      action: () => navigate('/movies')
    },
    {
      icon: <TheaterComedyIcon sx={{ fontSize: 40, color: '#ff6b35' }} />,
      title: 'Find Theaters',
      description: 'Locate theaters near you with real-time availability',
      action: () => navigate('/movies')
    },
    {
      icon: <EventSeatIcon sx={{ fontSize: 40, color: '#ff6b35' }} />,
      title: 'Book Seats',
      description: 'Reserve your perfect seats with our interactive seating chart',
      action: () => navigate('/movies')
    },
    {
      icon: <PersonIcon sx={{ fontSize: 40, color: '#ff6b35' }} />,
      title: 'Manage Profile',
      description: 'View your bookings, offers, and account settings',
      action: () => navigate('/profile')
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #ff6b35 50%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
        pt: 4,
        pb: 8
      }}
    >
      {/* Animated background elements */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 107, 53, 0.1)',
        }}
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MovieIcon sx={{ fontSize: 80, color: '#ff6b35', mb: 2 }} />
            </motion.div>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
                mb: 2
              }}
            >
              Welcome to MovieStream!
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#ccc',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Your ultimate destination for cinematic experiences. Book tickets, discover movies, and enjoy the magic of cinema.
            </Typography>
          </Box>

          {/* Quick Actions */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    component={motion.div}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={feature.action}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 107, 53, 0.3)',
                      borderRadius: '20px',
                      boxShadow: '0 0 30px rgba(255, 107, 53, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#ff6b35',
                        boxShadow: '0 0 50px rgba(255, 107, 53, 0.4)',
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#fff',
                          fontWeight: 'bold',
                          mb: 1
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#ccc',
                          lineHeight: 1.4
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Call to Action */}
          <Box sx={{ textAlign: 'center' }}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '20px',
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  Ready for an Amazing Experience?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#ccc',
                    mb: 3
                  }}
                >
                  Start exploring our collection of movies and book your tickets now!
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/movies')}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    background: 'linear-gradient(45deg, #ff6b35 30%, #ff8e53 90%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff6b35 60%, #ff8e53 100%)',
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                    },
                  }}
                >
                  Explore Movies
                </Button>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Welcome;
