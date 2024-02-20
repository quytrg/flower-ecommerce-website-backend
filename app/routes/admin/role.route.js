const express = require('express')
const router = express.Router()

const roleController = require('../../controllers/admin/role.controller')

router.get('/', roleController.find)
// router.get('/:slug', categoryController.find)

module.exports = router