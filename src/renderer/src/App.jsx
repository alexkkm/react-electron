// Basic tools
import {
	BrowserRouter,
	Routes,
	Route,
	Link,
	useLocation,
} from "react-router-dom";

// Pages
import DarkThemePage from "./components/darktheme";

// Styling
import "./App.css";

// indicate the current pathname and display it
const PathNameIndicator = () => {
	const location = useLocation();
	console.log(location.pathname);
	return <p>PathName: {location.pathname}</p>;
};

// Hoem Page
const HomePage = () => {
	return (
		<div>
			<Link to="/darktheme">Dark Cyberpunk theme</Link>
			<hr />
			<PathNameIndicator />
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
			</Routes>
		</BrowserRouter>
	);
}
export default App;
