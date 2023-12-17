const asyncHandler = require("express-async-handler")
const ToDO = require("../models/todoModel")
const Category = require("../models/categoryModel")

const addCategory = asyncHandler(async (req, res) => {
	try {
		const { title } = req.body
		const user = req.user
		let categoryData = {
			title,
			user,
			date: new Date(),
		}
		const category = await Category.create(categoryData)
		res.status(200).json({ category })
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong ${error}`)
	}
})
const getCategory = asyncHandler(async (req, res) => {
	try {
		const user = req.user
		const category = await Category.find({ user })
		res.status(200).json({ category })
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong ${error}`)
	}
})
const deleteCategory = asyncHandler(async (req, res) => {
	try {
		const { date } = req.body
		const user = req.user
		await Category.findOneAndDelete({ user, date })
		const category = await Category.find({ user })
		res.status(200).json({ category })
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong ${error}`)
	}
})
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
		const { date, getImportant } = req.body
		const user = req.user
		const ToDos = await ToDO.find({
			$and: [{ parent: { $exists: false } }, { $or: [{ date }] }, { user }, { isImportant: false }],
		}).select(["title", "details", "date", "status"])
		if (getImportant) {
			const ImportantToDos = await ToDO.find({
				user,
				parent: undefined,
				isImportant: true,
			}).select(["title", "details", "date", "status"])
			const ToDosChildren = await ToDO.find({
				$not: { parent: { $type: "null" } },
				parent: { $exists: true },
				$or: [{ date }, { parent: { $in: ImportantToDos } }],
				user,
				isImportant: false,
			}).select(["title", "details", "date", "parent", "status"])
			res.status(200).json({ ToDos, ImportantToDos, ToDosChildren })
		} else {
			const ToDosChildren = await ToDO.find({
				$not: { parent: { $type: "null" } },
				$or: [{ parent: { $exists: true } }, { parent: { $in: ToDos } }],
				date,
				user,
				isImportant: false,
			}).select(["title", "details", "date", "parent", "status"])
			res.status(200).json({ ToDos, ToDosChildren })
		}
	} catch (error) {
		res.status(422)
		throw new Error(`Something went wrong ${error}`)
	}
})

module.exports = {
	addCategory,
	getCategory,
	deleteCategory,
	create,
	edit,
	remove,
	status,
	important,
	get,
}
