// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage, ref } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,
  
  apiKey: "AIzaSyDTwOIQ5op9CMGjFdwAoacEeGopzprU3Os",
  authDomain: "fir-test-fb768.firebaseapp.com",
  projectId: "fir-test-fb768",
  storageBucket: "fir-test-fb768.appspot.com",
  messagingSenderId: "793028181278",
  appId: "1:793028181278:web:4621c60edb56749530dd0f",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
// Create a root reference
export const storage = getStorage()
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore()
