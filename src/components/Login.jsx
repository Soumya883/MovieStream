import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert, InputAdornment, IconButton, Checkbox, FormControlLabel, Link } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Movie, PlayArrow } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful! Welcome back.');
      navigate('/welcome');
    } else {
      toast.error(result.error);
      setError(result.error);
    }

    setLoading(false);
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

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #ff6b35 50%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
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
          width: '100px',
          height: '100px',
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
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      />

      {/* Floating movie icons */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          opacity: 0.3,
        }}
      >
        <Movie sx={{ fontSize: 40, color: '#ff6b35' }} />
      </motion.div>

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          bottom: '40%',
          right: '25%',
          opacity: 0.2,
        }}
      >
        <PlayArrow sx={{ fontSize: 50, color: '#fff' }} />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          component={motion.div}
          variants={itemVariants}
          elevation={20}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 420,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 0 50px rgba(255, 107, 53, 0.2)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Movie sx={{ fontSize: 60, color: '#ff6b35', mb: 1 }} />
            </motion.div>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255, 107, 53, 0.5)',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: '#ccc' }}>
              Sign in to continue your cinematic journey
            </Typography>
          </Box>

          {error && (
            <motion.div variants={itemVariants}>
              <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#ff6b35' }}>
                {error}
              </Alert>
            </motion.div>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#ff6b35' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 107, 53, 0.3)' },
                    '&:hover fieldset': { borderColor: '#ff6b35' },
                    '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                  },
                  '& .MuiInputLabel-root': { color: '#ccc' },
                  '& .MuiInputBase-input': { color: '#fff' },
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#ff6b35' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#ff6b35' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 107, 53, 0.3)' },
                    '&:hover fieldset': { borderColor: '#ff6b35' },
                    '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                  },
                  '& .MuiInputLabel-root': { color: '#ccc' },
                  '& .MuiInputBase-input': { color: '#fff' },
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: '#ff6b35',
                      '&.Mui-checked': { color: '#ff6b35' },
                    }}
                  />
                }
                label={<Typography sx={{ color: '#ccc' }}>Remember Me</Typography>}
                sx={{ mb: 1 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'right', mb: 2 }}>
                <Link href="#" variant="body2" sx={{ color: '#ff6b35', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  mt: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #ff6b35 30%, #ff8e53 90%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderRadius: '25px',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff6b35 60%, #ff8e53 100%)',
                    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 107, 53, 0.3)',
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Start Watching'}
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
