const ApiError = require('../../middlewares/api-error.js')
const uploadImageHelper = require('../../helpers/uploadImage.helper.js')

module.exports.uploadImage = async (req, res, next) => {
    try {

        if (req.file) {
            req.body[req.file.fieldname] = await uploadImageHelper.uploadToCloudinary(req.file.buffer)
        }
        next()
    }
    catch(err) {
        return next (
            new ApiError(500, "An error occurred while uploading the images to cloud")
        )
    }
}