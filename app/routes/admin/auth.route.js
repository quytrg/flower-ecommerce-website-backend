const express = require('express')
const router = express.Router()

// middlewares
const authMiddleware = require('../../middlewares/admin/auth.middleware')

const authController = require('../../controllers/admin/auth.controller')

router.post('/login', authController.login)

router.post('/refresh-token', authController.refreshToken)

router.delete('/logout', authMiddleware.requireAuth ,authController.logout)

module.exports = router