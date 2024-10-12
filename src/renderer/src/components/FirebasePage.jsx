// react package
import React, { useState, useEffect } from 'react';

// firebase package
import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";

import firebaseTools from "../assets/firebase";

import firebaseImagePath from "../assets/firebase-Icon.png";
import Button from './Button';
import "./FirebasePage.css";
import Dropdown from './Dropdown';

// Example of basic operation in firebase realtime database
const BasicOperation = () => {
    // Write to Realtime Database
    const writeData = async (path, content) => {
        await set(ref(firebaseTools.database, path), content);
        console.log("Success to write the path:" + path);
    };

    // Read from Realtime Database with given path
    const readData = async (path) => {
        const databaseReference = ref(firebaseTools.database);
        get(child(databaseReference, path)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        })
    };

    // Update data from Realtime Database with given content
    const updateData = async (path, content) => {
        await update(ref(firebaseTools.database, path), content);
        console.log("Successfully updated the path:" + path);
    }

    // Delete data from Realtime Database with given path
    const deleteData = async (path) => {
        await remove(ref(firebaseTools.database, path));
        console.log("Data from the path:" + (path) + " has been deleted successfully");
    }
}

// Nested Table for firebase realtime database display
const NestedTable = () => {
    const [data, setData] = useState({});
    const [newFieldInputs, setNewFieldInputs] = useState({});
    const [editStates, setEditStates] = useState({});
    const [newFieldType, setNewFieldType] = useState({});
    const [jsonFields, setJsonFields] = useState({});
    const [selectedTypes, setSelectedTypes] = useState({});

    useEffect(() => {
        // fetch all data from firebase for operation
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

    // delete field based on given path
    const handleDeleteField = async (path) => {
        const databaseReference = ref(firebaseTools.database);
        const keys = path.split('/');   // split the path into an array of keys
        const parentPath = keys.slice(0, -1).join('/'); // get the parent path from remove the last key from the "keys" array
        const fieldNameToDelete = keys[keys.length - 1];    // get the last key as the field name to delete

        // get a snapshot of the parent object
        const parentSnapshot = await get(child(databaseReference, parentPath));
        if (parentSnapshot.exists()) {
            // copy the parent object from the snapshot
            const parentData = parentSnapshot.val();
            // delete the field from the parent object
            delete parentData[fieldNameToDelete];
            if (Object.keys(parentData).length === 0) {
                // Delete the parent object also if it is empty
                await remove(child(databaseReference, parentPath));
                console.log("Parent object deleted successfully");
            }
        }

        // delete the field in the realtime database
        await remove(child(databaseReference, path))
            .then(() => {
                console.log("Data deleted successfully");
                alert("Successfully deleted");
                // Update the local data "Data" based on the action of deleting field
                setData(previousData => {
                    const updatedData = { ...previousData };
                    const parentKeys = path.split('/').slice(0, -1);
                    let parent = updatedData;
                    for (const key of parentKeys) {
                        parent = parent[key];
                    }
                    if (parent) {
                        delete parent[fieldNameToDelete];
                        // Check if the parent object is empty,
                        if (Object.keys(parent).length === 0) {
                            // Delete the parent object also from the local data "Data" if it is empty
                            const grandParentKeys = parentKeys.slice(0, -1);
                            let grandParent = updatedData;
                            for (const key of grandParentKeys) {
                                grandParent = grandParent[key];
                            }
                            delete grandParent[parentKeys[parentKeys.length - 1]];
                        }
                    }
                    return updatedData;
                });
            })
            .catch((error) => {
                console.error("Error deleting data:", error);
            });
    };

    // update the [fieldame, value and type] of the field based on given path
    const handleEditField = async (path, newFieldName, editValue, selectedType) => {
        if (newFieldName !== undefined && editValue !== undefined) {
            const updatedData = { ...data };
            const keys = path.split('/');
            const lastKey = keys.pop();
            const parentObject = keys.reduce((obj, key) => obj[key], updatedData);

            // check if the parent object exists, if not, return
            if (!parentObject[lastKey]) {
                console.error("Parent path does not exist in updatedData:", path);
                return;
            }
            // check if the selected type is a number, then convert the "editValue" to a number
            if (selectedType === 'number') {
                editValue = Number(editValue);
            }

            //check if the newFieldName is differnent from the last key, then delete the last key,
            if (newFieldName !== lastKey) {
                delete parentObject[lastKey];
            }
            // assume the newFieldName is the same as the last key, then update the value of the field with the "editValue",
            // if the newFieldName is not the same as the last key, the lastkey has already been deleted, so add the new field with name "newFieldName" , and assign the value of the field with the "editValue"
            parentObject[newFieldName] = editValue;

            // Update the local data "Data" based on the action of editing field
            setData(updatedData);

            // update the field in the realtime database
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

    // toggle the visibility of the more button
    const handleMoreClick = (key) => {
        // if the more button of the "key" is visible, then hide it, else show it
        setEditStates(prev => ({
            ...prev,
            [key]: { ...prev[key], visible: !prev[key]?.visible, field: prev[key]?.field || '', value: prev[key]?.value || '' }
        }));
    };

    // handle the change of the input field
    const handleEditChange = (path, field, value) => {
        setEditStates((prev) => ({
            ...prev,
            [path]: {
                ...prev[path],
                [field]: value
            }
        }));
    };

    // add a new field when the button "Add" is clicked
    const handleFieldAdd = async (path, newFieldName, newFieldValue) => {
        // check if the newFieldName and newFieldValue are not empty
        if (newFieldInputs[path]?.newField && newFieldType[path]) {
            const updatedData = { ...data };
            const keys = path.split('/');
            const lastKey = keys.pop();
            const parentObject = keys.reduce((obj, key) => obj[key], updatedData);

            // check if the parent object exists, if not, create it
            if (!parentObject[lastKey]) {
                parentObject[lastKey] = {};
            }

            // check if the newFieldType is an object, then create a new field with name "newFieldName" and assign the object "newFieldValue" as the value of the field
            if (newFieldType[path] === "object") {
                //assume the newFieldName is the same as the last key, then update the value of the field with the "newFieldValue",
                // if the newFieldName is not the same as the last key, add the new field with name "newFieldName"
                if (!parentObject[lastKey][newFieldName]) {
                    parentObject[lastKey][newFieldName] = {};
                }
                parentObject[lastKey][newFieldName] = { ...jsonFields[path] };
            }
            // else, the newFiledType is not an object, then create a new field with name "newFieldName" and directly assign the value of the field with the "newFieldValue"
            else {
                parentObject[lastKey][newFieldName] = newFieldValue;
            }

            // Update the local data "Data" based on the action of adding field
            setData(updatedData);
            // update the field in the realtime database
            await set(ref(firebaseTools.database, "/"), updatedData);
            // alert the user that the action of adding field is completed
            alert("Successfully added");
            // reset the input fields after the action of adding field completed
            setNewFieldInputs(prev => ({
                ...prev,
                [path]: { newField: '', newValue: '' }
            }));
        } else {
            console.error("Invalid input: newFieldName or newFieldValue is undefined");
        }
    };

    // render the add field row wiht the given parentKey, so that it can use setNewFieldInputs(), setNewFieldType(), setJsonFields() normally according to the "parentKey"
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

    // render the table with given object "obj" and path "parentKey"
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

// Page for firebase operation
const FirebasePage = () => {
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