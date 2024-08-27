// react package
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

// firebase package
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'; // now firebase suugest to import the functions directly form the library, instead of import the object Auth() as oldest version of firebase
import { collection, getDocs, doc, setDoc, query, where, Timestamp } from "firebase/firestore"

// the "auth" is used for the functions from package "firebase/auth"
import firebaseTools from "../assets/firebase"


// Page of tutorials of firebase functions
const FirebasePage = () => {

    // parameters for add
    const addDocPath = "storage/document/newSubCollection";
    const addContent = {
        id: 1881,
        testField: "test Value"
    };

    // parmameters for delete
    const deleteDocPath = "storage/document/newSubCollection";
    const deleteFieldName = "testField";
    const deleteFieldOperatior = "==";
    const deleteFieldValue = "test Value";

    // parameters for search
    const searchDocPath = "storage/document/newSubCollection";
    const searchFieldName = "id";
    const searchFieldOperatior = "==";
    const searchFieldValue = 188123;

    return (
        <div>
            <p>List the firebase collections</p>
            <button onClick={() => addDocument(addDocPath, addContent)}>Add</button>
            <button onClick={() => deleteDocument(deleteDocPath, deleteFieldName, deleteFieldOperatior, deleteFieldValue)}>Delete</button>
            <button onClick={() => SearchDocument(searchDocPath, searchFieldName, searchFieldOperatior, searchFieldValue)}>Search</button>
            <button onClick={() => fetchDocument("storage/document/newSubCollection")}>Fetch</button>
            <button onClick={() => console.log("Test")}>Test</button>
        </div>
    );
}

export default FirebasePage

const addDocument = async (docPath, content) => {
    try {
        const newDocumentReference = await addDoc(collection(firebaseTools.firestoreDB, ...docPath.split("/")), content);
        console.log(newDocumentReference)
        alert("Added Document " + newDocumentReference.id)
    } catch (error) {
        console.log("Error: " + error)
    }
}

const deleteDocument = async (docPath, fieldName, fieldOperatior, fieldValue) => {
    try {
        console.log(...docPath.split("/"))
        const deleteQuery = query(
            collection(firebaseTools.firestoreDB, ...docPath.split("/")),
            where(fieldName, fieldOperatior, fieldValue)
        );
        // original Query
        /*
        const deleteQuery=query(collection(firebaseTools.firestoreDB, "storage", "document", "newSubCollection"), where('testField', '==', 1881));
        */
        const docSnap = await getDocs(deleteQuery);
        docSnap.forEach((doc) => {
            console.log(doc.ref);
            deleteDoc(doc.ref);
        });
        alert("Deleted Document")
    } catch (error) {
        console.log("Error: ", error);
    }
};

const SearchDocument = async (docPath, fieldName, fieldOperatior, fieldValue) => {
    try {
        const searchQuery = query(
            collection(firebaseTools.firestoreDB, ...docPath.split("/")),
            where(fieldName, fieldOperatior, fieldValue)
        );
        const docSnap = await getDocs(searchQuery);
        const docRefs = docSnap.docs.map((doc) => doc.ref);
        console.log(docRefs)
    } catch (error) {
        console.log("Error: ", error);
        return [];
    }
};

const fetchDocument = (docPath) => {
    try {
        getDocs(collection(firebaseTools.firestoreDB, ...docPath.split("/"))).then((collectionSnapShot) => {
            const fetching = collectionSnapShot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });
            console.log(fetching);
        });
    } catch (error) {
        console.log("Error: ", error);
    }

}