const ApiError = require('../../middlewares/api-error.js')
const uploadImageHelper = require('../../helpers/uploadImage.helper.js')

module.exports.uploadImage = async (req, res, next) => {
    try {
        if (req.file) {
            req.body[req.file.fieldname] = await uploadImageHelper.uploadToCloudinary(req.file.buffer)
        }
        if (req.files && req.files.length) {
            req.body[req.files[0].fieldname] = []
            for (file of req.files) {
                const url = await uploadImageHelper.uploadToCloudinary(file.buffer)
                req.body[file.fieldname].push(url)
            }
        }
        next()
    }
    catch(err) {
        return next (
            new ApiError(500, "An error occurred while uploading the images to cloud")
        )
    }
}