const express = require('express')
const cors = require('cors')
const ApiError = require('./app/middlewares/api-error')
const clientRouter = require('./app/routes/client/index.route')
const adminRouter = require('./app/routes/admin/index.route')
require('dotenv').config()
const systemConfig = require('./app/config/system')

const app = express()

app.use(cors())
app.use(express.json())

// local variables within the application
app.locals.apiPrefix = systemConfig.apiPrefix
app.locals.clientPrefix = systemConfig.clientPrefix
app.locals.adminPrefix = systemConfig.adminPrefix

// router
clientRouter(app)
adminRouter(app)

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Kyiv LuxeBouquets Ecommerce Website!"})
})

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"))
})

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app
