const express = require('express')
const router = express.Router()

// upload files by multer
const multer = require('multer')
const upload = multer()

// middlewares
const uploadToCloudMiddleware = require('../../middlewares/admin/uploadToCloud.middleware')
const permissionMiddleware = require('../../middlewares/admin/permission.middleware')

// validates
const productValidate = require('../../validates/product.validate')

const productController = require('../../controllers/admin/product.controller')

router.route('/change-multi')
    .patch(permissionMiddleware.updateProducts, productController.updateMany)

router.route('/:slug')
    .get(permissionMiddleware.readProducts, productController.findBySlug)

router.route('/:id')
    .patch(
        permissionMiddleware.updateProducts,
        upload.single('thumbnail'),
        productValidate.validate,
        uploadToCloudMiddleware.uploadImage,
        productController.updateOne
    )
    .delete(permissionMiddleware.deleteProducts, productController.deleteOne)

router.route('/')
    .get(permissionMiddleware.readProducts, productController.find)
    .post(
        permissionMiddleware.createProducts,
        upload.single('thumbnail'),
        productValidate.validate,
        uploadToCloudMiddleware.uploadImage,
        productController.create
    )

module.exports = router