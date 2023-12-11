import { Navigate, Route, Routes } from "react-router-dom"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"
import { useMain } from "./Components/useMain"
import ResetPassword from "./Pages/ResetPassword"
import ToDo from "./Pages/ToDo"

const App = () => {
	const { displayLocation } = useMain()

	return (
		<Routes location={displayLocation}>
			<Route path="/" element={<Navigate to="/todo" />} />
			<Route path="/todo/*" element={<ToDo />} />
			<Route path="/sign-in" element={<SignIn />} />
			<Route path="/sign-up" element={<SignUp />} />
			<Route path="/reset-password" element={<ResetPassword />} />
		</Routes>
	)
}

export default App
