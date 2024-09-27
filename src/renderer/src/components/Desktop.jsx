// Basic tools
import { Link, useLocation, } from "react-router-dom";
import { useState } from "react";

import { TfiViewListAlt } from "react-icons/tfi";

import "./Desktop.css"
// Components
import NavigationBar from "./NavigationBar";
import WeatherWidget from ".//Weather";
import ClockWidget from "./Clock";
import TodoListWidget from "./TodoListWidget";

// indicate the current pathname and display it
const PathNameIndicator = () => {
    const location = useLocation();
    return <p>PathName: {location.pathname}</p>;
};

//Desktop is the main door of the app
const Desktop = () => {
    // state parameters
    const [isBlurred, setIsBlurred] = useState('');
    const [isButtonActive, setIsButtonActive] = useState('');

    // blur the element by changing the "isBlurred"
    const switchNavigationBar = () => {
        setIsBlurred(!isBlurred); // Toggle the blur state
        setIsButtonActive(true);
    };

    return (
        <div className="desktop">
            <div className="hiddenArea">
                <div className={`switchNavigationBarButton ${isBlurred ? '' : 'hidden'}`}>
                    <NavigationBar switchNavigationBar={switchNavigationBar} />
                </div>
            </div>

            <div className={`mainScreen ${isBlurred ? 'blurred' : ''}`}>
                <TfiViewListAlt className="settingButton" onClick={switchNavigationBar} />
                <WeatherWidget />
                <ClockWidget />
                <TodoListWidget />
            </div>

        </div>
    );
};

export default Desktop;