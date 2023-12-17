const mongoose = require("mongoose")
const categorySchema = mongoose.Schema(
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
		date: {
			type: Date,
			required: [true, "Please fill the date field"],
			unique: true,
		},
	},
	{ timestamps: true }
)
module.exports = mongoose.model("Category", categorySchema)
