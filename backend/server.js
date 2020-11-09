const express = require('express')
const http = require('http')
// const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const WebSocket = require('ws')

//TODO find out why nodemon.json doesn't work
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') })


const routerProducts = require('./api/routes/products')
const routerOrders = require('./api/routes/orders')
const routerUser = require('./api/routes/user')

console.log('______________ENV_______________', process.env.NODE_ENV)

const app = express()

const port = process.env.PORT || 5000

mongoose.connect(`mongodb+srv://InSh:${process.env.MONGO_ATLAS_PW}@cluster0.hyd9c.mongodb.net/testikForNow?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(express.json({ extended: true }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', 'GET, DELETE, POST, PUT, PATCH')

    next()
})

const server = http.createServer(app)

const wserver = new WebSocket.Server({ server })

app.use((req, res, next) => {
    req.ws = wserver;
    return next();
});

wserver.on('connection', ws => {
    ws.on('message', message => {
        console.log("Total connected clients:", wserver.clients);
        ws.send(`We get the ${message}`)
    })

    app.locals.clients = wserver.clients;
    ws.send('___WELCOME_2___')
})

// routes
app.use('/api/products', routerProducts)
app.use('/api/orders', routerOrders)
app.use('/api/user', routerUser)

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, '../frontend', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
    })
}

app.use((req, res, next) => {
    const error = new Error('Page not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({msg: 'We are sorry, but the requested page was not found'})
})

server.listen(port)


