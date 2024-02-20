// cloudinary storage
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports.uploadToCloudinary = async (buffer) => {
    try {
        let result = await streamUpload(buffer);
        return result.url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}
