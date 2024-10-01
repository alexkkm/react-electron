// react package
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

// firebase package
import { getDatabase, ref, set, get, child } from "firebase/database";

// the "auth" is used for the functions from package "firebase/auth"
import firebaseTools from "../assets/firebase"

import firebaseImagePath from "../assets/firebase-Icon.png";

import "./FirebasePage.css";

const NewFirebasePage = () => {

    // Write to Realtime Database
    const writeData = async (path, content) => {
        // use set() for writing
        await set(ref(firebaseTools.database, path), content);  //use getDatabase() to replace firebasetools.database here is also fine
        console.log("Success")
    }

    const readData = async (path) => {
        // create a reference to the Firebase Realtime Database
        const databaseReference = ref(firebaseTools.database);
        // use get() for reading
        get(child(databaseReference, path)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    useEffect(() => {

    })

    return (
        <div className="firebasePage">
            <img src={firebaseImagePath} className="firebaseImage" />
            <p>Trying the real firebase page</p>
            <button onClick={
                () => writeData("users/Wingy", {
                    username: "Wingy",
                    email: "wingy64@gmail.com",
                })}>Write</button>
            <button onClick={
                () => writeData("users/Alex", {
                    username: "Alex Kong",
                    email: "kwaiman.kong@gmail.com",
                })}>Write Alex</button>
            <button onClick={() => readData("/")}>get Documents</button>
        </div>
    );
};

export default NewFirebasePage;


const listAllCollection = async () => {
    readData("/")
}
