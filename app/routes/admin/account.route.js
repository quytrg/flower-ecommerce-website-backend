const express = require("express");
const router = express.Router();

// upload files by multer
const multer = require("multer");
const upload = multer();

// middlewares
const uploadToCloudMiddleware = require("../../middlewares/admin/uploadToCloud.middleware");
const permissionMiddleware = require("../../middlewares/admin/permission.middleware.js")

const accountController = require("../../controllers/admin/account.controller");

router.route("/:id")
    .get(accountController.findOne)
    .delete(accountController.deleteOne)
    .patch(
        upload.single("avatar"),
        uploadToCloudMiddleware.uploadImage,
        accountController.updateOne
    )
    

router.route("/")
    .get(permissionMiddleware.readAccounts, accountController.find)
    .post(
        upload.single("avatar"),
        uploadToCloudMiddleware.uploadImage,
        accountController.create
    );

module.exports = router;
