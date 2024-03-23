const express = require('express')
const router = express.Router()

// upload files by multer
const multer = require('multer')
const upload = multer()

// middlewares
const uploadToCloudMiddleware = require('../../middlewares/admin/uploadToCloud.middleware')

const categoryController = require('../../controllers/admin/category.controller')

router.route('/')
    .get(categoryController.find)
    .post(
        upload.array('thumbnails', 6),
        uploadToCloudMiddleware.uploadImage,
        categoryController.create
    )

router.route('/product/:id')
    .get(categoryController.findCategoriesByProductId)
    router.route('/')

router.route('/:id')
    .get(categoryController.findOne)
    .patch(
        upload.array('thumbnails', 6),
        uploadToCloudMiddleware.uploadImage,
        categoryController.updateOne
    )
    .delete(categoryController.deleteOne)

module.exports = router