const express = require('express')
const router = express.Router()

const authController = require('../../controllers/admin/auth.controller')

router.post('/login', authController.find)
// router.get('/:slug', categoryController.find)

module.exports = router