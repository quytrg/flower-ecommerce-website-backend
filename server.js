const app = require('./app')
const database = require('./app/config/database')

const startServer = async () => {
    try {
        database.connect()
        
        const port = process.env.PORT
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } 
    catch (err) {
        console.log('An error occurred while starting server!', err)
        process.exit()
    }
}

startServer()
