import { Container, Form, Nav, Navbar } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "./useAuth"

const Navigation = ({ categories, useCategory, setUseCategory, date, setDate, category, setCategory, setShowLoading, addNewCategory, getDate }) => {
	const { logout } = useAuth()
	return (
		<Navbar expand={"md"} data-bs-theme="dark" className="border-bottom mb-3">
			<Container>
				<Navbar.Brand>To Do App</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse className="justify-content-center">
					<Nav className="mx-auto mt-4 mt-md-0">
						<Form.Control
							className="text-center text-sm-start me-0 me-md-1"
							type="date"
							onChange={(e) => {
								setCategory("-1")
								setUseCategory(false)
								setDate(e.target.value && e.target.value.length ? e.target.value : new Date())
							}}
							value={date.length === 10 ? date : ""}
							placeholder="name@example.com"
						/>
						<Form.Check
							className="d-flex align-items-center mx-auto my-2 my-md-0 mx-md-2"
							type="switch"
							checked={useCategory}
							onChange={(e) => {
								setUseCategory(e.target.checked)
								if (e.target.checked && category) setDate(category)
								else setDate(getDate("today"))
							}}
						/>
						<Form.Select
							value={category}
							className="text-center mt-1 mt-md-0"
							onChange={(e) => {
								if (e.target.value === "addNew") addNewCategory()
								else {
									setUseCategory(true)
									setCategory(e.target.value)
									setDate(e.target.value)
								}
							}}
						>
							<option value="-1" disabled>
								Select category
							</option>
							{categories.map((categori, index) => {
								return (
									<option key={index} value={categori.date}>
										{categori.title}
									</option>
								)
							})}
							<option value="addNew">Add New</option>
						</Form.Select>
					</Nav>
					<Navbar className="justify-content-center justify-content-sm-center">
						<Navbar.Text>
							<Link
								onClick={() => {
									setShowLoading(true)
									logout()
								}}
							>
								Sign Out
							</Link>
						</Navbar.Text>
					</Navbar>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default Navigation
