// Import dependencies
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Msg = require('./models/messageModel')
const path = require('path')
const dotenv = require('dotenv')
const formatMessage = require('./middlewares/format')
dotenv.config()
const adminRoutes = require('./routes/adminRoutes')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const employeeRoutes = require('./routes/employeeRoutes')


// Database connection using mongoose
const uri = 'mongodb://localhost/passionproject'
mongoose.connect(uri, { useNewUrlParser: true })
.then(() => {
    console.log('Passion project to the moon')
})
.catch((e) => {
    console.log(e)
})


// Using middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))


// Chat messages
io.on('connection', (socket) => {
    Msg.find()
    .then((result) => {
        socket.emit('chatoutput', result)
    })

    socket.on('newuser', (username) => {
        socket.broadcast.emit('update', username + " is online")
    })

    socket.on('exituser', (username) => {
        socket.broadcast.emit('update', username + " is now offline")
    })

    socket.on('chat', (message) => {
        const chats = new Msg({
            user: message.username,
            msg: message.text
        })
        chats.save()
        .then(() => {
            socket.broadcast.emit('chat', formatMessage(message.username, message.text))
        })
    })
})


// Routes
app.get('/flex', (req, res) => {
    res.send('Como Estas')
})
app.use('/admin', adminRoutes)
app.use('/employee', employeeRoutes)

app.get('*', (req, res) => {
    res.status(404).json({ message: "The page you are currently looking for is unavailable"})
})

const port = 7777 || process.env.PORT
server.listen(port, () => {
    console.log(`My passion project is listening on port ${port}`)
})
