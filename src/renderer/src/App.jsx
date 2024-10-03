// Basic tools
import { BrowserRouter, Routes, Route, } from "react-router-dom";

// Styling
import "./App.css";

// Pages
import Desktop from "./components/Desktop";
import DarkThemePage from "./components/darktheme";
import TestingPage from "./components/TestingPage";
import NetworkPage from "./components/Network";
import LocalStorageTutorial from "./tutorial/LocalStorage";
import FirebasePage from "./components/Firebase";
import TutorialPage from "./components/TutorialPage";

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
					path="/darktheme"
					element={<DarkThemePage />}
				/>
				<Route
					path="/testing"
					element={<TestingPage />}
				/>
				<Route
					path="/firebase"
					element={<FirebasePage />} />
				<Route
					path="/network"
					element={<NetworkPage />} />
				<Route
					path="/tutorial"
					element={<TutorialPage />} />
				<Route
					path="/localStorage"
					element={<LocalStorageTutorial />} />

			</Routes>
		</BrowserRouter>
	);
}
export default App;
