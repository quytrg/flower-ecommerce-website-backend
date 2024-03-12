const express = require('express')
const router = express.Router()

// middlewares
const authMiddleware = require('../../middlewares/admin/auth.middleware')

const authController = require('../../controllers/admin/auth.controller')

router.post('/login', authController.login)

router.patch('/refresh-token', authController.refreshToken)

router.delete('/logout', authMiddleware.requireAuth, authController.logout)

router.get('/me', authMiddleware.requireAuth, authController.info)

module.exports = router