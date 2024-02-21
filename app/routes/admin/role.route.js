const express = require('express')
const router = express.Router()

const roleController = require('../../controllers/admin/role.controller')

router.route('/')
    .get(roleController.find)

module.exports = router