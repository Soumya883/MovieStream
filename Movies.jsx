import React, { useState, useEffect, useMemo, memo } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Box, CardMedia, TextField, InputAdornment, Pagination, FormControl, InputLabel, Select, MenuItem, Chip, Skeleton, CircularProgress, Modal, IconButton } from '@mui/material';
import { Grid } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Close as CloseIcon, PlayArrow as PlayArrowIcon, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Movies = memo(() => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState({});

  const fetchMovies = async (page = 1, search = '', genre = '', sort = 'title', order = 'asc') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        search,
        genre,
        sortBy: sort,
        sortOrder: order
      });

      const response = await axios.get(`/api/movies?${params}`);
      setMovies(response.data.movies);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage, searchTerm, genreFilter, sortBy, sortOrder);
  }, [currentPage, searchTerm, genreFilter, sortBy, sortOrder]);

  // Debounced search
  const debouncedSearch = useMemo(() => {
    let timeoutId;
    return (value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSearchTerm(value);
        setCurrentPage(1);
      }, 500);
    };
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleGenreChange = (event) => {
    setGenreFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setGenreFilter('');
    setSortBy('title');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const handleTrailerClick = (movie) => {
    setSelectedTrailer(movie);
    setTrailerModalOpen(true);
  };

  const handleCloseTrailerModal = () => {
    setTrailerModalOpen(false);
    setSelectedTrailer(null);
  };

  // Fetch user favorites
  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const response = await axios.get('/api/favorites', config);
      setFavorites(response.data.favorites.map(fav => fav._id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (movieId) => {
    if (!user) return;

    setFavoritesLoading(prev => ({ ...prev, [movieId]: true }));

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      const isFavorite = favorites.includes(movieId);

      if (isFavorite) {
        await axios.delete(`/api/favorites/${movieId}`, config);
        setFavorites(prev => prev.filter(id => id !== movieId));
      } else {
        await axios.post(`/api/favorites/${movieId}`, {}, config);
        setFavorites(prev => [...prev, movieId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoritesLoading(prev => ({ ...prev, [movieId]: false }));
    }
  };

  // Check if movie is favorite
  const isFavorite = (movieId) => {
    return favorites.includes(movieId);
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Movies
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Search movies by title, description, or genre..."
          value={searchTerm}
          onChange={(e) => debouncedSearch(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& fieldset': {
                borderColor: 'rgba(255, 107, 53, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#ff6b35',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff6b35',
              },
            },
            '& .MuiInputBase-input': {
              color: '#fff',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#ff6b35' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Genre</InputLabel>
          <Select
            value={genreFilter}
            onChange={handleGenreChange}
            label="Genre"
            sx={{
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 107, 53, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff6b35',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff6b35',
              },
            }}
          >
            <MenuItem value="">All Genres</MenuItem>
            <MenuItem value="Action">Action</MenuItem>
            <MenuItem value="Comedy">Comedy</MenuItem>
            <MenuItem value="Drama">Drama</MenuItem>
            <MenuItem value="Horror">Horror</MenuItem>
            <MenuItem value="Romance">Romance</MenuItem>
            <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
            <MenuItem value="Thriller">Thriller</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
            sx={{
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 107, 53, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff6b35',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff6b35',
              },
            }}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="releaseDate">Release Date</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Order</InputLabel>
          <Select
            value={sortOrder}
            onChange={handleSortOrderChange}
            label="Order"
            sx={{
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 107, 53, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff6b35',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff6b35',
              },
            }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {(searchTerm || genreFilter || sortBy !== 'title' || sortOrder !== 'asc') && (
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{
              color: '#ff6b35',
              borderColor: '#ff6b35',
              '&:hover': {
                borderColor: '#ff5722',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
              },
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Active Filters Display */}
      {(searchTerm || genreFilter) && (
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {searchTerm && (
            <Chip
              label={`Search: ${searchTerm}`}
              onDelete={() => setSearchTerm('')}
              sx={{ backgroundColor: 'rgba(255, 107, 53, 0.2)', color: '#fff' }}
            />
          )}
          {genreFilter && (
            <Chip
              label={`Genre: ${genreFilter}`}
              onDelete={() => setGenreFilter('')}
              sx={{ backgroundColor: 'rgba(255, 107, 53, 0.2)', color: '#fff' }}
            />
          )}
        </Box>
      )}
      {/* Loading State */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from(new Array(12)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Skeleton variant="rectangular" height={300} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" height={32} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" width={80} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {movies.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  {searchTerm || genreFilter ? `No movies found matching your criteria` : 'No movies available'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {searchTerm || genreFilter ? 'Try adjusting your search or filters' : 'Check back later for new releases'}
                </Typography>
              </Box>
            </Grid>
          ) : (
            movies.map(movie => (
              <Grid item xs={12} sm={6} md={4} key={movie._id}>
                <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={movie.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2">
                      {movie.title}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      {movie.genre && movie.genre.slice(0, 3).map((genre, index) => (
                        <Chip
                          key={index}
                          label={genre}
                          size="small"
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            backgroundColor: 'rgba(255, 107, 53, 0.2)',
                            color: '#ff6b35',
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {movie.description.length > 100 ? `${movie.description.substring(0, 100)}...` : movie.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {movie.duration} minutes
                    </Typography>
                    {movie.rating && (
                      <Typography variant="body2" color="text.secondary">
                        Rating: {movie.rating}/10
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" component={Link} to={`/movies/${movie._id}`}>
                      Book Now
                    </Button>
                    {user && (
                      <IconButton
                        size="small"
                        onClick={() => toggleFavorite(movie._id)}
                        disabled={favoritesLoading[movie._id]}
                        sx={{
                          color: isFavorite(movie._id) ? '#ff6b35' : 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: '#ff6b35',
                          },
                        }}
                      >
                        {favoritesLoading[movie._id] ? (
                          <CircularProgress size={20} />
                        ) : isFavorite(movie._id) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    )}
                    {movie.trailerUrl && (
                      <IconButton
                        size="small"
                        onClick={() => handleTrailerClick(movie)}
                        sx={{ color: '#ff6b35' }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#fff',
              },
              '& .Mui-selected': {
                backgroundColor: '#ff6b35 !important',
                color: '#fff',
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: 'rgba(255, 107, 53, 0.2)',
              },
            }}
          />
        </Box>
      )}

      {/* Results Summary */}
      {pagination.totalMovies > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {movies.length} of {pagination.totalMovies} movies
          </Typography>
        </Box>
      )}

      {/* Trailer Modal */}
      <Modal
        open={trailerModalOpen}
        onClose={handleCloseTrailerModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.9)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90%',
            maxWidth: '1200px',
            maxHeight: '80vh',
            bgcolor: 'black',
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
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedTrailer && (
            <Box sx={{ width: '100%', height: '100%' }}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedTrailer.trailerUrl}?autoplay=1&rel=0`}
                title={`${selectedTrailer.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ minHeight: '500px' }}
              />
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
});

Movies.displayName = 'Movies';

export default Movies;
