const express = require('express')
const router = express.Router()

const accountController = require('../../controllers/admin/account.controller')

router.patch('/change-status/:id', accountController.updateOne)
// router.patch('/change-multi', productController.updateMany)
router.post('/create', accountController.create)
router.put('/update/:id', accountController.updateOne)
router.get('/:id', accountController.findOne)
router.delete('/:id', accountController.deleteOne)
router.get('/', accountController.find)

module.exports = router