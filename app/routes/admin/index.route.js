const categoryRouter = require('./category.route')
const productRouter = require('./product.route')
const roleRouter = require('./role.route')
const accountRouter = require('./account.route')
const authRouter = require('./auth.route')

// middlewares
const authMiddleware = require('../../middlewares/admin/auth.middleware')

module.exports = (app) => {
    const ADMIN_PATH = `/${app.locals.apiPrefix}/${app.locals.adminPrefix}`
    app.use(ADMIN_PATH + '/categories', categoryRouter)
    app.use(ADMIN_PATH + '/products', productRouter)
    app.use(ADMIN_PATH + '/roles', roleRouter)
    app.use(
        ADMIN_PATH + '/accounts',
        authMiddleware.requireAuth,
        accountRouter
    )
    app.use(ADMIN_PATH + '/auth', authRouter)
}
