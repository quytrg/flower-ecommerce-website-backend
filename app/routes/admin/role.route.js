const express = require('express')
const router = express.Router()

const roleController = require('../../controllers/admin/role.controller')

router.route('/')
    .get(roleController.find)
    .post(roleController.create)

router.route('/:id')
    .get(roleController.findById)

module.exports = router