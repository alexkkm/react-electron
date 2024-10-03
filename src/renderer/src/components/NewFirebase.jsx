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

    return (
        <div className="firebasePage">
            <img src={firebaseImagePath} className="firebaseImage" />
            <p>Trying the real firebase page</p>

            <div className="Table">
                <NestedTable />
            </div>

            <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
    );
};

export default NewFirebasePage;

// Nested Table
const NestedTable = () => {
    const [data, setData] = useState({});
    const [newField, setNewField] = useState('');
    const [newValue, setNewValue] = useState('');
    const [editStates, setEditStates] = useState({}); // 用於儲存每行的編輯狀態

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

    const handleAddField = async (key) => {
        if (newField && newValue) {
            const updatedData = { ...data, [key]: { ...data[key], [newField]: newValue } };
            setData(updatedData);
            setNewField('');
            setNewValue('');
            await set(ref(firebaseTools.database, key), updatedData[key]);
            window.location.reload(); // 刷新頁面
        }
    };

    const handleDeleteField = async (path) => {
        // Delete data from Realtime Database
        await deleteData(path);
        alert("Sucessfully deleted")
        window.location.reload(); // 刷新頁面
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
                await set(ref(firebaseTools.database, path), parentObject[lastKey]);
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

    const renderTable = (obj, parentKey) => {
        return (
            <div style={{ marginBottom: '20px' }}>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {Object.entries(obj).map(([key, value]) => {
                            const currentPath = `${parentKey}/${key}`; // 獲取當前路徑

                            return (
                                <tr key={key}>
                                    <td>
                                        {key}
                                        <Button label="More" onClick={() => handleMoreClick(currentPath)} />
                                    </td>
                                    <td>
                                        {typeof value === 'object' && value !== null ? (
                                            renderTable(value, currentPath) // 递归渲染嵌套表格
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
                        {/* 新增行以添加新欄位 */}
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="新欄位名稱"
                                    value={newField}
                                    onChange={(e) => setNewField(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="新值"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                />
                                <Button label="加入" onClick={() => handleAddField(parentKey)} />
                            </td>
                        </tr>
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
                                <td>
                                    {key}
                                    <Button label="More" onClick={() => handleMoreClick(key)} />
                                </td>
                                <td>
                                    {editStates[key]?.visible && (
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="修改欄位名稱"
                                                value={editStates[key]?.field || ''}
                                                onChange={(e) => handleEditChange(key, 'field', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="修改值"
                                                value={editStates[key]?.value || ''}
                                                onChange={(e) => handleEditChange(key, 'value', e.target.value)}
                                            />
                                            <Button label="刪除" onClick={() => handleDeleteField(key)} />
                                            <Button label="提交修改" onClick={() => handleEditField(key, editStates[key]?.field, editStates[key]?.value)} />
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {renderTable(value, key)} {/* 渲染每个字段的内容 */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Delete data from Realtime Database
const deleteData = async (path) => {
    const databaseReference = ref(firebaseTools.database);
    await remove(child(databaseReference, path))
        .then(() => {
            console.log("Data deleted successfully");
        })
        .catch((error) => {
            console.error("Error deleting data:", error);
        });
};