const express = require("express")
const router = express.Router()
const { create, edit, remove, status, important, get } = require("../controllers/todoController")
const { jwtCP, csrfP } = require("../middlewares/authMiddleware")

router.post("/create", [jwtCP, csrfP], create)
router.post("/edit", [jwtCP, csrfP], edit)
router.post("/remove", [jwtCP, csrfP], remove)
router.post("/status", [jwtCP, csrfP], status)
router.post("/important", [jwtCP, csrfP], important)
router.post("/get", [jwtCP, csrfP], get)

module.exports = router
