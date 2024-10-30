const mongoose = require('mongoose')

const { createClient } = require('redis')

module.exports.connectMongoose = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connect to mongodb successfully!')
    }
    catch (err) {
        console.log('Connect to mongodb failure!')
    }
}

module.exports.connectRedis = async () => {
    try {
        const client = await createClient({
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }
        })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

        if (client.isReady) {
            console.log("Redis ready")
        }

        return client
    }
    catch (error) {
        console.log('Connect to redis database failure!')
    }
}

