import { Box, Container, Typography } from '@mui/material';
import FeatureTabs from '../components/FeatureTabs';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'white',
      }}
    >
      {/* Main Content */}
      <Container>
        <FeatureTabs />
      </Container>

      {/* Footer */}
      <Box
        sx={{
          textAlign: 'center',
          py: 5,
          backgroundColor: '#ffffff',
          mt: 1,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; Mathieu Delehaye 2025
        </Typography>
      </Box>
    </Box>
  );
}
