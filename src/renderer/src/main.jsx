//import './assets/main.css'

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// need to import semantic css here
import 'semantic-ui-css/semantic.min.css'

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
