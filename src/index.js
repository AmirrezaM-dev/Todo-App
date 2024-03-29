import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"
import { HashRouter as Router } from "react-router-dom"
import MainComponent from "./Components/useMain"
import AuthProvider from "./Components/useAuth"
import "@sweetalert2/theme-dark/dark.css"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
	<React.StrictMode>
		<Router>
			{/* Main Component is useContext for holding all global variables */}
			<MainComponent>
				{/* Auth Provider is useContext for authentication functions */}
				<AuthProvider>
					<App />
				</AuthProvider>
			</MainComponent>
		</Router>
	</React.StrictMode>
)
