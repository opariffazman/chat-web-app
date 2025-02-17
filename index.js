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

const users = new Map()

io.on('connection', (socket) => {
  socket.on('joining msg', (username) => {
    users.set(socket.id, username)
    console.log(`new user connected: ${username}`)
    io.emit('join message', `${username} joined the chat`)
  })

  socket.on('disconnect', () => {
    const username = users.get(socket.id)
    if (username) {
      console.log(`user disconnected: ${username}`)
      io.emit('left message', `${username} left the chat`)
      users.delete(socket.id)
    }
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
