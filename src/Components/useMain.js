import { createContext, useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const MainContent = createContext()

export function useMain() {
	return useContext(MainContent)
}

const MainComponent = ({ children }) => {
	const apiUrl = process.env.REACT_APP_ENV_SERVER_URL
	const [appLoaded, setAppLoaded] = useState(false)
	const location = useLocation()
	const [displayLocation, setDisplayLocation] = useState(location)
	const [transitionStages, setTransitionStages] = useState({
		rounded: location.pathname === "/sign-up" ? "rounded-end-5" : "rounded-start-5",
		formAnimation: "",
		sideAnimation: "",
		goToText: location.pathname === "/sign-up" ? "Go to Sign In" : "Go to Sign Up",
		submitText: location.pathname === "/sign-up" ? "Sign Up" : "Sign In",
		textFade: "",
	})
	const fixAnimationOnResize = () => {
		setTransitionStages({
			...transitionStages,
			sideAnimation: "",
			formAnimation: "",
		})
	}
	useEffect(() => {
		window.addEventListener("resize", fixAnimationOnResize)
		if (location !== displayLocation && (displayLocation.pathname === "/sign-in" || displayLocation.pathname === "/sign-up" || displayLocation.pathname === "/")) {
			switch (location.pathname) {
				case "/sign-in":
					setTransitionStages({
						...transitionStages,
						rounded: "rounded-start-5",
						formAnimation: document.body.clientWidth > 991 ? "slideLeft" : "fadeIn",
						sideAnimation: document.body.clientWidth > 991 ? "slideRight" : "",
						goToText: "Go to Sign Up",
						submitText: "Sign In",
						textFade: "fadeIn",
					})
					break
				case "/sign-up":
					setTransitionStages({
						...transitionStages,
						rounded: "rounded-end-5",
						formAnimation: document.body.clientWidth > 991 ? "slideRight" : "fadeIn",
						sideAnimation: document.body.clientWidth > 991 ? "slideLeft" : "",
						goToText: "Go to Sign In",
						submitText: "Sign Up",
						textFade: "fadeIn",
					})
					break
				case "/reset-password":
					setTransitionStages({
						...transitionStages,
						formAnimation: "fadeIn",
						sideAnimation: "fadeIn",
						textFade: "fadeIn",
					})
					break

				default:
					switch (displayLocation.pathname) {
						case "/sign-in":
							setTransitionStages({
								...transitionStages,
								rounded: "rounded-start-5",
								formAnimation: "fadeIn",
								sideAnimation: "fadeIn",
								textFade: "fadeIn",
							})
							break
						case "/sign-up":
							setTransitionStages({
								...transitionStages,
								rounded: "rounded-start-5",
								formAnimation: "fadeIn",
								sideAnimation: "fadeIn",
								textFade: "fadeIn",
							})
							break
						case "/reset-password":
							setTransitionStages({
								...transitionStages,
								rounded: "rounded-start-5",
								formAnimation: "fadeIn",
								sideAnimation: "fadeIn",
								textFade: "fadeIn",
							})
							break

						default:
							setTransitionStages({
								...transitionStages,
								rounded: "rounded-start-5",
								formAnimation: "fadeIn",
								sideAnimation: "fadeIn",
								textFade: "fadeIn",
							})
							setDisplayLocation(location)
					}
			}
		} else if (location !== displayLocation && (displayLocation.pathname === "/reset-password" || displayLocation.pathname === "/" || displayLocation.pathname === "/todo"))
			setTransitionStages({
				...transitionStages,
				goToText: location.pathname === "/sign-in" ? "Go to Sign Up" : "Go to Sign In",
				submitText: location.pathname === "/sign-in" ? "Sign In" : "Sign Up",
				formAnimation: "fadeIn",
				sideAnimation: "fadeIn",
			})
		else setDisplayLocation(location)
		return () => {
			window.removeEventListener("resize", fixAnimationOnResize)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location, displayLocation])
	return (
		<MainContent.Provider
			value={{
				appLoaded,
				setAppLoaded,
				transitionStages,
				setTransitionStages,
				displayLocation,
				setDisplayLocation,
				location,
				apiUrl,
			}}
		>
			{children}
		</MainContent.Provider>
	)
}

export default MainComponent
