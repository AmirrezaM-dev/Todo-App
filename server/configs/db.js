const mongoose = require("mongoose")
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			"mongodb+srv://user:pass@todoapp.93q85df.mongodb.net"
		)
		console.log(`MongoDB connected ${conn.connection.host}`)
	} catch (error) {
		console.log(error)
		// proccess.exit(1)
	}
}

module.exports = connectDB
