import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faUserAlt } from "@fortawesome/free-solid-svg-icons"
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../Components/useAuth"
import { useMain } from "../Components/useMain"
import { useEffect } from "react"

const ResetPassword = () => {
	const { setDisplayLocation, transitionStages, setTransitionStages, location } = useMain()
	const { formData, setFormData, formRef, handleFormData, login } = useAuth()
	const SignIn = (e) => {
		e.preventDefault()
		let validations = {
			usernameValidation: "",
			passwordValidation: "",
			usernameFeedback: "",
			passwordFeedback: "",
		}

		if (formData.username && formData.password && formData.username.length && formData.password.length) {
			setTransitionStages({
				...transitionStages,
				submitText: <FontAwesomeIcon icon={faSpinner} spin />,
			})
			login(formData)
		} else {
			!formData.username || !formData.username.length ? formRef.current.username.focus() : !formData.password || !formData.password.length ? formRef.current.password.focus() : !formData.repeatPassword || !formData.repeatPassword.length ? formRef.current.repeatPassword.focus() : <></>
			!formData.username || !formData.username.length
				? (validations = {
						...validations,
						usernameValidation: false,
						usernameFeedback: "Please fill the username field.",
				  })
				: (validations = {
						...validations,
						usernameValidation: true,
						usernameFeedback: "Looks good here.",
				  })
			!formData.password || !formData.password.length
				? (validations = {
						...validations,
						passwordValidation: false,
						passwordFeedback: "Please fill the password field.",
				  })
				: (validations = {
						...validations,
						passwordValidation: true,
						passwordFeedback: "Looks good here.",
				  })
		}
		setFormData({
			...formData,
			...validations,
		})
	}
	useEffect(() => {
		setFormData({
			...formData,
			usernameValidation: "",
			usernameFeedback: "",
			passwordValidation: "",
			passwordFeedback: "",
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className={`login bg-dark bg-gradient text-white min-vh-100 d-flex align-items-center px-0 px-md-5`}>
			<Container fluid>
				<Row className="mx-auto">
					<Col sm={12} className="border rounded rounded-5 overflow-hidden shadow shadow-lg mx-auto">
						<Row className="fadeOut">
							<Col
								sm={12}
								className={`px-0 px-xl-5 ${transitionStages.formAnimation}`}
								onAnimationEnd={() => {
									setTransitionStages({
										...transitionStages,
										sideAnimation: "fadeOut",
										formAnimation: "fadeOut",
										textFade: "fadeOut",
									})
									setDisplayLocation(location)
								}}
							>
								<Form onSubmit={SignIn} className={`px-5`}>
									<InputGroup className="my-3" hasValidation>
										<InputGroup.Text className={`bg-transparent text-white ${formData.usernameValidation ? "border-success" : formData.usernameValidation === false ? "border-danger" : ""}`}>
											<FontAwesomeIcon className={`${formData.usernameValidation ? "text-success" : formData.usernameValidation === false ? "text-danger" : ""}`} icon={faUserAlt} />
										</InputGroup.Text>
										<Form.Control className="bg-transparent text-white" type="text" placeholder="Email" name="username" onChange={handleFormData} ref={(ref) => (formRef.current.username = ref)} value={formData.username ? formData.username : ""} isInvalid={formData.usernameValidation === false} isValid={formData.usernameValidation} />
										<Form.Control.Feedback className="fadeOut" type={formData.usernameValidation ? "valid" : "invalid"}>
											{formData.usernameFeedback}
										</Form.Control.Feedback>
									</InputGroup>
									<Button className="bg-gradient d-block mb-3 mx-auto" variant="success" type="submit">
										Reset Password
									</Button>
									<Button as={Link} to="/sign-up" className="bg-gradient d-block mb-3 mx-auto" variant="primary">
										Go to Sign Up
									</Button>
									<Button as={Link} to="/sign-in" className="bg-gradient d-block mb-3 mx-auto" variant="primary">
										Go to Sign In
									</Button>
								</Form>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default ResetPassword
