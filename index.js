const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)

const io = require('socket.io')(server)
const path = require('path')

app.use(express.static(path.join(__dirname, './public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

let name

io.on('connection', (socket) => {
  socket.on('joining msg', (username) => {
    name = username
    console.log(`new user connected: ${name}`)
    io.emit('join message', `${name} joined the chat`)
  })

  socket.on('disconnect', (username) => {
    name = username
    console.log(`user disconnected: ${name}`)
    io.emit('left message', `${name} left the chat`)
  })

  socket.on('join message', (msg) => {
    socket.broadcast.emit('join message', msg)
  })

  socket.on('left message', (msg) => {
    socket.broadcast.emit('left message', msg)
  })

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg) //sending message to all except the sender
  })
})

server.listen(3005, () => {
  console.log('Server listening on :3005')
})
