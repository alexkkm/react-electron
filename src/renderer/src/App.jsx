// Basic tools
import { BrowserRouter, Routes, Route, } from "react-router-dom";

// Styling
import "./App.css";

// Pages
import Desktop from "./components/Desktop";
import DarkThemePage from "./components/darktheme";
import TestingPage from "./components/TestingPage";
import FirebasePage from "./components/FirebasePage";
import NetworkPage from "./components/Network";
import LocalStorageTutorial from "./tutorial/LocalStorage";
import NewFirebasePage from "./components/NewFirebase";

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
					element={<NewFirebasePage />} />
				<Route
					path="/network"
					element={<NetworkPage />} />
				<Route
					path="/localStorage"
					element={<LocalStorageTutorial />} />
			</Routes>
		</BrowserRouter>
	);
}
export default App;
