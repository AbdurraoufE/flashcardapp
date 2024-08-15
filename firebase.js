import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIE9-fHgT27oIOP0MDZW3X8ctFHBaU1qU",
  authDomain: "flashcardapp-f5368.firebaseapp.com",
  projectId: "flashcardapp-f5368",
  storageBucket: "flashcardapp-f5368.appspot.com",
  messagingSenderId: "190871091541",
  appId: "1:190871091541:web:c295a1a758f1c9dc4857dc",
  measurementId: "G-7FZL08HY9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

let analytics;
if (typeof analytics !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}
export { db, analytics };