const express = require('express')
const router = express.Router()

const accountController = require('../../controllers/admin/account.controller')

router.patch('/change-status/:id', accountController.updateOne)
// router.patch('/change-multi', productController.updateMany)
router.post('/create', accountController.create)
router.put('/update/:id', accountController.updateOne)

router.route('/:id')
    .get(accountController.findOne)
    .delete(accountController.deleteOne)

router.route('/')
    .get(accountController.find)

module.exports = router