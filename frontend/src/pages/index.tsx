import { Box, Container, Typography } from '@mui/material';
import FeatureTabs from '../components/FeatureTabs';

export default function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <FeatureTabs />
      </Container>
      <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="textSecondary">
          © Mathieu Delehaye 2025
        </Typography>
      </Box>
    </Box>
  );
}