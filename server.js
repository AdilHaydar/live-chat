const http = require('http')
const server = http.createServer()

const socketio = require('socket.io')

const io = socketio(server, {
    cors : {
        origin: 'http://localhost:8000',
        methods: ['GET', 'POST']
    }
})

//const room = 'testRoom'
// console.log(io)
// console.log(io.handshake)

io.on('connection', socket=> {
    // console.log('Connected')
    // console.log(socket.id)
    // console.log(socket.handshake.auth.token)
    // console.log(socket.handshake.auth.username)
    let room = socket.handshake.query.room
    
    socket.join(room)
    //console.log(room)
    //io.to(room).emit('welcome', 'a new user entered the chat.')
    socket.broadcast.emit('welcome2', 'a new user entered the chat !!!')

    socket.on('message', msg => {
        
        if(room != msg['dataId']){
            //console.log('IF')
            room = msg['room']
            socket.join(msg['room'])
            //console.log(room)
        }
        io.to(room).emit('messageToClients', {'message':msg['message'],'username':socket.handshake.auth.username, 'dataId':room})
        //console.log(msg)
        //socket.broadcast.emit('messageToClients', {'message':msg,'username':socket.handshake.auth.username, 'dataId':room}) //! x kullanıcısından mesaj attığımda bu bildirim(mesaj) sadece y kullanıcısına gider bu yöntem ile, io.to kullanırsak hem mesajı gönderene hemde alıcıya gider bildirim veya mesaj. ikisini aynı anda kullandığımda çalışmadılar ama !!!
    })

    socket.on('disconnect', () => {
        //io.to(room).emit('byebye', 'a user has left the chat')
        console.log('DISCONNECT')
    })

})

server.listen(3000, () => console.log('listenin on port 3000'))