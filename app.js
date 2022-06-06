const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const compression = require('compression')
const PORT = process.env.PORT || 3000
const users = {}

// Routes
app.get('/', (req, res) => {
  res.render('index')
})

app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname + '/public')))

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
    socket.emit('update-list', users)
  })

  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', {
      message: message,
      name: users[socket.id],
      date: new Date().toLocaleDateString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
    })
  })

  // UI Stack
  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', data)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
    socket.emit('update-list', users)
  })
})

// Cache Headers
app.use((req, res, next) => {
  res.set('Cache-control', 'public, max-age=300')
  next()
})

// Compress all response
app.use(compression())

// Listen to port
http.listen(PORT, () => console.log(`Listening on http://[::]:${PORT}`))
