import { useState, useEffect } from "react";

import "./TodoList.css"
// Widget of displaying Todo List
const TodoListWidget = (parameters) => {
    // variable
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");


    const writeLocal = () => {
        // create data in local storage, setItem("key","value"), while "value" can only be string
        localStorage.setItem("field1", JSON.stringify({ abc: 2, def: "24" }));
    }

    const readLocal = () => {
        // read data with specific field "field1" in local storage
        const buf = localStorage.getItem("field1");
        console.log(buf)
    }

    const deleteLocal = () => {
        // delete specific field of data in local storage
        localStorage.removeItem("field1");

    }
    const clearLocal = () => {
        // clear all data in local storage
        localStorage.clear();
    }

    useEffect(() => {
        readLocal();
    }, []);

    return (
        <div className="TodoListWidget"
            onClick={() => {
                console.log("navigate to TodoListPage");
            }}>
            <p>Todo</p>
        </div>
    );
};

export default TodoListWidget;
