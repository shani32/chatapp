const express= require('express')
const path= require('path')
const http= require('http')
const socketio=require('socket.io')
const formatMessage=require('./utiles/messages')

const app= express()
const server= http.createServer(app)
const io=socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

const bot='admin'
//new connection
io.on('connection',socket=>{
    console.log('new connection')

    socket.emit('message', formatMessage(bot, 'welcome my dear friend') )

    socket.broadcast.emit('message', formatMessage(bot, 'User has joined the party') )

    socket.on('disconnect', ()=>{
        io.emit('message', formatMessage(bot, 'User has left the building') )
    })
    socket.on('chat', msg=>{
        io.emit('message', formatMessage('USER', msg) )
    })
})

const PORT= 3000 || process.env.PORT;
server.listen(PORT, ()=>{
   console.log(`server is running on port ${PORT}`) 
})