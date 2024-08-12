import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Typography, Container, AppBar, Toolbar, Button } from "@mui/material";
import Head from "next/head"; 

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard App</title>
        <meta name = "description" content="Create flashcards"/>
      </Head>
      <AppBar position = "static">
        <Toolbar>
          <Typography variant="h6">Flashcard App</Typography>
          <SignedOut>
            <Button> Login </Button>
            <Button> Sign Up </Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>
    </Container>
  );
}
