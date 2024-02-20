const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connect to the database successfully!')
    }
    catch (err) {
        console.log('Cannot connect to database!')
    }
}