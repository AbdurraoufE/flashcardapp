import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import DescriptionIcon from '@mui/icons-material/Description';

export default function SignUpPage() {
  return (
    <Box
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, white 80%, #e0f7fa 70%)'  /* Gradient background for the whole page */
      }}
    >
    <Container maxWidth="sm">
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#000', boxShadow: 'none' }}>
        <Toolbar>
          <DescriptionIcon edge="start" color="inherit" aria-label="flashcard" sx={{ mr: 2 }} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
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
        sx={{ textAlign: 'center', my: 4 }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            color: 'black',
            textShadow: '0px 0px 10px #800080', // Purple glow effect
            fontWeight: 'bold',
          }}
          >
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Container>
  </Box>
  );
}
