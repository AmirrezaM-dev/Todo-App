const asyncHandler = require("express-async-handler")
const ToDO = require("../models/todoModel")

const create = asyncHandler(async (req, res) => {
	try {
		const { title, details, parent_id, isImportant, date, status } = req.body
		const user = req.user
		let todoObject = {
			user,
			title,
			details,
			isImportant,
			date,
			status,
		}
		if (parent_id) {
			let parent = await ToDO.findOne({ _id: parent_id })
			if (parent) todoObject = { ...todoObject, parent }
		}

		const todo = await ToDO.create(todoObject)
		const newTodo = {
			_id: todo._id,
			title,
			details,
			isImportant,
			date,
			status,
			parent: parent_id ? parent_id : undefined,
		}

		res.status(200).json({ newTodo })
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong ${error}`)
	}
})
const edit = asyncHandler(async (req, res) => {
	try {
		const { id, title, details, isImportant, date, status } = req.body
		const user = req.user
		await ToDO.findOneAndUpdate(
			{ _id: id, user },
			{
				title,
				details,
				isImportant,
				date,
				status,
			}
		)
		res.status(200).json({})
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong`)
	}
})
const remove = asyncHandler(async (req, res) => {
	try {
		const { _id } = req.body
		const user = req.user
		await ToDO.deleteMany({ parent: _id, user })
		await ToDO.findOneAndDelete({ _id, user })
		res.status(200).json({})
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong`)
	}
})
const status = asyncHandler(async (req, res) => {
	try {
		const { to, _id } = req.body
		const user = req.user
		await ToDO.findOneAndUpdate({ _id, user }, { status: to })
		res.status(200).json({})
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong`)
	}
})
const important = asyncHandler(async (req, res) => {
	try {
		const { to, _id } = req.body
		const user = req.user
		await ToDO.findOneAndUpdate({ _id, user }, { isImportant: to })
		res.status(200).json({})
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong`)
	}
})
const get = asyncHandler(async (req, res) => {
	try {
		const { date } = req.body
		const user = req.user
		const ToDos = await ToDO.find({
			$and: [{ parent: { $exists: false } }, { $or: [{ date }] }, { user }, { isImportant: false }],
		})
			.sort({ updatedAt: 1 })
			.select(["title", "details", "date", "status"])
		const ToDosChildren = await ToDO.find({
			$not: { parent: { $type: "null" } },
			parent: { $exists: true },
			date,
			user,
			isImportant: false,
		}).select(["title", "details", "date", "parent", "status"])
		res.status(200).json({ ToDos, ToDosChildren })
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong ${error}`)
	}
})
const getImportant = asyncHandler(async (req, res) => {
	try {
		const user = req.user
		const ToDos = await ToDO.find({
			user,
			parent: undefined,
			isImportant: true,
		})
			.sort({ updatedAt: 1 })
			.select(["title", "details", "date", "status"])
		res.status(200).json({ ToDos })
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong ${error}`)
	}
})

module.exports = {
	create,
	edit,
	remove,
	status,
	important,
	get,
	getImportant,
}
