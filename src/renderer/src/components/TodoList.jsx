import { useState, useEffect } from "react";

import "./TodoList.css"
// Widget of displaying Todo List
const TodoListWidget = (parameters) => {
    // variable
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");


    const writeLocal = () => {
        // store data in local storage, setItem("key","value"), while "value" can only be string
        localStorage.setItem("field1", JSON.stringify({ abc: 2, def: "24" }));
    }

    const readLocal = () => {
        const buf = localStorage.getItem("field1");
        console.log(buf)
    }

    useEffect(() => {
        writeLocal();
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
