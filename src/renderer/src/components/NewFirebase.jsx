// react package
import React, { useState, useEffect } from 'react'
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
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchAllDataFromFirebase = () => {
            const databaseReference = ref(firebaseTools.database);
            const path = "/";

            get(child(databaseReference, path)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setData(snapshot.val());
                }
            });
        };
        fetchAllDataFromFirebase();
    }, []);

    const renderTable = (obj) => {
        return (
            <div style={{ marginBottom: '20px' }}>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {Object.entries(obj).map(([key, value]) => (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>
                                    {typeof value === 'object' && value !== null ? (
                                        renderTable(value) // 递归渲染嵌套表格
                                    ) : (
                                        <span>{value}</span> // 如果不是对象则显示值
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', paddingTop: '10px' }}>Firebase Realtime Database</h1>
            {Object.keys(data).length === 0 ? ( // 检查数据是否为空
                <p>Loading data...</p>
            ) : (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {Object.entries(data).map(([key, value]) => (
                            <tr key={key}>
                                <td>{key}</td> {/* 第一层字段名作为行显示 */}
                                <td>
                                    {renderTable(value)} {/* 渲染每个字段的内容 */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};