'use client';

import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

// Create emotion cache
const emotionCache = createCache({
  key: 'chakra',
  prepend: true
})

// Material-UI Theme
const muiTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#fafafa' },
    primary: { main: '#3182ce' },  // Matching Chakra blue.500
    secondary: { main: '#9c27b0' },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ChakraProvider value={defaultSystem}>
          <Component {...pageProps} />
        </ChakraProvider>
      </MuiThemeProvider>
    </CacheProvider>
  )
}