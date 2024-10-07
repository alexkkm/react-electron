//TODO 
/*
1. fix the issue that when new parnet added, can give option to add table/ choose data type for its field
2. fix the issue of input field bug after a single successful operation
*/

// react package
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

// firebase package
import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";

// the "auth" is used for the functions from package "firebase/auth"
import firebaseTools from "../assets/firebase"

import firebaseImagePath from "../assets/firebase-Icon.png";

import Button from './Button';

import "./FirebasePage.css";

const FirebasePage = () => {

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
    const [newFieldInputs, setNewFieldInputs] = useState({}); // State for new field inputs
    const [editStates, setEditStates] = useState({}); // 用於儲存每行的編輯狀態


    const [newFieldType, setNewFieldType] = useState({}); // State for field types
    const [jsonFields, setJsonFields] = useState({}); // State for JSON fields

    // Fetch data from Firebase on component mount
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

            // Add the JSON object to the parent object
            parentObject[lastKey] = jsonFields[path];
            setData(updatedData);
            await set(ref(firebaseTools.database, path), parentObject[lastKey]);

            alert("Successfully added object field");
            setNewFieldInputs(prev => ({
                ...prev,
                [path]: { newField: '', newValue: '' }
            }));
            setJsonFields(prev => ({
                ...prev,
                [path]: {} // Reset for the specific key
            }));
            window.location.reload(); // Refresh the page
        }
    };

    const handleDeleteField = async (path) => {
        const databaseReference = ref(firebaseTools.database);
        const keys = path.split('/'); // Split the path
        const parentPath = keys.slice(0, -1).join('/'); // Get the parent path
        const fieldNameToDelete = keys[keys.length - 1]; // Get the last key (the field to delete)

        // Check if the parent has any other fields
        const parentSnapshot = await get(child(databaseReference, parentPath));
        if (parentSnapshot.exists()) {
            const parentData = parentSnapshot.val();
            delete parentData[fieldNameToDelete]; // Remove the field

            // Check if any fields remain in the parent object
            if (Object.keys(parentData).length === 0) {
                // If no fields left, do not delete the parent; alert the user if needed
                alert("Parent object will remain as it has no fields left.");
                return;
            }
        }

        // Proceed to remove the field
        await remove(child(databaseReference, path))
            .then(() => {
                console.log("Data deleted successfully");
                alert("Successfully deleted");
                // Update the local state without refreshing the page
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

    const handleEditField = async (path, newFieldName, editValue) => {
        if (newFieldName !== undefined && editValue !== undefined) {
            const updatedData = { ...data };
            const keys = path.split('/'); // 使用點來解析路徑
            const lastKey = keys.pop(); // 獲取當前鍵
            const parentPath = keys.join('.'); // 獲取父路徑

            // Accessing the value dynamically using parentPath and lastKey
            const parentObject = keys.reduce((obj, key) => obj[key], updatedData); // Navigate to the parent object

            // Function to update the value in the nested object
            function updateNestedObject(obj, keys, newFieldName, value) {
                const lastKey = keys.pop(); // Get the last key
                const parentObject = keys.reduce((accum, key) => accum[key], obj); // Navigate to the parent object

                // Check if the new field name is different
                if (newFieldName !== lastKey) {
                    // Delete the old key if it's different
                    delete parentObject[lastKey];
                    // Add the new field with the specified value
                    parentObject[newFieldName] = value;
                } else {
                    // If the names are the same, just update the value
                    parentObject[lastKey] = value;
                }
            }

            // 确保 parentPath 在 updatedData 中存在
            if (!parentObject[lastKey]) {
                console.error("Parent path does not exist in updatedData:", parentPath);
                return; // 若不存在，提前返回
            }

            // 僅更新當前鍵的值
            if (newFieldName !== lastKey) {
                // 如果新的欄位名稱不同於原來的，將原來的欄位刪除
                delete parentObject[lastKey];
                // Update the nested object using the function
                updateNestedObject(updatedData, keys.concat(lastKey), newFieldName, editValue); // Update the value
            } else {
                // 如果名稱沒有改變，則只更新值
                // Update the nested object using the function
                updateNestedObject(updatedData, keys.concat(lastKey), newFieldName, editValue); // Update the value
            }

            // ready to update
            setData(updatedData);

            try {
                // 使用提供的 set 函數更新資料
                console.log("path:" + "path" + " parentObject[lastKey]:" + parentObject[lastKey])   // TODO: "parentObject[lastKey]" is undefined, since the "parentObject[lastKey]" maybe deleted when newFieldName is different from lastKey
                //TODO: try to just update the value in the path, but not update from the root
                await set(ref(firebaseTools.database, "/"), updatedData);

                alert("Sucessfully updated")
                window.location.reload(); // 刷新頁面
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

    const handleEditChange = (key, field, value) => {
        setEditStates(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };
    const handleFieldAdd = async (path, newFieldName, newFieldValue) => {
        if (newFieldInputs[path]?.newField && newFieldType[path]) {
            const updatedData = { ...data };
            const keys = path.split('/');
            const lastKey = keys.pop();
            const parentObject = keys.reduce((obj, key) => obj[key], updatedData);

            // Determine the value type
            if (newFieldType[path] === "object") {
                parentObject[lastKey][newFieldName] = newFieldValue; // Add the field to the object
            } else {
                parentObject[lastKey][newFieldName] = newFieldValue; // Add the new field directly
            }

            setData(updatedData);
            await set(ref(firebaseTools.database, path), parentObject[lastKey]);

            alert("Successfully added");
            setNewFieldInputs(prev => ({
                ...prev,
                [path]: { newField: '', newValue: '' }
            }));
            window.location.reload(); // Refresh the page
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
                    <select
                        onChange={(e) => {
                            const selectedType = e.target.value;
                            setNewFieldType(prev => ({
                                ...prev,
                                [parentKey]: selectedType
                            }));
                            // Reset JSON fields when type changes
                            if (selectedType !== "object") {
                                setJsonFields(prev => ({
                                    ...prev,
                                    [parentKey]: {} // Reset for the specific key
                                }));
                            }
                        }}
                    >
                        <option value="">Select Type</option>
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="object">Object (JSON)</option>
                    </select>
                    {newFieldType[parentKey] === "object" ? (
                        <>
                            <Button label="Add JSON Field" onClick={() => handleAddObjectField(parentKey)} />
                            <table>
                                <tbody>
                                    {Object.entries(jsonFields[parentKey] || {}).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{value}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                placeholder="New Key"
                                                onChange={(e) => {
                                                    const newKey = e.target.value;
                                                    setJsonFields(prev => ({
                                                        ...prev,
                                                        [parentKey]: {
                                                            ...prev[parentKey],
                                                            [newKey]: '' // Initialize with empty string
                                                        }
                                                    }));
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                placeholder="New Value"
                                                onChange={(e) => {
                                                    const newKey = Object.keys(jsonFields[parentKey] || {}).pop();
                                                    setJsonFields(prev => ({
                                                        ...prev,
                                                        [parentKey]: {
                                                            ...prev[parentKey],
                                                            [newKey]: e.target.value // Update the last key's value
                                                        }
                                                    }));
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    ) : (
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
                    <Button label="加入" onClick={() => handleFieldAdd(parentKey, newFieldInputs[parentKey]?.newField, newFieldInputs[parentKey]?.newValue)} />
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
                                            renderTable(value, currentPath) // Recursively render nested tables
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
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="修改值"
                                                    value={editStates[currentPath]?.value || ''}
                                                    onChange={(e) => handleEditChange(currentPath, 'value', e.target.value)}
                                                />
                                                <Button label="刪除" onClick={() => handleDeleteField(currentPath)} />
                                                <Button label="提交修改" onClick={() => handleEditField(currentPath, editStates[currentPath]?.field, editStates[currentPath]?.value)} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Render the row to add new fields */}
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
                                    {renderTable(value, key)} {/* Render the nested table */}
                                </td>
                            </tr>
                        ))}
                        {/* Add the new field input row */}
                        {renderAddFieldRow('/')} {/* Pass appropriate parent key */}
                    </tbody>
                </table>
            )}
        </div>
    );
};