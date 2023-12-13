import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Col, Container, Row } from "react-bootstrap"
import { useMain } from "../Components/useMain"

const Loading = () => {
	const { setDisplayLocation, transitionStages, setTransitionStages, location, displayLocation } = useMain()

	return (
		<div className={`login bg-dark bg-gradient text-white min-vh-100 d-flex align-items-center px-0 px-md-5`}>
			<Container fluid>
				<Row className="mx-auto">
					<Col sm={12} className="border rounded rounded-5 overflow-hidden shadow shadow-lg mx-auto">
						<Row>
							<Col
								sm={12}
								className={`px-0 px-xl-5 ${transitionStages.formAnimation} text-center ${location.pathname === displayLocation.pathname ? "fadeOut" : "fadeIn"}`}
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
								<FontAwesomeIcon size="10x" icon={faSpinner} spin className="my-5" />
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default Loading
