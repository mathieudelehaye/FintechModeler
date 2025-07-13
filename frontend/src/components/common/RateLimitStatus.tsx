import React from 'react';
import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import { useRateLimiter } from '../../hooks/useRateLimiter';

export const RateLimitStatus: React.FC = () => {
  const { canMakeRequest, secondsUntilNext } = useRateLimiter();

  if (canMakeRequest) {
    return (
      <Chip 
        label="API Ready" 
        color="success" 
        size="small" 
        variant="outlined"
      />
    );
  }

  const progress = ((60 - secondsUntilNext) / 60) * 100;

  return (
    <Box sx={{ minWidth: 120 }}>
      <Typography variant="caption" color="text.secondary">
        Rate limit: {secondsUntilNext}s
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ mt: 0.5, height: 4 }}
      />
    </Box>
  );
};