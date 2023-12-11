import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"
import { HashRouter } from "react-router-dom"
import MainComponent from "./Components/useMain"
import AuthProvider from "./Components/useAuth"
import "@sweetalert2/theme-dark/dark.css"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<React.StrictMode>
		<HashRouter>
			<MainComponent>
				<AuthProvider>
					<App />
				</AuthProvider>
			</MainComponent>
		</HashRouter>
	</React.StrictMode>
)
