import { useState, useEffect } from "react";

import "./TodoListWidget.css"

// Widget of displaying Todo List
const TodoListWidget = (parameters) => {
    // variable
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {

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

