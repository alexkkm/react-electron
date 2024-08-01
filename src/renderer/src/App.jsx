// Basic tools
import { BrowserRouter, Routes, Route, Link, useLocation, } from "react-router-dom";

// Pages
import DarkThemePage from "./components/darktheme";
import TestingPage from "./components/TestingPage";

// Styling
import "./App.css";
import WeatherWidget from "./components/Weather";

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
		</div>
	);
};

// TODO: Desktop is the main door of the app
const Desktop = () => {
	return (
		<div id="desktop">
			<NavigationBar />
			<WeatherWidget />
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
					element={<HomePage />}>
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
