const express= require('express')
const path= require('path')
const http= require('http')
const socketio=require('socket.io')
const formatMessage=require('./utiles/messages')
const {getUser, userJoinToChat, getUsersRoom, userLeave}= require('./utiles/users')

const app= express()
const server= http.createServer(app)
const io=socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

const bot='admin'
//new connection
io.on('connection',socket=>{

    socket.on('joinRoom', ({username, room})=>{
        const user=userJoinToChat(socket.id, username, room)
        socket.join(user.room)
    
    socket.emit('message', formatMessage(bot, 'welcome my dear friend') )

    socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined the party`))
    })
   

  
    socket.on('chat', msg=>{
        const user= getUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg) )
    }) 
    
    socket.on('disconnect', ()=>{
        const user= userLeave(socket.id)
        if(user){
         io.to(user.room).emit('message', formatMessage(bot, `${user.username} has left the building`) )   
        }
        
    })
})

const PORT= 3000 || process.env.PORT;
server.listen(PORT, ()=>{
   console.log(`server is running on port ${PORT}`) 
})