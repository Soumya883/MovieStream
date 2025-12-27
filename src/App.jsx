import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Movies from './components/Movies';
import MovieDetails from './components/MovieDetails';
import TheaterSelection from './components/TheaterSelection';
import DateTimeSelection from './components/DateTimeSelection';
import SeatSelection from './components/SeatSelection';
import Payment from './components/Payment';
import BookingConfirmation from './components/BookingConfirmation';
import UserProfile from './components/UserProfile';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #ff6b35 50%, #000000 100%)',
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <CircularProgress size={60} sx={{ color: '#ff6b35' }} />
    </motion.div>
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Navbar />
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/movies/:id" element={<MovieDetails />} />
                  <Route path="/theater-selection/:movieId" element={<TheaterSelection />} />
                  <Route path="/date-time-selection/:movieId/:theaterId" element={<DateTimeSelection />} />
                  <Route path="/seat-selection/:movieId/:theaterId" element={<SeatSelection />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
