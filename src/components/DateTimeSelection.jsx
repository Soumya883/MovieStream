import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, Grid, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DateTimeSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, theater } = location.state || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    navigate(`/seat-selection/${movie._id}/${theater._id}`, {
      state: {
        movie,
        theater,
        date: selectedDate,
        time: selectedTime
      }
    });
  };

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

  if (!movie || !theater) {
    navigate('/movies');
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
            Select Date & Time
          </Typography>
          <Typography variant="h5" align="center" sx={{ color: '#ccc', mb: 4 }}>
            {movie.title} at {theater.name}
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '15px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon sx={{ color: '#ff6b35', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                      Select Date
                    </Typography>
                  </Box>
                  <DatePicker
                    label="Choose Date"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 107, 53, 0.3)' },
                            '&:hover fieldset': { borderColor: '#ff6b35' },
                            '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                          },
                          '& .MuiInputLabel-root': { color: '#ccc' },
                          '& .MuiInputBase-input': { color: '#fff' },
                        }
                      }
                    }}
                  />
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '15px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ color: '#ff6b35', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                      Select Time
                    </Typography>
                  </Box>
                  <TimePicker
                    label="Choose Time"
                    value={selectedTime}
                    onChange={setSelectedTime}
                    minTime={new Date(0, 0, 0, 9, 0)} // 9 AM
                    maxTime={new Date(0, 0, 0, 23, 0)} // 11 PM
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 107, 53, 0.3)' },
                            '&:hover fieldset': { borderColor: '#ff6b35' },
                            '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                          },
                          '& .MuiInputLabel-root': { color: '#ccc' },
                          '& .MuiInputBase-input': { color: '#fff' },
                        }
                      }
                    }}
                  />
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <motion.div variants={itemVariants}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  color: '#ccc',
                  borderColor: '#ccc',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#fff',
                  },
                }}
              >
                Back
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                variant="contained"
                onClick={handleProceed}
                disabled={!selectedDate || !selectedTime}
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
                Select Seats
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </LocalizationProvider>
  );
};

export default DateTimeSelection;
