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
import DescriptionIcon from "@mui/icons-material/Description"
import CreateIcon from "@mui/icons-material/Create"
import SearchIcon from "@mui/icons-material/Search"
import PublicIcon from "@mui/icons-material/Public"
import Head from "next/head"

export default function Home() {
  const handleSubmit = async () => {
    try {
      // fetch the checkout session from server
      const response = await fetch("/api/checkout_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Origin: "https://aiflashcardapp.vercel.app/",
        },
      })

      // Handle non-OK response status
      if (!response.ok) {
        const errorText = await response.text() // Get error details if available
        throw new Error(`Network response was not ok: ${errorText}`)
      }

      // Parse JSON response
      const checkoutSessionJson = await response.json()

      // Ensure the session ID is present
      if (!checkoutSessionJson.id) {
        throw new Error("No session ID returned from the server")
      }

      // Initialize Stripe
      const stripe = await getStripe()

      // Redirect to Checkout with the session ID
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      })

      // Handle any errors that occur during redirect
      if (error) {
        console.warn("Error during redirectToCheckout:", error.message)
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error.message)
    }
  }

  return (
    <>
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
          margin: 0;
          background: linear-gradient(
            to bottom right,
            white 80%,
            #e0f7fa 70%
          ); /* Full page color */
          overflow-x: hidden; /* Prevents horizontal scrolling */
        }
        body {
          display: flex;
          flex-direction: column;
        }
        #__next {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .gradient-background {
          background: (white); /* Apply color to the box */
        }
        .appbar-background {
          background-color: black; /* Set background color to black for AppBar */
        }
        .title {
          font-weight: bold;
          color: #000000;
          text-shadow: 0 0 25px rgba(128, 0, 128, 0.9); /* Purple glow effect */
        }
        .info-card {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for depth */
          transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition */
          border: 2px solid #1d3557; /* Border to make the card pop */
          border-radius: 8px;
          background-color: #e0e0e0; /* Ensure background color for the card */
        }
        .info-card:hover {
          transform: scale(1.1); /* Grow effect on hover */
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Enhanced shadow on hover */
        }
        .pricing-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border: 2px solid #1d3557; /* Border to make the card pop */
          border-radius: 8px;
          background-color: #e0e0e0;
        }
        .pricing-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        .mui-icon {
          color: black; /* Set icon color to black */
        }
      `}</style>
      <Box
        sx={{
          minHeight: "100vh", // Ensures the Box covers the full viewport height
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container
          maxWidth="lg"
          className="gradient-background"
          sx={{ flexGrow: 1 }}
        >
          <Head>
            <title>Flashcard App</title>
            <meta name="description" content="Create flashcards" />
          </Head>
          <AppBar position="static" className="appbar-background">
            <Toolbar>
              <DescriptionIcon
                edge="start"
                color="inherit"
                aria-label="flashcard"
                sx={{ mr: 2 }}
              />
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
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              className="title"
            >
              Welcome to Flashcard App
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              The easiest way to create flashcards from your text
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                mr: 2,
                "&:hover": {
                  backgroundColor: "#004080", // Darker shade of blue for hover
                  transform: "scale(1.05)", // Grow effect
                },
              }}
              href="/generate"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                mt: 2,
                bgcolor: "white",
                color: "#1d3557",
                "&:hover": {
                  backgroundColor: "#f1f1f1", // Light gray background for hover
                  borderColor: "#004080", // Darker border color for hover
                  color: "#004080", // Darker text color for hover
                  transform: "scale(1.05)", // Grow effect
                },
              }}
            >
              Learn More
            </Button>
          </Box>

          {/* Features Section */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Box
                className="info-card"
                sx={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <CreateIcon fontSize="large" className="mui-icon" />
                <Typography variant="h6" component="h3" gutterBottom>
                  Easy Flashcard Creation
                </Typography>
                <Typography>
                  Quickly create flashcards from your text with our intuitive
                  interface.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                className="info-card"
                sx={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <SearchIcon fontSize="large" className="mui-icon" />
                <Typography variant="h6" component="h3" gutterBottom>
                  Advanced Search
                </Typography>
                <Typography>
                  Easily search through your flashcards with our powerful search
                  functionality.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                className="info-card"
                sx={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                }}
              >
                <PublicIcon fontSize="large" className="mui-icon" />
                <Typography variant="h6" component="h3" gutterBottom>
                  Collaborative Study
                </Typography>
                <Typography>
                  Share your flashcards with friends and study together online.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Pricing Section */}
        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card className="pricing-card">
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Normal Plan
                  </Typography>
                  <Typography variant="h6" component="p">
                    $5 / month
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      "&:hover": {
                        backgroundColor: "#004080", // Darker shade of blue for hover
                        transform: "scale(1.05)", // Grow effect
                      },
                    }}
                  >
                    Choose Normal
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="pricing-card">
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
                    onClick={handleSubmit}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{
                      "&:hover": {
                        backgroundColor: "#003d6a", // Darker shade for hover
                        transform: "scale(1.05)", // Grow effect
                      },
                    }}
                  >
                    Choose Pro
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
