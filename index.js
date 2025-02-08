import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
// import connectTodb from './public/dbconnect.js'
let app = express();
app.use(express.static('public'))
dotenv.config()
app.use(express.urlencoded());
import { Server } from 'socket.io';


let server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
  });

let users = {}


app.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname , 'index.html'))
})

io.on("connection" , (socket)=>{
    
    console.log("a user connected" , socket.id)
    
    socket.on("fetchName" , (name)=>{
        users[socket.id] = name
        socket.emit("setName" , `Welcome ${name}!`) 
        socket.broadcast.emit("setName" , `${name} joined`)
        socket.on("fetchMsg" , (msg)=>{
        io.emit("newMsg" , {name , msg})
    })
        socket.on("fetchTyping", () => {
        socket.broadcast.emit("setNameTyping", users[socket.id])
    });
    socket.on("userStop", () => {
        socket.broadcast.emit("SetEmpty")
    });
})
    
    socket.on('disconnect' , ()=>{     
        io.emit("userDisconnect" , users[socket.id])
    })
})





server.listen(3000 , ()=>{
    console.log('Server is running on port 3000')
    // connectTodb()
})