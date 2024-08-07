// Basic tools
import { Link, useLocation, } from "react-router-dom";
import { useState } from "react";

import { TfiViewListAlt } from "react-icons/tfi";

import "./Desktop.css"
// Components
import NavigationBar from "./NavigationBar";
import WeatherWidget from ".//Weather";
import ClockWidget from "./Clock";

// indicate the current pathname and display it
const PathNameIndicator = () => {
    const location = useLocation();
    return <p>PathName: {location.pathname}</p>;
};

// Hoem Page that temporately use as main door
const HomePage = () => {
    return (
        <div>
            <Link to="/darktheme">Dark Cyberpunk theme</Link>
            <hr />
            <Link to="/testing">Testing</Link>
            <hr />
            <PathNameIndicator />
            <hr />
            <WeatherWidget />
            <hr />
            <ClockWidget />
            <hr />
        </div>
    );
};

// TODO: Desktop is the main door of the app
const Desktop = () => {
    // state parameters
    const [isBlurred, setIsBlurred] = useState(false);

    // blur the element by changing the "isBlurred"
    const handleButtonClick = () => {
        setIsBlurred(!isBlurred); // Toggle the blur state
    };

    return (
        <div className="desktop">
            <div className="hiddenArea">
                <div className={`transition ${isBlurred ? '' : 'hidden'}`}>
                    <NavigationBar handleButtonClick={handleButtonClick} />
                </div>
            </div>

            <div className="mainScreen">
                <div className={`transition ${isBlurred ? 'blurred' : ''}`}>
                    <TfiViewListAlt className="settingButton" onClick={handleButtonClick} />
                    <WeatherWidget />
                    <ClockWidget />
                </div>
            </div>

        </div>
    );
};

export default Desktop;