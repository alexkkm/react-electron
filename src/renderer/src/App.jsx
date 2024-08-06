// Basic tools
import { BrowserRouter, Routes, Route, Link, useLocation, } from "react-router-dom";
import { useState } from "react";

// Styling
import "./App.css";

// Components
import NavigationBar from "./components/NavigationBar";

// Pages
import DarkThemePage from "./components/darktheme";
import TestingPage from "./components/TestingPage";
import WeatherWidget from "./components/Weather";
import ClockWidget from "./components/Clock";

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

			<button onClick={handleButtonClick}>Toggle Blur</button>
			<div className={`transition ${isBlurred ? 'blurred' : ''}`}>
				<WeatherWidget />
				<ClockWidget />
			</div>
			<div className={`transition ${isBlurred ? '' : 'hidden'}`}>
				<NavigationBar />
			</div>

		</div>
	);
};

// The main componenet of the app
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Desktop />}>
					Home Page
				</Route>
				<Route
					path="/home"
					element={<HomePage />}>
					Home Page
				</Route>
				<Route
					path="/darktheme"
					element={<DarkThemePage />}
				/>
				<Route
					path="/testing"
					element={<TestingPage />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
export default App;
