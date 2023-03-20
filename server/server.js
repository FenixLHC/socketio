const {instrument} = require('@socket.io/admin-ui')
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', 'https://admin.socket.io']
    }
})
const userIo = io.of('/user')
userIo.on('connection', socket => {
    console.log('connection to user namespace' + socket.username)
})

userIo.use((socket,next) => {
    if (socket.handshake.auth.token) {
        socket.username = getUserFromToken(socket.handshake.auth.token)
        next()
    } else {
        next (new Error('Please send token'))
    }
})
function getUserFromToken(token){
    return token
}
io.on('connection', (socket)=>{
    console.log(socket.id)
    
    socket.on('send-message', (message, room) => {
        if (room ===''){
            socket.broadcast.emit("receive-message", message)

        } else {
            socket.to(room).emit("receive-message", message)
        }
    })
    socket.on('join-room', (room, cb) => {
        socket.join(room)
        cb(`Joined ${room}`)
    })
    socket.on('ping', n => console.log(n))
})

instrument(io, {auth: false})
