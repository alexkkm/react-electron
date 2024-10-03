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

            <div className="Table">
                <NestedTable />
            </div>


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


const NestedTable = () => {
    /*
    const data = [
        {
            name: "Alex",
            information: { scores: { Chinese: 82, English: 83 }, result: "Pass" }
        },
        {
            name: "Wingy",
            information: { scores: { Chinese: 70, English: 99 }, result: "Pass" }
        }
    ];

    */
    const [data, setData] = useState([{
        name: "Alex",
        information: { scores: { Chinese: 82, English: 83 }, result: "Pass" }
    },
    {
        name: "Wingy",
        information: { scores: { Chinese: 70, English: 99 }, result: "Pass" }
    }]);

    useEffect(() => {
        // create a reference to the Firebase Realtime Database
        const databaseReference = ref(firebaseTools.database);
        const path = "users";
        // use get() for reading
        get(child(databaseReference, path)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            }
        })
    })



    return (
        <div>
            <h1>Nested Table Example</h1>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {Object.keys(data[1]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>
                                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>Scores</th>
                                            <th>Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <tbody>
                                                        {Object.keys(item.information.scores).map((subject) => (
                                                            <tr key={subject}>
                                                                <td>{subject}</td>
                                                                <td>{item.information.scores[subject]}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td>{item.information.result}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};