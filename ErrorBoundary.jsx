import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Here you could send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #ff6b35 50%, #000000 100%)',
                color: 'white',
                borderRadius: '20px',
                border: '1px solid rgba(255, 107, 53, 0.3)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ff6b35', mb: 2 }} />
              </motion.div>

              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Oops! Something went wrong
              </Typography>

              <Typography variant="h6" sx={{ mb: 3, color: '#ccc' }}>
                We're sorry, but something unexpected happened. Our team has been notified.
              </Typography>

              <Typography variant="body1" sx={{ mb: 4, color: '#b0b0b0' }}>
                Don't worry, your data is safe. Try refreshing the page or contact support if the problem persists.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    onClick={this.handleRetry}
                    startIcon={<RefreshIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      color: 'white',
                      fontWeight: 'bold',
                      px: 3,
                      py: 1.5,
                      borderRadius: '25px',
                      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                      },
                    }}
                  >
                    Try Again
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    onClick={this.handleReload}
                    sx={{
                      color: '#ff6b35',
                      borderColor: '#ff6b35',
                      fontWeight: 'bold',
                      px: 3,
                      py: 1.5,
                      borderRadius: '25px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        borderColor: '#ff6b35',
                        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.2)',
                      },
                    }}
                  >
                    Reload Page
                  </Button>
                </motion.div>
              </Box>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box sx={{ mt: 4, textAlign: 'left' }}>
                  <Typography variant="h6" sx={{ color: '#ff6b35', mb: 2 }}>
                    Error Details (Development Mode):
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 107, 53, 0.3)',
                      borderRadius: '10px',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      color: '#ff9999',
                      maxHeight: '200px',
                      overflow: 'auto',
                    }}
                  >
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
