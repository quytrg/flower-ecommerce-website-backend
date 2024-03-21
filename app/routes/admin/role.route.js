const express = require('express')
const router = express.Router()

const roleController = require('../../controllers/admin/role.controller')

router.route('/')
    .get(roleController.find)
    .post(roleController.create)

router.route('/updatePermission')
    .patch(roleController.updatePermission)

router.route('/:id')
    .get(roleController.findById)
    .patch(roleController.updateOne)
    .delete(roleController.deleteOne)
    


module.exports = router