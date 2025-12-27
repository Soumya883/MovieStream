import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, CardMedia, Grid, Chip, Paper, Modal, IconButton, Rating, TextField, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    axios.get(`/api/movies/${id}`)
      .then(response => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movie:', error);
        setLoading(false);
      });
  }, [id]);

  const handleBookNow = () => {
    navigate(`/theater-selection/${id}`, { state: { movie } });
  };

  const handleTrailerClick = () => {
    setTrailerModalOpen(true);
  };

  const handleCloseTrailerModal = () => {
    setTrailerModalOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading movie details...</Typography>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Movie not found.</Typography>
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="500"
              image={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={movie.title}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {movie.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={movie.genre} color="primary" />
                <Chip label={`${movie.duration} min`} variant="outlined" />
                <Chip label={`Rating: ${movie.rating}/10`} variant="outlined" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                {movie.description}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Cast:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.cast ? movie.cast.join(', ') : 'Not available'}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Director:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.director || 'Not available'}
                </Typography>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleBookNow}
                  sx={{
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
                  Book Now
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {movie.trailer && (
          <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">
                Trailer
              </Typography>
              <IconButton
                onClick={handleTrailerClick}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <FullscreenIcon />
              </IconButton>
            </Box>
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailer.split('v=')[1]}`}
                title="Movie Trailer"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                allowFullScreen
              />
            </Box>
          </Paper>
        )}

        <Modal
          open={trailerModalOpen}
          onClose={handleCloseTrailerModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '90%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              backgroundColor: 'black',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <IconButton
              onClick={handleCloseTrailerModal}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailer.split('v=')[1]}`}
                title="Movie Trailer"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                allowFullScreen
              />
            </Box>
          </Box>
        </Modal>

        {/* Reviews Section */}
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Reviews & Ratings
          </Typography>

          {/* User Review Form */}
          {user && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Write a Review
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Your Rating</Typography>
                <Rating
                  name="user-rating"
                  value={userRating}
                  onChange={(event, newValue) => {
                    setUserRating(newValue);
                  }}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Share your thoughts about this movie..."
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  // Handle review submission
                  console.log('Submitting review:', { rating: userRating, review: userReview });
                }}
                disabled={submittingReview || (!userRating && !userReview.trim())}
                sx={{
                  backgroundColor: '#ff6b35',
                  '&:hover': {
                    backgroundColor: '#ff5722',
                  },
                }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </Box>
          )}

          {!user && (
            <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(255, 107, 53, 0.1)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Please log in to write a review and rate this movie.
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Reviews List */}
          <Typography variant="h6" gutterBottom>
            User Reviews
          </Typography>
          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No reviews yet. Be the first to review this movie!
            </Typography>
          ) : (
            <List>
              {reviews.map((review, index) => (
                <React.Fragment key={review.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#ff6b35' }}>
                        {review.user.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {review.user}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {review.comment}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default MovieDetails;
