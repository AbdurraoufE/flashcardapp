'use client'

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { db } from "@/firebase"
import { firestore } from '../../firebase'
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material'
import { useRouter } from "next/navigation"
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore'

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [inputText, setInputText] = useState('') // Use inputText for the input field
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [error, setError] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    const handleSubmit = async () => {
        setIsFetching(true)
        setError(null)

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: inputText }), // Pass inputText here
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(errorText)
            }

            const data = await res.json()
            setFlashcards(data)
        } catch (err) {
            setError(err.message || "Something went wrong, please try again.")
        } finally {
            setIsFetching(false)
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert("Please enter a collection name")
            return
        }
        if (!user || !user.id) {
            alert("Create an account or log in to save your flashcards!")
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)
        
        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists.")
                return
            } else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
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
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)} // Update inputText on input change
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
                    disabled={isFetching} // Disable button when fetching
                >
                    {isFetching ? 'Generating...' : 'Generate Flashcards'}
                </Button>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' color='secondary' onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}
            <Dialog 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle id="dialog-title">Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        Please enter a name for your collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={saveFlashcards}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
