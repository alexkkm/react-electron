// react package
import React, { useState, useEffect } from 'react';

// firebase package
import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";

// the "auth" is used for the functions from package "firebase/auth"
import firebaseTools from "../assets/firebase";
import firebaseImagePath from "../assets/firebase-Icon.png";
import Button from './Button';
import "./FirebasePage.css";
import Dropdown from './Dropdown';

const FirebasePage = () => {
    // Write to Realtime Database
    const writeData = async (path, content) => {
        await set(ref(firebaseTools.database, path), content);
        console.log("Success");
    };

    const readData = async (path) => {
        const databaseReference = ref(firebaseTools.database);
        get(child(databaseReference, path)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div className="firebasePage">
            <img src={firebaseImagePath} className="firebaseImage" />
            <p>Trying the real firebase page</p>
            <div className="Table">
                <NestedTable />
            </div>
            <Button label={"Back to last page"} onClick={() => window.history.back()} />
        </div>
    );
};

export default FirebasePage;

// Nested Table
const NestedTable = () => {
    const [data, setData] = useState({});
    const [newFieldInputs, setNewFieldInputs] = useState({});
    const [editStates, setEditStates] = useState({});
    const [newFieldType, setNewFieldType] = useState({});
    const [jsonFields, setJsonFields] = useState({});
    const [selectedTypes, setSelectedTypes] = useState({});

    useEffect(() => {
        const fetchAllDataFromFirebase = async () => {
            const databaseReference = ref(firebaseTools.database);
            const path = "/";
            try {
                const snapshot = await get(child(databaseReference, path));
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setData(snapshot.val());
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchAllDataFromFirebase();
    }, []);

    // Function to add a new field of type object
    const handleAddObjectField = async (path) => {
        if (jsonFields[path]) {
            const updatedData = { ...data };
            const keys = path.split('/');
            const lastKey = keys.pop();
            const parentObject = keys.reduce((obj, key) => obj[key], updatedData);

            if (!parentObject[lastKey]) {
                parentObject[lastKey] = {};
            }

            parentObject[lastKey] = { ...parentObject[lastKey], ...jsonFields[path] };
            setData(updatedData);
            await set(ref(firebaseTools.database, path), parentObject[lastKey]);

            alert("Successfully added object field");
            setNewFieldInputs(prev => ({
                ...prev,
                [path]: { newField: '', newValue: '' }
            }));
            setJsonFields(prev => ({
                ...prev,
                [path]: {}
            }));
        }
    };

    const handleDeleteField = async (path) => {
        const databaseReference = ref(firebaseTools.database);
        const keys = path.split('/');
        const parentPath = keys.slice(0, -1).join('/');
        const fieldNameToDelete = keys[keys.length - 1];

        const parentSnapshot = await get(child(databaseReference, parentPath));
        if (parentSnapshot.exists()) {
            const parentData = parentSnapshot.val();
            delete parentData[fieldNameToDelete];
            if (Object.keys(parentData).length === 0) {
                alert("Parent object will remain as it has no fields left.");
                return;
            }
        }

        await remove(child(databaseReference, path))
            .then(() => {
                console.log("Data deleted successfully");
                alert("Successfully deleted");
                setData(prevData => {
                    const updatedData = { ...prevData };
                    const parentKeys = path.split('/').slice(0, -1);
                    let parent = updatedData;
                    for (const key of parentKeys) {
                        parent = parent[key];
                    }
                    delete parent[fieldNameToDelete];
                    return updatedData;
                });
            })
            .catch((error) => {
                console.error("Error deleting data:", error);
            });
    };

    const handleEditField = async (path, newFieldName, editValue, selectedType) => {
        if (newFieldName !== undefined && editValue !== undefined) {
            const updatedData = { ...data };
            const keys = path.split('/');
            const lastKey = keys.pop();
            const parentObject = keys.reduce((obj, key) => obj[key], updatedData);

            if (!parentObject[lastKey]) {
                console.error("Parent path does not exist in updatedData:", path);
                return;
            }

            if (selectedType === 'number') {
                editValue = Number(editValue);
            }

            if (newFieldName !== lastKey) {
                delete parentObject[lastKey];
            }
            parentObject[newFieldName] = editValue;

            setData(updatedData);

            try {
                await set(ref(firebaseTools.database, path), editValue);
                alert("Successfully updated");
                window.location.reload();
            } catch (error) {
                console.error("Error editing field:", error);
                alert("Failed to edit field. Please try again.");
            }
        } else {
            console.error("Invalid input: newFieldName or editValue is undefined");
        }
    };

    const handleMoreClick = (key) => {
        setEditStates(prev => ({
            ...prev,
            [key]: { ...prev[key], visible: !prev[key]?.visible, field: prev[key]?.field || '', value: prev[key]?.value || '' }
        }));
    };

    const handleEditChange = (path, field, value) => {
        setEditStates((prev) => ({
            ...prev,
            [path]: {
                ...prev[path],
                [field]: value
            }
        }));
    };

    const handleFieldAdd = async (path, newFieldName, newFieldValue) => {
        if (newFieldInputs[path]?.newField && newFieldType[path]) {
            const updatedData = { ...data };
            const keys = path.split('/');
            const lastKey = keys.pop();
            const parentObject = keys.reduce((obj, key) => obj[key], updatedData);

            if (!parentObject[lastKey]) {
                parentObject[lastKey] = {};
            }

            if (newFieldType[path] === "object") {
                if (!parentObject[lastKey][newFieldName]) {
                    parentObject[lastKey][newFieldName] = {};
                }
                parentObject[lastKey][newFieldName] = { ...jsonFields[path] };
            } else {
                parentObject[lastKey][newFieldName] = newFieldValue;
            }

            setData(updatedData);
            await set(ref(firebaseTools.database, "/"), updatedData);

            alert("Successfully added");
            setNewFieldInputs(prev => ({
                ...prev,
                [path]: { newField: '', newValue: '' }
            }));
        }
    };

    const renderAddFieldRow = (parentKey) => {
        return (
            <tr>
                <td>
                    <input
                        type="text"
                        placeholder="新欄位名稱"
                        value={newFieldInputs[parentKey]?.newField || ''}
                        onChange={(e) => setNewFieldInputs(prev => ({
                            ...prev,
                            [parentKey]: { ...prev[parentKey], newField: e.target.value }
                        }))}
                    />
                </td>
                <td>
                    <Dropdown
                        options={[
                            { value: '', label: 'Select Type' },
                            { value: 'string', label: 'String' },
                            { value: 'number', label: 'Number' },
                            { value: 'object', label: 'Object (JSON)' },
                        ]}
                        onChange={(e) => {
                            const selectedType = e.target.value;
                            setNewFieldType(prev => ({
                                ...prev,
                                [parentKey]: selectedType
                            }));
                            if (selectedType !== "object") {
                                setJsonFields(prev => ({
                                    ...prev,
                                    [parentKey]: {}
                                }));
                            }
                        }}
                    />
                    {newFieldType[parentKey] === "object" && (
                        <>
                            <br />
                            <p>Please enter data after creating the JSON first</p>
                        </>
                    )}
                    {newFieldType[parentKey] !== "object" && (
                        <input
                            type="text"
                            placeholder="新值"
                            value={newFieldInputs[parentKey]?.newValue || ''}
                            onChange={(e) => setNewFieldInputs(prev => ({
                                ...prev,
                                [parentKey]: { ...prev[parentKey], newValue: e.target.value }
                            }))}
                        />
                    )}
                    <Button
                        label="加入"
                        onClick={() => handleFieldAdd(parentKey, newFieldInputs[parentKey]?.newField, newFieldInputs[parentKey]?.newValue)}
                    />
                </td>
            </tr>
        );
    };

    const renderTable = (obj, parentKey) => {
        return (
            <div style={{ marginBottom: '20px' }}>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {Object.entries(obj).map(([key, value]) => {
                            const currentPath = `${parentKey}/${key}`;

                            return (
                                <tr key={key}>
                                    <td>
                                        {key}
                                        <Button label="More" onClick={() => handleMoreClick(currentPath)} />
                                    </td>
                                    <td>
                                        {typeof value === 'object' && value !== null ? (
                                            renderTable(value, currentPath)
                                        ) : (
                                            <span>{value}</span>
                                        )}
                                        {editStates[currentPath]?.visible && (
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="修改欄位名稱"
                                                    value={editStates[currentPath]?.field || ''}
                                                    onChange={(e) => handleEditChange(currentPath, 'field', e.target.value)}
                                                    style={{ marginBottom: '10px' }}
                                                />
                                                <Dropdown
                                                    options={[
                                                        { value: '', label: 'Select Type' },
                                                        { value: 'string', label: 'String' },
                                                        { value: 'number', label: 'Number' },
                                                        { value: 'object', label: 'Object (JSON)' },
                                                    ]}
                                                    value={selectedTypes[currentPath] || ''}
                                                    onChange={(e) => setSelectedTypes(prev => ({
                                                        ...prev,
                                                        [currentPath]: e.target.value
                                                    }))}
                                                />

                                                {selectedTypes[currentPath] === 'object' ? (
                                                    <div>
                                                        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="2">
                                                                        <h4>Enter JSON Key-Value Pairs:</h4>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="New Key"
                                                                            onChange={(e) => {
                                                                                const newKey = e.target.value;
                                                                                handleEditChange(currentPath, 'newKey', newKey);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="New Value"
                                                                            onChange={(e) => {
                                                                                const newValue = e.target.value;
                                                                                const newKey = editStates[currentPath]?.newKey;
                                                                                const updatedValue = { ...editStates[currentPath]?.value, [newKey]: newValue };
                                                                                handleEditChange(currentPath, 'value', updatedValue);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder="修改值"
                                                        value={editStates[currentPath]?.value || ''}
                                                        onChange={(e) => handleEditChange(currentPath, 'value', e.target.value)}
                                                    />
                                                )}
                                                <Button label="刪除" onClick={() => handleDeleteField(currentPath)} />
                                                <Button label="提交修改" onClick={() => handleEditField(currentPath, editStates[currentPath]?.field, editStates[currentPath]?.value, selectedTypes[currentPath])} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {renderAddFieldRow(parentKey)}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', paddingTop: '10px' }}>Firebase Realtime Database</h1>
            {Object.keys(data).length === 0 ? (
                <p>Loading data...</p>
            ) : (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {Object.entries(data).map(([key, value]) => (
                            <tr key={key}>
                                <td>
                                    {key}
                                    <Button label="More" onClick={() => handleMoreClick(key)} />
                                </td>
                                <td>
                                    {renderTable(value, key)}
                                </td>
                            </tr>
                        ))}
                        {renderAddFieldRow('/')}
                    </tbody>
                </table>
            )}
        </div>
    );
};