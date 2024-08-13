'use client'

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { useRouter } from "next/router"
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
  } from '@mui/material'

export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter

    const handleSubmit = async () => {
        fetch('/api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res)=>res.json())
            .then((data)> setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
    }
    
    const handleOpen = () => {
        setOpenI(true)
    }
        
    const handleClose = () => {
        setOpenI(false)
    }
    
    const saveFlashcards = async () => {
        if (!name) {
            alert("Please enter a name")
            return 
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f)=> f.name === name)){
                alert("Flashcard collection with the same name already exists.")
                return
            }
            else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard)=>{
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef,flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Generate Flashcards
            </Typography>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Generate Flashcards
            </Button>
          </Box>
          
          {/* We'll add flashcard display here */}
        </Container>
      )
}