import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Collapse,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Calculate as CalculateIcon,
  ShowChart as ShowChartIcon,
  ExpandLess,
  ExpandMore,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
  onSectionChange: (section: string) => void;
  currentSection: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onSectionChange,
  currentSection,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    'derivative-pricing': true,
    'market-data': true,
  });
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionToggle = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const menuItems = [
    {
      id: 'derivative-pricing',
      text: 'Derivative Pricing',
      icon: <CalculateIcon />,
      subItems: [
        { id: 'price', text: 'Option Price', icon: <TrendingUpIcon />, description: 'Black-Scholes & Binomial' },
        { id: 'volatility', text: 'Volatility', icon: <AnalyticsIcon />, description: 'Implied Volatility Calculator' },
      ],
    },
    {
      id: 'market-data',
      text: 'Market Data',
      icon: <ShowChartIcon />,
      subItems: [
        { id: 'live-prices', text: 'Live Prices', icon: <TrendingUpIcon />, description: 'Real-time stock quotes' },
        { id: 'time-series', text: 'Time Series', icon: <TimelineIcon />, description: 'Historical price charts' },
      ],
    },
  ];

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'price': return 'Option Pricing Calculator';
      case 'volatility': return 'Volatility Analysis';
      case 'live-prices': return 'Live Market Data';
      case 'time-series': return 'Time Series Analysis';
      default: return 'Fintech Modeler';
    }
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
      }}>
        <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
          📈
        </Avatar>
        <Box>
          <Typography variant="h6" noWrap component="div">
            Fintech Modeler
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Professional Trading Tools
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleSectionToggle(item.id)}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    variant: 'subtitle2',
                  }}
                />
                {openSections[item.id] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openSections[item.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.id} disablePadding>
                    <ListItemButton
                      sx={{ 
                        pl: 4, 
                        py: 1,
                        borderRadius: '0 20px 20px 0',
                        mr: 1,
                        backgroundColor: currentSection === subItem.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                        borderRight: currentSection === subItem.id ? `3px solid ${theme.palette.primary.main}` : 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                      selected={currentSection === subItem.id}
                      onClick={() => onSectionChange(subItem.id)}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 36,
                        color: currentSection === subItem.id ? theme.palette.primary.main : 'inherit',
                      }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={subItem.text}
                        secondary={subItem.description}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: currentSection === subItem.id ? 600 : 400,
                          color: currentSection === subItem.id ? theme.palette.primary.main : 'inherit',
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            {getSectionTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;