const express = require('express')
const app = express()
const socketIO = require('socket.io')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')

const port = process.env.PORT || 2020

app.use(bodyParser.json())//untuk kirim json post & put
app.use(cors())
const server = http.createServer(app)//untuk kebutuhan load balancing
const io = socketIO(server)

var arrMsg = []
var userCount = 0

app.io = io
app.arrMsg = arrMsg

app.get('/', (req,res) =>{
    res.status(200).send('<h1>Selamat datang di API Socket</h1>')
})

const { chatRouter } = require('./routers')
app.use('/chat', chatRouter)

io.on('connection',socket => {
    console.log('user connected')
    userCount+=1
    io.emit('user connected', userCount)

    socket.on('disconnect', () =>{
        console.log('user disconnect')
        userCount--;
        io.emit('user connected', userCount)
    })
})

server.listen(port, ()=> console.log(`Listening on port ${port}`))