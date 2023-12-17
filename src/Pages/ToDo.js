import { Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../Components/useAuth"
import { useMain } from "../Components/useMain"
import Loading from "./Loading"

import { Button, Col, Collapse, Container, ListGroup, Row } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faInfoCircle, faPencil, faPlus, faSpinner, faSquareCheck, faStar, faX } from "@fortawesome/free-solid-svg-icons"
import { faSquare, faStar as farStar } from "@fortawesome/free-regular-svg-icons"
import Swal from "sweetalert2"
import Navigation from "../Components/Navigation"

const ToDo = () => {
	// Convert new Date() to YYYY-MM-DD
	const getDate = (date) => {
		return date === "today" ? new Date().toISOString().substr(0, 10) : new Date(date).toISOString().substr(11, 8).toString() === "00:00:00" ? new Date(date).toISOString().substr(0, 10) : new Date(date).toISOString()
	}
	const [date, setDate] = useState(getDate("today"))
	const [showLoading, setShowLoading] = useState(false)
	const [useCategory, setUseCategory] = useState(false)
	const [category, setCategory] = useState("-1")
	const [categories, setCategories] = useState([])
	const [todos, setTodos] = useState({})
	const { appLoaded } = useMain()
	const { loggedIn } = useAuth()

	const { authApi } = useAuth()

	const { setDisplayLocation, transitionStages, setTransitionStages, location } = useMain()
	// Search in oject and childs of the object of loaded todo items
	const searchItem = (o, p) => {
		// return variable : let = r
		let r
		Object.keys(o).some(function (k) {
			if (k === p) {
				r = o[k]
				return true
			}
			if (typeof o[k] === "object") {
				r = searchItem(o[k], p)
				return !!r
			}
			return false
		})
		return r
	}
	const addItem = (parent_id) => {
		Swal.fire({
			html: `
				<input id="swal-title" type="text" class="text-center form-control my-2 bg-dark text-white" placeholder="Title">
				<textarea id="swal-details" class="text-center form-control my-2 bg-dark text-white" placeholder="Details"></textarea>
				<br/>
				${typeof parent_id !== "string" ? `<label>Is important?</label><input id="swal-isImportant" class="swal2-checkbox mx-2" type="checkbox" />` : ""}
			`,
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Save",
			showLoaderOnConfirm: true,
			preConfirm: () => {
				let title = document.getElementById("swal-title").value,
					details = document.getElementById("swal-details").value,
					isImportant = typeof parent_id !== "string" ? document.getElementById("swal-isImportant").checked : false
				if (!title.length) {
					document.getElementById("swal-title").focus()
					return false
				}
				return {
					title,
					details,
					isImportant,
				}
			},
			allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					allowOutsideClick: () => !Swal.isLoading(),
					didOpen: () => {
						Swal.showLoading()
					},
				})
				const { title, details, isImportant } = result.value
				let sendData = {
					title,
					details,
					isImportant,
					// if its child, search for date because if the parent is important, it might come from another date and we cannot use the date variable becauase it might be not equal to parent date
					date: typeof parent_id === "string" ? getDate(searchItem(todos, parent_id).date) : useCategory ? category : date,
				}
				// add parent id if its child
				sendData = typeof parent_id === "string" ? { ...sendData, parent_id } : sendData
				authApi.post("/api/todo/create", sendData).then((response) => {
					if (typeof parent_id === "string")
						// if type of parent_id is string it means has sent to the function and its not the default event which means we are adding children to the parent that is sent
						setTodos((todos) => {
							return {
								...todos,
								[getDate(searchItem(todos, parent_id).date) + "_children"]: {
									...todos[getDate(searchItem(todos, parent_id).date) + "_children"],
									[parent_id]: todos[getDate(searchItem(todos, parent_id).date) + "_children"]
										? {
												...todos[getDate(searchItem(todos, parent_id).date) + "_children"][parent_id],
												[response.data.newTodo._id]: response.data.newTodo,
										  }
										: { [response.data.newTodo._id]: response.data.newTodo },
								},
							}
						})
					else {
						if (isImportant)
							setTodos((todos) => {
								return {
									...todos,
									important: {
										...todos.important,
										[response.data.newTodo._id]: response.data.newTodo,
									},
								}
							})
						else
							setTodos((todos) => {
								return {
									...todos,
									[date]: {
										...todos[date],
										[response.data.newTodo._id]: response.data.newTodo,
									},
								}
							})
					}
					Swal.fire({
						title: "Successfully created!",
						icon: "success",
					})
				})
			}
		})
	}
	const editItem = (todo, wasImportant) => {
		Swal.fire({
			html: `
				<input id="swal-title" type="text" class="text-center form-control my-2 bg-dark text-white" placeholder="Title" value="${todo.title}">
				<textarea id="swal-details" class="text-center form-control my-2 bg-dark text-white" placeholder="Details">${todo.details}</textarea>
				<br/>
				${typeof todo.parent !== "string" ? `<label>Is important?</label><input id="swal-isImportant" class="swal2-checkbox mx-2" type="checkbox" ${wasImportant ? "checked" : ""} />` : ""}
			`,
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Save",
			showLoaderOnConfirm: true,
			preConfirm: () => {
				let title = document.getElementById("swal-title").value,
					details = document.getElementById("swal-details").value,
					isImportant = typeof todo.parent !== "string" ? document.getElementById("swal-isImportant").checked : false
				if (!title.length) {
					document.getElementById("swal-title").focus()
					return false
				}
				return {
					title,
					details,
					isImportant,
				}
			},
			allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					allowOutsideClick: () => !Swal.isLoading(),
					didOpen: () => {
						Swal.showLoading()
					},
				})
				const { title, details, isImportant } = result.value
				let sendData = {
					id: todo._id,
					title,
					details,
					isImportant,
				}
				sendData = typeof todo.parent === "string" ? { ...sendData, parent_id: todo.parent } : sendData
				authApi.post("/api/todo/edit", sendData).then(() => {
					if (todo.parent)
						setTodos((todos) => {
							return {
								...todos,
								[getDate(todo.date) + "_children"]: {
									...todos[getDate(todo.date) + "_children"],
									[todo.parent]: {
										...todos[getDate(todo.date) + "_children"][todo.parent],
										[todo._id]: { ...todo, ...sendData },
									},
								},
							}
						})
					else {
						if (wasImportant && isImportant)
							setTodos((todos) => {
								if (todos.important[todo._id])
									return {
										...todos,
										important: {
											...todos.important,
											[todo._id]: { ...todo, ...sendData },
										},
									}
								else {
									const currentTodo = searchItem(todos, todo._id)
									if (currentTodo) {
										return {
											...todos,
											important: {
												...todos.important,
												[currentTodo._id]: { ...currentTodo, ...sendData },
											},
										}
									} else return todos
								}
							})
						else if (wasImportant && !isImportant) {
							const { [todo._id]: currentImportant, ...important } = todos.important
							if (currentImportant)
								setTodos((todos) => {
									return {
										...todos,
										important,
										[getDate(currentImportant.date)]: {
											...todos[getDate(currentImportant.date)],
											[currentImportant._id]: { ...currentImportant, ...sendData },
										},
									}
								})
							else {
								const currentTodo = searchItem(todos, todo._id)
								if (currentTodo) {
									return {
										...todos,
										[getDate(currentTodo.date)]: {
											...todos[getDate(currentTodo.date)],
											[todo._id]: { ...currentTodo, ...sendData },
										},
									}
								} else return todos
							}
						} else if (!wasImportant && isImportant) {
							const { [todo._id]: currentTodo, ...restTodos } = todos[getDate(todo.date)]
							if (currentTodo)
								setTodos((todos) => {
									return {
										...todos,
										important: {
											...todos.important,
											[currentTodo._id]: { ...currentTodo, ...sendData },
										},
										[getDate(todo.date)]: restTodos,
									}
								})
							else {
								const currentImportant = searchItem(todos, todo._id)
								if (currentImportant) {
									return {
										...todos,
										important: {
											...todos.important,
											[currentTodo._id]: { ...currentTodo, ...sendData },
										},
									}
								} else return todos
							}
						} else if (!wasImportant && !isImportant) {
							const { [todo._id]: currentTodo } = todos[getDate(todo.date)]
							if (currentTodo)
								setTodos((todos) => {
									return {
										...todos,
										[getDate(currentTodo.date)]: {
											...todos[getDate(currentTodo.date)],
											[currentTodo._id]: { ...currentTodo, ...sendData },
										},
									}
								})
							else {
								const { [todo._id]: currentImportant, ...important } = todos.important
								if (currentImportant) {
									return {
										...todos,
										important,
										[getDate(currentImportant.date)]: {
											...todos[getDate(currentImportant.date)],
											[currentImportant._id]: { ...currentImportant, ...sendData },
										},
									}
								} else return todos
							}
						} else return todos
					}
					Swal.fire({
						title: "Successfully updated!",
						icon: "success",
					})
				})
			}
		})
	}
	const addNewCategory = () => {
		Swal.fire({
			html: `
				<input id="swal-title" type="text" class="text-center form-control my-2 bg-dark text-white" placeholder="Title">
			`,
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Save",
			showLoaderOnConfirm: true,
			preConfirm: () => {
				let title = document.getElementById("swal-title").value
				if (!title.length) {
					document.getElementById("swal-title").focus()
					return false
				}
				return {
					title,
				}
			},
			allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					allowOutsideClick: () => !Swal.isLoading(),
					didOpen: () => {
						Swal.showLoading()
					},
				})
				const { title } = result.value
				let sendData = {
					title,
				}
				// add parent id if its child
				authApi.post("/api/todo/addCategory", sendData).then((response) => {
					const { title, date } = response.data.category
					setCategories((categories) => [...categories, { title, date }])
					Swal.fire({
						title: "Successfully added!",
						icon: "success",
					}).then(() => {
						setUseCategory(true)
						setCategory(date.toString())
						setDate(date.toString())
					})
				})
			} else {
				const currentCategory = categories.filter((category) => category.date === date)
				if (currentCategory.length) {
					setCategory(currentCategory[0].date)
				} else setCategory()
			}
		})
	}
	const deleteCategory = () => {
		const currentCategory = categories.filter((categori) => categori.date === category)
		if (currentCategory.length)
			Swal.fire({
				title: "Are you sure you want to delete the category (" + currentCategory[0].title + ")?",
				inputAttributes: {
					autocapitalize: "off",
				},
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Yes, Delete",
				showLoaderOnConfirm: true,
				allowOutsideClick: () => !Swal.isLoading(),
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire({
						allowOutsideClick: () => !Swal.isLoading(),
						didOpen: () => {
							Swal.showLoading()
						},
					})
					// add parent id if its child
					authApi.post("/api/todo/deleteCategory", { date: category }).then((response) => {
						setCategories(response.data.category)
						Swal.fire({
							title: "Successfully deleted!",
							icon: "success",
						}).then(() => {
							if (response.data.category.length) {
								setCategory(response.data.category[0].date)
								setDate(response.data.category[0].date)
								setUseCategory(true)
							} else {
								setDate(getDate("today"))
								setUseCategory(false)
							}
						})
					})
				}
			})
	}
	useEffect(() => {
		if (!todos[date] && !useCategory) {
			setShowLoading(true)
			authApi
				.post("api/todo/get", { date, getImportant: todos.important && todos.important.length ? false : true })
				.then((response) => {
					let newTodos = {},
						childrenTodos = {},
						importantTodos = {}
					response.data.ToDos.map((newTodo) => (newTodos = { ...newTodos, [newTodo._id]: newTodo }))
					response.data.ToDosChildren.map(
						(childrenTodo) =>
							(childrenTodos = {
								...childrenTodos,
								[getDate(childrenTodo.date) + "_children"]: {
									...childrenTodos[getDate(childrenTodo.date) + "_children"],
									[childrenTodo.parent]: childrenTodos[getDate(childrenTodo.date) + "_children"]
										? {
												...childrenTodos[getDate(childrenTodo.date) + "_children"][childrenTodo.parent],
												[childrenTodo._id]: childrenTodo,
										  }
										: { [childrenTodo._id]: childrenTodo },
								},
							})
					)
					if (!todos.important || !todos.important.length)
						response.data.ImportantToDos.map(
							(importantTodo) =>
								(importantTodos = {
									...importantTodos,
									[importantTodo._id]: importantTodo,
								})
						)
					setTodos((todos) => {
						return {
							...todos,
							important: importantTodos,
							[date]: newTodos,
							...childrenTodos,
						}
					})
				})
				.finally(() => setShowLoading(false))
		} else if (useCategory && !todos[category] && category !== "-1" && category !== "addNew") {
			setShowLoading(true)
			authApi
				.post("api/todo/get", { date: category })
				.then((response) => {
					let newTodos = {},
						childrenTodos = {}
					response.data.ToDos.map((newTodo) => (newTodos = { ...newTodos, [newTodo._id]: newTodo }))
					response.data.ToDosChildren.map(
						(childrenTodo) =>
							(childrenTodos = {
								...childrenTodos,
								[getDate(childrenTodo.date) + "_children"]: {
									...childrenTodos[getDate(childrenTodo.date) + "_children"],
									[childrenTodo.parent]: childrenTodos[getDate(childrenTodo.date) + "_children"]
										? {
												...childrenTodos[getDate(childrenTodo.date) + "_children"][childrenTodo.parent],
												[childrenTodo._id]: childrenTodo,
										  }
										: { [childrenTodo._id]: childrenTodo },
								},
							})
					)
					setTodos((todos) => {
						return {
							...todos,
							[category]: newTodos,
							...childrenTodos,
						}
					})
				})
				.finally(() => setShowLoading(false))
		}
		if (categories.length === 0) {
			authApi.post("api/todo/getCategory").then((response) => {
				if (response.data.category) setCategories(response.data.category)
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [date, category, useCategory])

	return (
		<Routes>
			<Route
				path="/"
				element={
					appLoaded && loggedIn && !showLoading ? (
						<div className={`bg-dark bg-gradient text-white min-vh-100 d-flex align-items-center px-0 px-md-5`}>
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
												<Navigation categories={categories} useCategory={useCategory} setUseCategory={setUseCategory} date={date} setDate={setDate} category={category} setCategory={setCategory} setShowLoading={setShowLoading} addNewCategory={addNewCategory} getDate={getDate} />

												{todos.important && Object.keys(todos.important).length ? (
													<ListGroup>
														{Object.keys(todos.important)
															.sort()
															.map((key) => {
																const { [key]: currentImportant } = todos.important
																return (
																	<ListGroup.Item className="bg-transparent text-white mx-3 shadow" key={key}>
																		<Row>
																			<Col sm={8} className="text-center text-sm-start">
																				{currentImportant.details && currentImportant.details.length ? (
																					<FontAwesomeIcon
																						onClick={() => {
																							Swal.fire({
																								html: `<p class="text-white">${currentImportant.details}</p>`,
																								showCancelButton: true,
																								showConfirmButton: false,
																								cancelButtonText: "Close",
																							})
																						}}
																						icon={faInfoCircle}
																						className="cursor-pointer me-2 text-primary"
																					/>
																				) : (
																					<></>
																				)}
																				{currentImportant.title}
																			</Col>
																			<Col sm={4} className="text-center text-sm-end">
																				<FontAwesomeIcon
																					onClick={() => {
																						addItem(currentImportant._id)
																					}}
																					icon={faPlus}
																					className="cursor-pointer mx-1 text-success"
																				/>
																				<FontAwesomeIcon
																					onClick={
																						!currentImportant.importantLoading
																							? () => {
																									setTodos((todos) => {
																										const { [key]: currentImportant } = todos.important
																										return {
																											...todos,
																											important: { ...todos.important, [currentImportant._id]: { ...currentImportant, importantLoading: true } },
																										}
																									})
																									authApi
																										.post("/api/todo/important", {
																											_id: key,
																											to: false,
																										})
																										.then(() => {
																											todos[getDate(currentImportant.date)]
																												? setTodos((todos) => {
																														const { [key]: currentImportant, ...important } = todos.important
																														return {
																															...todos,
																															important,
																															[getDate(currentImportant.date)]: {
																																...todos[getDate(currentImportant.date)],
																																[currentImportant._id]: { ...currentImportant, importantLoading: false },
																															},
																														}
																												  })
																												: setTodos((todos) => {
																														const { [key]: currentImportant, ...important } = todos.important
																														return {
																															...todos,
																															important,
																														}
																												  })
																										})
																							  }
																							: () => {}
																					}
																					icon={currentImportant.importantLoading ? faSpinner : faStar}
																					spin={currentImportant.importantLoading}
																					className="cursor-pointer mx-1 text-warning"
																				/>
																				<FontAwesomeIcon
																					onClick={
																						!currentImportant.statusLoading
																							? () => {
																									setTodos((todos) => {
																										const { [key]: currentImportant } = todos.important
																										return { ...todos, important: { ...todos.important, [currentImportant._id]: { ...currentImportant, statusLoading: true } } }
																									})
																									authApi
																										.post("/api/todo/status", {
																											_id: key,
																											to: currentImportant.status === "true" ? false : true,
																										})
																										.then(() => {
																											setTodos((todos) => {
																												const { [key]: currentImportant } = todos.important
																												if (currentImportant)
																													return {
																														...todos,
																														important: {
																															...todos.important,
																															[key]: {
																																...currentImportant,
																																status: currentImportant.status === "true" ? "false" : "true",
																																statusLoading: false,
																															},
																														},
																													}
																												else {
																													const currentTodo = searchItem(todos, key)
																													if (currentTodo)
																														return {
																															...todos,
																															[getDate(currentTodo.date)]: {
																																...todos[getDate(currentTodo.date)],
																																[currentTodo._id]: {
																																	...currentTodo,
																																	status: currentTodo.status === "true" ? "false" : "true",
																																	statusLoading: false,
																																},
																															},
																														}
																													else return todos
																												}
																											})
																										})
																							  }
																							: () => {}
																					}
																					icon={currentImportant.statusLoading ? faSpinner : currentImportant.status === "true" ? faSquareCheck : faSquare}
																					spin={currentImportant.statusLoading}
																					className="cursor-pointer mx-1 text-secondary"
																				/>
																				{todos[getDate(currentImportant.date) + "_children"] && todos[getDate(currentImportant.date) + "_children"][key] && Object.keys(todos[getDate(currentImportant.date) + "_children"][key]).length ? (
																					<FontAwesomeIcon
																						onClick={() => {
																							setTodos((todos) => {
																								const { [key]: currentImportant } = todos.important
																								return {
																									...todos,
																									important: {
																										...todos.important,
																										[key]: {
																											...currentImportant,
																											isCollapsed: !currentImportant.isCollapsed,
																										},
																									},
																								}
																							})
																						}}
																						icon={currentImportant.isCollapsed ? faEyeSlash : faEye}
																						className="cursor-pointer mx-1 text-primary"
																					/>
																				) : (
																					<></>
																				)}
																				<FontAwesomeIcon onClick={() => editItem(currentImportant, true)} icon={faPencil} className="cursor-pointer mx-1 text-info" />
																				<FontAwesomeIcon
																					onClick={
																						!currentImportant.removeLoading
																							? () => {
																									setTodos((todos) => {
																										const { [key]: currentImportant } = todos.important
																										return {
																											...todos,
																											important: { ...todos.important, [currentImportant._id]: { ...currentImportant, removeLoading: true } },
																										}
																									})
																									authApi
																										.post("/api/todo/remove", {
																											_id: key,
																										})
																										.then(() => {
																											setTodos((todos) => {
																												const { [key]: currentImportant, ...important } = todos.important
																												if (currentImportant)
																													return {
																														...todos,
																														important,
																													}
																												else {
																													const currentTodo = searchItem(todos, key)
																													if (currentTodo) {
																														const { [key]: removingCurrentTodo, ...restTodos } = todos[getDate(currentTodo.date)]
																														return {
																															...todos,
																															[getDate(currentTodo.date)]: {
																																...restTodos,
																															},
																														}
																													} else return todos
																												}
																											})
																										})
																							  }
																							: () => {}
																					}
																					icon={currentImportant.removeLoading ? faSpinner : faX}
																					spin={currentImportant.removeLoading}
																					className="cursor-pointer mx-1 text-danger"
																				/>
																			</Col>
																			<Collapse in={currentImportant.isCollapsed && todos[getDate(currentImportant.date) + "_children"][key] && Object.keys(todos[getDate(currentImportant.date) + "_children"][key]).length ? true : false} className="mt-3">
																				<Col sm={12}>
																					{todos[getDate(currentImportant.date) + "_children"] && todos[getDate(currentImportant.date) + "_children"][key] ? (
																						<ListGroup>
																							{Object.keys(todos[getDate(currentImportant.date) + "_children"][key])
																								.sort()
																								.map((childKey) => {
																									const { [childKey]: currentChild } = todos[getDate(currentImportant.date) + "_children"][key]
																									return (
																										<ListGroup.Item key={childKey} className="bg-transparent text-white">
																											<Row>
																												<Col sm={9} className="text-center text-sm-start">
																													{currentChild.details && currentChild.details.length ? (
																														<FontAwesomeIcon
																															onClick={() => {
																																Swal.fire({
																																	html: `<p class="text-white">${currentChild.details}</p>`,
																																	showCancelButton: true,
																																	showConfirmButton: false,
																																	cancelButtonText: "Close",
																																})
																															}}
																															icon={faInfoCircle}
																															className="cursor-pointer me-2 text-primary"
																														/>
																													) : (
																														<></>
																													)}
																													{currentChild.title}
																												</Col>
																												<Col sm={3} className="text-center text-sm-end">
																													<FontAwesomeIcon
																														onClick={
																															!currentChild.statusLoading
																																? () => {
																																		setTodos((todos) => {
																																			const { [key]: currentImportant } = todos.important
																																			return {
																																				...todos,
																																				[getDate(currentImportant.date) + "_children"]: {
																																					...todos[getDate(currentImportant.date) + "_children"],
																																					[key]: {
																																						...todos[getDate(currentImportant.date) + "_children"][key],
																																						[childKey]: {
																																							...todos[getDate(currentImportant.date) + "_children"][key][childKey],
																																							statusLoading: true,
																																						},
																																					},
																																				},
																																			}
																																		})
																																		authApi
																																			.post("/api/todo/status", {
																																				_id: childKey,
																																				to: todos[getDate(currentImportant.date) + "_children"][key][childKey].status === "true" ? false : true,
																																			})
																																			.then(() => {
																																				setTodos((todos) => {
																																					const { [key]: currentImportant } = todos.important
																																					if (currentImportant)
																																						return {
																																							...todos,
																																							[getDate(currentImportant.date) + "_children"]: {
																																								...todos[getDate(currentImportant.date) + "_children"],
																																								[key]: {
																																									...todos[getDate(currentImportant.date) + "_children"][key],
																																									[childKey]: {
																																										...todos[getDate(currentImportant.date) + "_children"][key][childKey],
																																										status: todos[getDate(currentImportant.date) + "_children"][key][childKey].status === "true" ? "false" : "true",
																																										statusLoading: false,
																																									},
																																								},
																																							},
																																						}
																																					else {
																																						const currentTodo = searchItem(todos, key)
																																						if (currentTodo)
																																							return {
																																								...todos,
																																								[getDate(currentTodo.date) + "_children"]: {
																																									...todos[getDate(currentTodo.date) + "_children"],
																																									[key]: {
																																										...todos[getDate(currentTodo.date) + "_children"][key],
																																										[childKey]: {
																																											...todos[getDate(currentTodo.date) + "_children"][key][childKey],
																																											status: todos[getDate(currentTodo.date) + "_children"][key][childKey].status === "true" ? "false" : "true",
																																											statusLoading: false,
																																										},
																																									},
																																								},
																																							}
																																						else return todos
																																					}
																																				})
																																			})
																																  }
																																: () => {}
																														}
																														icon={currentChild.statusLoading ? faSpinner : todos[getDate(currentImportant.date) + "_children"][key][childKey].status === "true" ? faSquareCheck : faSquare}
																														spin={currentChild.statusLoading}
																														className="cursor-pointer mx-1 text-secondary"
																													/>
																													<FontAwesomeIcon onClick={() => editItem(todos[getDate(currentImportant.date) + "_children"][key][childKey], false)} icon={faPencil} className="cursor-pointer mx-1 text-info" />
																													<FontAwesomeIcon
																														onClick={
																															!currentChild.removeLoading
																																? () => {
																																		setTodos((todos) => {
																																			const { [key]: currentImportant } = todos.important
																																			return {
																																				...todos,
																																				[getDate(currentImportant.date) + "_children"]: {
																																					...todos[getDate(currentImportant.date) + "_children"],
																																					[key]: {
																																						...todos[getDate(currentImportant.date) + "_children"][key],
																																						[childKey]: {
																																							...todos[getDate(currentImportant.date) + "_children"][key][childKey],
																																							removeLoading: true,
																																						},
																																					},
																																				},
																																			}
																																		})
																																		authApi
																																			.post("/api/todo/remove", {
																																				_id: childKey,
																																			})
																																			.then(() => {
																																				setTodos((todos) => {
																																					const { [childKey]: currentChild, ...restChildren } = todos[getDate(currentImportant.date) + "_children"][key]
																																					return {
																																						...todos,
																																						[getDate(currentImportant.date) + "_children"]: {
																																							...todos[getDate(currentImportant.date) + "_children"],
																																							[key]: restChildren,
																																						},
																																					}
																																				})
																																			})
																																  }
																																: () => {}
																														}
																														icon={currentChild.removeLoading ? faSpinner : faX}
																														spin={currentChild.removeLoading}
																														className="cursor-pointer mx-1 text-danger"
																													/>
																												</Col>
																											</Row>
																										</ListGroup.Item>
																									)
																								})}
																						</ListGroup>
																					) : (
																						<></>
																					)}
																				</Col>
																			</Collapse>
																		</Row>
																	</ListGroup.Item>
																)
															})}
													</ListGroup>
												) : (
													<></>
												)}
												{todos.important && Object.keys(todos.important).length && todos[date] && Object.keys(todos[date]).length ? <hr /> : <></>}
												{todos[date] && Object.keys(todos[date]).length ? (
													<ListGroup>
														{Object.keys(todos[date])
															.sort()
															.map((key) => {
																const { [key]: currentTodo } = todos[date]
																return (
																	<ListGroup.Item className="bg-transparent text-white mx-3" key={key}>
																		<Row>
																			<Col sm={8} className="text-center text-sm-start">
																				{currentTodo.details && currentTodo.details.length ? (
																					<FontAwesomeIcon
																						onClick={() => {
																							Swal.fire({
																								html: `<p class="text-white">${currentTodo.details}</p>`,
																								showCancelButton: true,
																								showConfirmButton: false,
																								cancelButtonText: "Close",
																							})
																						}}
																						icon={faInfoCircle}
																						className="cursor-pointer me-2 text-primary"
																					/>
																				) : (
																					<></>
																				)}
																				{currentTodo.title}
																			</Col>
																			<Col sm={4} className="text-center text-sm-end">
																				<FontAwesomeIcon
																					onClick={() => {
																						addItem(currentTodo._id)
																					}}
																					icon={faPlus}
																					className="cursor-pointer mx-1 text-success"
																				/>
																				<FontAwesomeIcon
																					onClick={
																						!currentTodo.importantLoading
																							? () => {
																									setTodos((todos) => {
																										const { [key]: currentTodo } = todos[date]
																										return {
																											...todos,
																											[date]: {
																												...todos[date],
																												[currentTodo._id]: { ...currentTodo, importantLoading: true },
																											},
																										}
																									})
																									authApi
																										.post("/api/todo/important", {
																											_id: key,
																											to: true,
																										})
																										.then(() => {
																											setTodos((todos) => {
																												const { [key]: currentTodo, ...restTodos } = todos[date]
																												return {
																													...todos,
																													[date]: restTodos,
																													important: {
																														...todos.important,
																														[key]: { ...currentTodo, importantLoading: false },
																													},
																												}
																											})
																										})
																							  }
																							: () => {}
																					}
																					icon={currentTodo.importantLoading ? faSpinner : farStar}
																					spin={currentTodo.importantLoading}
																					className="cursor-pointer mx-1 text-warning"
																				/>
																				<FontAwesomeIcon
																					onClick={
																						!currentTodo.statusLoading
																							? () => {
																									setTodos((todos) => {
																										const { [key]: currentTodo } = todos[date]
																										return {
																											...todos,
																											[date]: {
																												...todos[date],
																												[key]: {
																													...currentTodo,
																													statusLoading: true,
																												},
																											},
																										}
																									})
																									authApi
																										.post("/api/todo/status", {
																											_id: key,
																											to: currentTodo.status === "true" ? false : true,
																										})
																										.then(() => {
																											setTodos((todos) => {
																												const { [key]: currentTodo } = todos[date]
																												if (currentTodo)
																													return {
																														...todos,
																														[date]: {
																															...todos[date],
																															[key]: {
																																...currentTodo,
																																status: currentTodo.status === "true" ? "false" : "true",
																																statusLoading: false,
																															},
																														},
																													}
																												else {
																													const currentImportant = searchItem(todos, key)
																													if (currentImportant)
																														return {
																															...todos,
																															important: {
																																...todos.important,
																																[currentImportant._id]: {
																																	...currentImportant,
																																	status: currentImportant.status === "true" ? "false" : "true",
																																	statusLoading: false,
																																},
																															},
																														}
																													else return todos
																												}
																											})
																										})
																							  }
																							: () => {}
																					}
																					icon={currentTodo.statusLoading ? faSpinner : currentTodo.status === "true" ? faSquareCheck : faSquare}
																					spin={currentTodo.statusLoading}
																					className="cursor-pointer mx-1 text-secondary"
																				/>
																				{todos[getDate(currentTodo.date) + "_children"] && todos[getDate(currentTodo.date) + "_children"][key] && Object.keys(todos[getDate(currentTodo.date) + "_children"][key]).length ? (
																					<FontAwesomeIcon
																						onClick={() => {
																							setTodos((todos) => {
																								const { [key]: currentTodo } = todos[date]
																								return {
																									...todos,
																									[date]: {
																										...todos[date],
																										[key]: {
																											...currentTodo,
																											isCollapsed: !currentTodo.isCollapsed,
																										},
																									},
																								}
																							})
																						}}
																						icon={currentTodo.isCollapsed ? faEyeSlash : faEye}
																						className="cursor-pointer mx-1 text-primary"
																					/>
																				) : (
																					<></>
																				)}
																				<FontAwesomeIcon onClick={() => editItem(currentTodo, false)} icon={faPencil} className="cursor-pointer mx-1 text-info" />
																				<FontAwesomeIcon
																					onClick={
																						!currentTodo.removeLoading
																							? () => {
																									setTodos((todos) => {
																										const { [key]: currentTodo } = todos[date]
																										return {
																											...todos,
																											[date]: {
																												...todos[date],
																												[key]: {
																													...currentTodo,
																													removeLoading: true,
																												},
																											},
																										}
																									})
																									authApi
																										.post("/api/todo/remove", {
																											_id: key,
																										})
																										.then(() => {
																											setTodos((todos) => {
																												const { [key]: currentTodo, ...restTodos } = todos[date]
																												if (currentTodo)
																													return {
																														...todos,
																														[date]: {
																															...restTodos,
																														},
																													}
																												else {
																													const currentImportant = searchItem(todos, key)
																													if (currentImportant) {
																														const { [key]: removingCurrentImportant, ...important } = todos.important
																														return {
																															...todos,
																															important,
																														}
																													} else return todos
																												}
																											})
																										})
																							  }
																							: () => {}
																					}
																					icon={currentTodo.removeLoading ? faSpinner : faX}
																					spin={currentTodo.removeLoading}
																					className="cursor-pointer mx-1 text-danger"
																				/>
																			</Col>
																			<Collapse in={currentTodo.isCollapsed && todos[getDate(currentTodo.date) + "_children"][key] && Object.keys(todos[getDate(currentTodo.date) + "_children"][key]).length ? true : false} className="mt-3">
																				<Col sm={12}>
																					{todos[getDate(currentTodo.date) + "_children"] && todos[getDate(currentTodo.date) + "_children"][key] ? (
																						<ListGroup>
																							{Object.keys(todos[getDate(currentTodo.date) + "_children"][key])
																								.sort()
																								.map((childKey) => {
																									const { [childKey]: currentChild } = todos[getDate(currentTodo.date) + "_children"][key]
																									return (
																										<ListGroup.Item key={childKey} className="bg-transparent text-white">
																											<Row>
																												<Col sm={9} className="text-center text-sm-start">
																													{currentChild.details && currentChild.details.length ? (
																														<FontAwesomeIcon
																															onClick={() => {
																																Swal.fire({
																																	html: `<p class="text-white">${currentChild.details}</p>`,
																																	showCancelButton: true,
																																	showConfirmButton: false,
																																	cancelButtonText: "Close",
																																})
																															}}
																															icon={faInfoCircle}
																															className="cursor-pointer me-2 text-primary"
																														/>
																													) : (
																														<></>
																													)}
																													{currentChild.title}
																												</Col>
																												<Col sm={3} className="text-center text-sm-end">
																													<FontAwesomeIcon
																														onClick={
																															!currentChild.statusLoading
																																? () => {
																																		setTodos((todos) => {
																																			const { [childKey]: currentChild } = todos[getDate(currentTodo.date) + "_children"][key]
																																			return {
																																				...todos,
																																				[getDate(currentTodo.date) + "_children"]: {
																																					...todos[getDate(currentTodo.date) + "_children"],
																																					[key]: {
																																						...todos[getDate(currentTodo.date) + "_children"][key],
																																						[childKey]: {
																																							...currentChild,
																																							statusLoading: true,
																																						},
																																					},
																																				},
																																			}
																																		})
																																		authApi
																																			.post("/api/todo/status", {
																																				_id: childKey,
																																				to: currentChild.status === "true" ? false : true,
																																			})
																																			.then(() => {
																																				setTodos((todos) => {
																																					const { [childKey]: currentChild } = todos[getDate(currentTodo.date) + "_children"][key]
																																					if (currentChild)
																																						return {
																																							...todos,
																																							[getDate(currentTodo.date) + "_children"]: {
																																								...todos[getDate(currentTodo.date) + "_children"],
																																								[key]: {
																																									...todos[getDate(currentTodo.date) + "_children"][key],
																																									[childKey]: {
																																										...currentChild,
																																										status: currentChild.status === "true" ? "false" : "true",
																																										statusLoading: false,
																																									},
																																								},
																																							},
																																						}
																																					else {
																																						const currentTodo = searchItem(todos, key)
																																						if (currentTodo)
																																							return {
																																								...todos,
																																								[getDate(currentTodo.date) + "_children"]: {
																																									...todos[getDate(currentTodo.date) + "_children"],
																																									[key]: {
																																										...todos[getDate(currentTodo.date) + "_children"][key],
																																										[childKey]: {
																																											...todos[getDate(currentTodo.date) + "_children"][key][childKey],
																																											status: todos[getDate(currentTodo.date) + "_children"][key][childKey].status === "true" ? "false" : "true",
																																											statusLoading: false,
																																										},
																																									},
																																								},
																																							}
																																						else return todos
																																					}
																																				})
																																			})
																																  }
																																: () => {}
																														}
																														icon={currentChild.statusLoading ? faSpinner : currentChild.status === "true" ? faSquareCheck : faSquare}
																														spin={currentChild.statusLoading}
																														className="cursor-pointer mx-1 text-secondary"
																													/>
																													<FontAwesomeIcon onClick={() => editItem(currentChild, false)} icon={faPencil} className="cursor-pointer mx-1 text-info" />
																													<FontAwesomeIcon
																														onClick={
																															!currentChild.removeLoading
																																? () => {
																																		setTodos((todos) => {
																																			const { [childKey]: currentChild } = todos[getDate(currentTodo.date) + "_children"][key]
																																			return {
																																				...todos,
																																				[getDate(currentTodo.date) + "_children"]: {
																																					...todos[getDate(currentTodo.date) + "_children"],
																																					[key]: {
																																						...todos[getDate(currentTodo.date) + "_children"][key],
																																						[childKey]: {
																																							...currentChild,
																																							removeLoading: true,
																																						},
																																					},
																																				},
																																			}
																																		})
																																		authApi
																																			.post("/api/todo/remove", {
																																				_id: childKey,
																																			})
																																			.then(() => {
																																				setTodos((todos) => {
																																					const { [childKey]: currentChild, ...restChildren } = todos[getDate(currentTodo.date) + "_children"][key]
																																					return {
																																						...todos,
																																						[getDate(currentTodo.date) + "_children"]: {
																																							...todos[getDate(currentTodo.date) + "_children"],
																																							[key]: restChildren,
																																						},
																																					}
																																				})
																																			})
																																  }
																																: () => {}
																														}
																														icon={currentChild.removeLoading ? faSpinner : faX}
																														spin={currentChild.removeLoading}
																														className="cursor-pointer mx-1 text-danger"
																													/>
																												</Col>
																											</Row>
																										</ListGroup.Item>
																									)
																								})}
																						</ListGroup>
																					) : (
																						<></>
																					)}
																				</Col>
																			</Collapse>
																		</Row>
																	</ListGroup.Item>
																)
															})}
													</ListGroup>
												) : (
													<></>
												)}
												<Row className="my-3">
													<Col className="text-center">
														<Button className="mx-2 my-2" variant="success" onClick={addItem}>
															Add Task
														</Button>
														{useCategory && category !== "-1" && category !== "addNew" ? (
															<Button className="mx-2 my-2" variant="warning" onClick={deleteCategory}>
																Delete Category
															</Button>
														) : (
															<></>
														)}
													</Col>
												</Row>
											</Col>
										</Row>
									</Col>
								</Row>
							</Container>
						</div>
					) : (
						<Loading />
					)
				}
			/>
		</Routes>
	)
}
export default ToDo
