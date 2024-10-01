// This file will be run when the export "auth" is required by other file, so no need to run this js file seperately

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";

// The unique firebaseConfiguration json for the project
const firebaseConfig = {
    apiKey: "AIzaSyDhcs7seSxsRF1pEeZ8MP4wCbhAD8f-EVg",
    authDomain: "personal-alexkkm.firebaseapp.com",
    databaseURL: "https://personal-alexkkm-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "personal-alexkkm",
    storageBucket: "personal-alexkkm.appspot.com",
    messagingSenderId: "114573113653",
    appId: "1:114573113653:web:11c38d24126106a2ad347c",
    measurementId: "G-BKST8M54FH"
};

// Initialize the firebase service
const FirebaseApp = initializeApp(firebaseConfig);

// Create the "auth" object for firebase authentication serivce by using fireabse service instance "FirebaseApp" at above line
const auth = getAuth(FirebaseApp)

// Create the "firestoreDB" object for firebase Firestore serivce by using fireabse service instance "FirebaseApp" at above line
const firestoreDB = getFirestore(FirebaseApp);

const database = getDatabase(FirebaseApp);

// Pack the "auth" and "firestoreDB" into one singal object "firebaseTools" for exporting
const firebaseTools = { auth, firestoreDB, database }
// Export the object so that other file can use the objects
export default firebaseTools;