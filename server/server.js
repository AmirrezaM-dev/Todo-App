const net = require('net')
const server = net.createServer()
let port = 9000
server.once('error', (e) => {
	if (e.code === 'EADDRINUSE') {
		port = port + 1
		server.listen(port)
	}
})
server.once('listening', function () { server.close() })
server.listen(port)
server.once('close', function () {
	const express = require('express')
	const router = express.Router()
	const cors = require('cors')
	const { errorHandler } = require('./middlewares/errorMiddleware')
	const connectDB = require('./configs/db')
	const app = express()
	const cookieParser = require('cookie-parser')
	const origins = ["http://127.0.0.1:3000", "http://localhost:3000"]

	connectDB()

	app.use(cookieParser())

	app.use(cors({
		origin: origins,
		credentials: true
	}))

	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))

	app.use("/api/users", require('./routes/userRoutes'))
	app.use("/api/todo", require('./routes/todoRoutes'))

	app.use(errorHandler)
	app.listen(port, () => { console.log(`Server started on port ${port}`) })
})