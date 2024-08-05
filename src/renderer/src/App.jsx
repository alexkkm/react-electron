// Basic tools
import { BrowserRouter, Routes, Route, Link, useLocation, } from "react-router-dom";

// Styling
import "./App.css";

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
	return (
		<div className="desktop">
			<WeatherWidget />
			<ClockWidget />
			<iframe src="https://www.google.com" title="browserInside" width="25%" height="25%" />
		</div>
	);
};

// Navigation Bar
const NavigationBar = () => {
	return (
		//TODO Use a json to store for the different Widgets information
		<NavigationBarWidget />
	);
};

// The signle
const NavigationBarWidget = () => {
	return (
		<div>
			<BarWidgetIcon />
			<BarWidgetTitle />
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
