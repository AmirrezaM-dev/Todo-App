import React, { useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useLocation, useNavigate } from "react-router-dom"
import { useMain } from "./useMain"
import Cookies from "universal-cookie"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

const AuthContent = React.createContext()

export function useAuth() {
	return useContext(AuthContent)
}

const AuthProvider = ({ children }) => {
	const pathname = useLocation().pathname
	const cookies = new Cookies(null, { path: "/" })
	const [formData, setFormData] = useState({})
	const formRef = useRef({})
	const handleFormData = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}
	const navigate = useNavigate()
	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer)
			toast.addEventListener("mouseleave", Swal.resumeTimer)
		},
	})
	const { apiUrl, setAppLoaded, setTransitionStages, transitionStages } =
		useMain()
	const [user, setUser] = useState({})
	const [loadingLogin, setLoadingLogin] = useState(false)
	const [loggedIn, setLoggedIn] = useState()
	const authApi = axios.create({
		baseURL: apiUrl,
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${cookies.get("cs")}`,
		},
	})
	useEffect(() => {
		if (loggedIn === undefined && !loadingLogin) {
			authApi
				.get(`/api/users/get/`)
				.then((data) => {
					setUser(data)
					setLoggedIn(true)
				})
				.catch(() => {
					if (pathname === "/todo") navigate("/sign-in")
					setLoggedIn(false)
				})
				.finally(() => setAppLoaded(true))
		}
	}, [
		authApi,
		loadingLogin,
		loggedIn,
		navigate,
		pathname,
		setAppLoaded,
		user,
	])
	const login = (formData) => {
		const { username, password } = formData
		if (username.length && password.length) {
			if (!loadingLogin) {
				setTransitionStages({
					...transitionStages,
					submitText: <FontAwesomeIcon icon={faSpinner} spin />,
				})
				setLoadingLogin(true)
				authApi
					.post(`/api/users/login/`, {
						email: username,
						password: password,
					})
					.then((data) => {
						setUser(data)
						cookies.set("cs", data.data.csrf, {
							path: "/",
							sameSite: "Strict",
							secure: true,
						})
						setLoggedIn(true)
						setFormData({})
						navigate("/todo", { replace: true })
					})
					.catch((e) => {
						setTransitionStages({
							...transitionStages,
							submitText: "Sign In",
						})
						if (
							e.response &&
							e.response.data &&
							e.response.data.message
						)
							Toast.fire({
								icon: "error",
								title: e.response.data.message,
							})
						else
							Toast.fire({
								icon: "error",
								title: "Something went wrong",
							})
					})
					.finally(() => {
						setLoadingLogin(false)
					})
			}
		}
	}
	const register = (formData) => {
		const { username, password } = formData
		if (username.length && password.length) {
			if (!loadingLogin) {
				setLoadingLogin(true)
				authApi
					.post(`/api/users/register/`, {
						email: username,
						password: password,
					})
					.then((data) => {
						setUser({ ...user, ...data.data.name })
						cookies.set("cs", data.data.csrf, {
							path: "/",
							sameSite: "Strict",
							secure: true,
						})
						setFormData({})
						setLoggedIn(true)
						navigate("/todo", { replace: true })
					})
					.catch((e) => {
						setTransitionStages({
							...transitionStages,
							submitText: "Sign Up",
						})
						if (
							e.response &&
							e.response.data &&
							e.response.data.message
						)
							Toast.fire({
								icon: "error",
								title: e.response.data.message,
							})
						else
							Toast.fire({
								icon: "error",
								title: "Something went wrong",
							})
					})
					.finally(() => {
						setLoadingLogin(false)
					})
			}
		}
	}
	const logout = () => {
		if (!loadingLogin) {
			setLoadingLogin(true)
			authApi
				.get(`/api/users/logout/`)
				.then(() => {
					setUser({})
					setLoggedIn(false)
					cookies.remove("cs")
					navigate("/sign-in")
				})
				.catch(() => {
					Toast.fire({
						icon: "error",
						title: "Something went wrong.",
					})
				})
				.finally(() => setLoadingLogin(false))
		}
	}
	return (
		<AuthContent.Provider
			value={{
				authApi,
				login,
				register,
				logout,
				loggedIn,
				loadingLogin,
				user,
				formData,
				setFormData,
				formRef,
				handleFormData,
			}}
		>
			{children}
		</AuthContent.Provider>
	)
}

export default AuthProvider
