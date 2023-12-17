const mongoose = require("mongoose")
const todoSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: [true, "Please fill the title field"],
		},
		details: {
			type: String,
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ToDo",
		},
		isImportant: {
			type: Boolean,
			default: false,
		},
		isDaily: {
			type: Boolean,
			default: false,
		},
		date: {
			type: Date,
			required: [true, "Please fill the date field"],
		},
		status: {
			type: String,
			default: false,
		},
	},
	{ timestamps: true }
)
module.exports = mongoose.model("ToDo", todoSchema)
