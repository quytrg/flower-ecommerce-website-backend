const express = require('express')
const router = express.Router()

const authController = require('../../controllers/admin/auth.controller')

router.post('/login', authController.find)

module.exports = router