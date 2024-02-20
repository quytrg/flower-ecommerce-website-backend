const express = require('express')
const router = express.Router()

// upload files by multer
const multer = require('multer')
const upload = multer()

// middlewares
const uploadToCloudMiddleware = require('../../middlewares/admin/uploadToCloud.middleware')

const productController = require('../../controllers/admin/product.controller')

router.route('/change-multi')
    .patch(productController.updateMany)

router.route('/:slug')
    .get(productController.findBySlug)

router.route('/:id')
    .patch(
        upload.single('thumbnail'),
        uploadToCloudMiddleware.uploadImage,
        productController.updateOne
    )
    .delete(productController.deleteOne)

router.route('/')
    .get(productController.find)
    .post(
        upload.single('thumbnail'),
        uploadToCloudMiddleware.uploadImage,
        productController.create
    )

module.exports = router