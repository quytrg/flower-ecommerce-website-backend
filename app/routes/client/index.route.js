const categoryRouter = require('./category.route')
const productRouter = require('./product.route')

module.exports = (app) => {
    const CLIENT_PATH = `/${app.locals.apiPrefix}/${app.locals.clientPrefix}`
    app.use(CLIENT_PATH + '/categories', categoryRouter)
    app.use(CLIENT_PATH + '/products', productRouter)
}
