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
  console.log('new user connected')

  socket.on('joining msg', (username) => {
    name = username
    io.emit('chat message', `[${name}] joined the chat`)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    io.emit('chat message', `[${name}] left the chat`)
  })
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg) //sending message to all except the sender
  })
})

server.listen(3005, () => {
  console.log('Server listening on :3005')
})