const express = require("express")
const router = express.Router()
const {
	register,
	login,
	get,
	logout,
} = require("../controllers/userController")
const { jwtCP, csrfP } = require("../middlewares/authMiddleware")

router.post("/register", register)
router.post("/login", login)
router.get("/logout", [jwtCP, csrfP], logout)
router.get("/get", [jwtCP, csrfP], get)

module.exports = router
