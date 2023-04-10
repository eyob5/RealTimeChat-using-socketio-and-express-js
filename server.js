const express=require('express');
const socketio=require('socket.io');
const path=require('path');
const http=require('http');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userleave,getRoomUsers}=require('./utils/users');
const app=express();
const server=http.createServer(app);
const io=socketio(server);
const botname='chatbot';
io.on('connection',socket=>{
    socket.on('JoinRoom',({username,room})=>{
       const user = userJoin(socket.id,username,room);
       socket.join(user.room);
        console.log("New web socket connection");
        socket.emit('message',formatMessage(botname,'welcome'));
        socket.broadcast.to(user.room).emit('message',formatMessage(botname,`A ${user.username} has joined the chat`));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        // console.log(msg);
    })
    socket.on('chatMesssage',msg=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })
    socket.on("disconnect",()=>{
        const user=userleave(socket.id);
        if(user){
        io.to(user.room).emit('message',formatMessage(botname,`A ${user.username} has left the chat`))
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
        }
    }) 
})
})
app.use(express.static(path.join(__dirname,'public')));
const PORT=3000;
server.listen(PORT || process.env.PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})