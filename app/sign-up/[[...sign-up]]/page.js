import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Box
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #ffffff, #1a73e8)'  /* Gradient background for the whole page */
      }}
    >
    <Container maxWidth="sm">
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#000', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard App
          </Typography>
          <Button color="inherit" sx={{ '&:hover': { backgroundColor: '#333' } }}>
            <Link href="/sign-in" passHref>
              Sign In
            </Link>
          </Button>
          <Button color="inherit" sx={{ '&:hover': { backgroundColor: '#333' } }}>
            <Link href="/sign-up" passHref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sign-Up Section */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ 
          textAlign: 'center', 
          my: 4,
          background: 'linear-gradient(135deg, #ffffff, #1a73e8)',
          width: '100%',       // Make the inner box take the full width of the container
          maxWidth: '100%'     // Ensure it doesn't exceed the container width
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <Box 
          sx={{
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '16px', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
            width: '100%', 
            maxWidth: '500px'
          }}
        >
        <SignUp />
      </Box>
      </Box>
    </Container>
  </Box>
  );
}
