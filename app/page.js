"use client"
import Image from "next/image"
import getStripe from "@/utils/get-stripe"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material" // Added necessary imports
import Head from "next/head"

export default function Home() {
  const handleSubmit = async () => {
    try {
      // fetch the checkout session from server
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
        },
      });
  
      // Handle non-OK response status
      if (!response.ok) {
        const errorText = await response.text(); // Get error details if available
        throw new Error(`Network response was not ok: ${errorText}`);
      }
  
      // Parse JSON response
      const checkoutSessionJson = await response.json();
  
      // Ensure the session ID is present
      if (!checkoutSessionJson.id) {
        throw new Error('No session ID returned from the server');
      }
  
      // Initialize Stripe
      const stripe = await getStripe();
  
      // Redirect to Checkout with the session ID
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });
  
      // Handle any errors that occur during redirect
      if (error) {
        console.warn('Error during redirectToCheckout:', error.message);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error.message);
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard App</title>
        <meta name="description" content="Create flashcards" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard App
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard App
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          href="/generate"
        >
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3">
                  Easy Flashcard Creation
                </Typography>
                <Typography variant="body1">
                  Quickly create flashcards from your text with our intuitive
                  interface.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3">
                  Advanced Search
                </Typography>
                <Typography variant="body1">
                  Easily search through your flashcards with our powerful search
                  functionality.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3">
                  Collaborative Study
                </Typography>
                <Typography variant="body1">
                  Share your flashcards with friends and study together online.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Normal Plan
                </Typography>
                <Typography variant="h6" component="p">
                  $5 / month
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth>
                  Choose Normal
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Pro Plan
                </Typography>
                <Typography variant="h6" component="p">
                  $10 / month
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleSubmit} //There is some error that occurs when this line is commented out, will fix later
                >
                  Choose Pro
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
