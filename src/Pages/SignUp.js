import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey, faSpinner, faUserAlt } from "@fortawesome/free-solid-svg-icons"
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../Components/useAuth"
import { useMain } from "../Components/useMain"
import { useEffect } from "react"

const SignUp = () => {
	const { appLoaded, setDisplayLocation, transitionStages, setTransitionStages, location } = useMain()
	const { formData, setFormData, formRef, handleFormData, register } = useAuth()
	const SignUp = (e) => {
		e.preventDefault()
		e.preventDefault()
		let validations = {
			usernameValidation: "",
			usernameFeedback: "",
			passwordValidation: "",
			passwordFeedback: "",
			repeatPasswordValidation: "",
			repeatPasswordFeedback: "",
		}

		if (formData.username && formData.username.length && formData.password && formData.password.length && formData.repeatPassword && formData.repeatPassword.length && formData.password === formData.repeatPassword) {
			setTransitionStages({
				...transitionStages,
				submitText: <FontAwesomeIcon icon={faSpinner} spin />,
			})
			register(formData)
		} else {
			!formData.username || !formData.username.length ? formRef.current.username.focus() : !formData.password || !formData.password.length ? formRef.current.password.focus() : !formData.repeatPassword || !formData.repeatPassword.length ? formRef.current.repeatPassword.focus() : formData.password !== formData.repeatPassword ? formRef.current.password.focus() : <></>
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
			!formData.repeatPassword || !formData.repeatPassword.length
				? (validations = {
						...validations,
						repeatPasswordValidation: false,
						repeatPasswordFeedback: "Please fill the verify password field.",
				  })
				: (validations = {
						...validations,
						repeatPasswordValidation: true,
						repeatPasswordFeedback: "Looks good here.",
				  })

			formData.password && formData.repeatPassword && formData.password.length && formData.repeatPassword.length && formData.password !== formData.repeatPassword ? (
				(validations = {
					...validations,
					passwordValidation: false,
					passwordFeedback: "Password and Verify password doesn't match",
					repeatPasswordValidation: false,
					repeatPasswordFeedback: "Password and Verify password doesn't match",
				})
			) : (
				<></>
			)
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
			repeatPasswordValidation: "",
			repeatPasswordFeedback: "",
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<div className={`login bg-dark bg-gradient text-white min-vh-100 d-flex align-items-center px-0 px-md-5`}>
			<Container fluid>
				<Row className="mx-auto">
					<Col sm={12} className="border rounded rounded-5 overflow-hidden shadow shadow-lg mx-auto">
						<Row>
							<Col sm={6} className={`bg-light d-none d-lg-flex bg-gradient text-center rounded overflow-hidden align-items-center ${transitionStages.rounded} ${transitionStages.sideAnimation}`}>
								<Card className="bg-transparent border-0 mx-auto">
									<Card.Title className={`${transitionStages.textFade}`}>Sing Up to create your To Do list</Card.Title>
									<Card.Text
										className={`${transitionStages.textFade}`}
										onAnimationEnd={
											document.body.clientWidth > 991
												? () => {
														setTransitionStages({
															...transitionStages,
															sideAnimation: "",
															formAnimation: "",
															textFade: "fadeOut",
														})
														setDisplayLocation(location)
												  }
												: () => {}
										}
									>
										Manage your daily tasks and get everything done.
									</Card.Text>
								</Card>
							</Col>
							<Col
								sm={12}
								lg={6}
								className={`px-0 px-xl-5 ${transitionStages.formAnimation}`}
								onAnimationEnd={
									document.body.clientWidth < 991
										? () => {
												setTransitionStages({
													...transitionStages,
													sideAnimation: "",
													formAnimation: "fadeOut",
													textFade: "fadeOut",
												})
												setDisplayLocation(location)
										  }
										: () => {}
								}
							>
								<Form onSubmit={SignUp} className="px-5">
									<InputGroup className="my-3" hasValidation>
										<InputGroup.Text className={`bg-transparent text-white ${formData.usernameValidation ? "border-success" : formData.usernameValidation === false ? "border-danger" : ""}`}>
											<FontAwesomeIcon className={`${formData.usernameValidation ? "text-success" : formData.usernameValidation === false ? "text-danger" : ""}`} icon={faUserAlt} />
										</InputGroup.Text>
										<Form.Control className="bg-transparent text-white" type="text" placeholder="Email" name="username" onChange={handleFormData} ref={(ref) => (formRef.current.username = ref)} value={formData.username ? formData.username : ""} isInvalid={formData.usernameValidation === false} isValid={formData.usernameValidation} />
										<Form.Control.Feedback className="fadeOut" type={formData.usernameValidation ? "valid" : "invalid"}>
											{formData.usernameFeedback}
										</Form.Control.Feedback>
									</InputGroup>
									<InputGroup className="my-3" hasValidation>
										<InputGroup.Text className={`bg-transparent text-white ${formData.passwordValidation ? "border-success" : formData.passwordValidation === false ? "border-danger" : ""}`}>
											<FontAwesomeIcon className={`${formData.passwordValidation ? "text-success" : formData.passwordValidation === false ? "text-danger" : ""}`} icon={faKey} />
										</InputGroup.Text>
										<Form.Control className="bg-transparent text-white" type="password" placeholder="Password" name="password" onChange={handleFormData} ref={(ref) => (formRef.current.password = ref)} value={formData.password ? formData.password : ""} isInvalid={formData.passwordValidation === false} isValid={formData.passwordValidation} />
										<Form.Control.Feedback className="fadeOut" type={formData.passwordValidation ? "valid" : "invalid"}>
											{formData.passwordFeedback}
										</Form.Control.Feedback>
									</InputGroup>
									<InputGroup className="my-3" hasValidation>
										<InputGroup.Text className={`bg-transparent text-white ${formData.passwordValidation ? "border-success" : formData.passwordValidation === false ? "border-danger" : ""}`}>
											<FontAwesomeIcon className={`${formData.passwordValidation ? "text-success" : formData.passwordValidation === false ? "text-danger" : ""}`} icon={faKey} />
										</InputGroup.Text>
										<Form.Control className="bg-transparent text-white" type="password" placeholder="Verify Password" name="repeatPassword" onChange={handleFormData} ref={(ref) => (formRef.current.repeatPassword = ref)} value={formData.repeatPassword ? formData.repeatPassword : ""} isInvalid={formData.repeatPasswordValidation === false} isValid={formData.repeatPasswordValidation} />
										<Form.Control.Feedback className="fadeOut" type={formData.repeatPasswordValidation ? "valid" : "invalid"}>
											{formData.repeatPasswordFeedback}
										</Form.Control.Feedback>
									</InputGroup>
									<Button className="bg-gradient d-block mb-3 mx-auto" variant="success" type="submit">
										{appLoaded ? transitionStages.submitText : <FontAwesomeIcon icon={faSpinner} spin />}
									</Button>
									<Button as={Link} to="/sign-in" className="bg-gradient d-block mb-3 mx-auto" variant="primary">
										{transitionStages.goToText}
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

export default SignUp
