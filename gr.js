const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const port = process.env.PORT || 4000;
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
var app = express();

app.use(express.static(__dirname+'/public'));

var server = http.createServer(app);
var io = socketIO(server);
//socket.io object accepts a server parameter
//
var users = new Users();
//
io.on('connection',function(socket)
{
console.log('New Connection Made');

socket.on('join',function(details)
{
if(isRealString(details.name) && isRealString(details.room))
{
socket.join(details.room);
users.removeUser(socket.id);
users.addUser(socket.id,details.name,details.room);

io.to(details.room).emit('updateUsersList',users.getUserList(details.room));
socket.emit('newMessage',{from:'Admin',text:'Welcome to the chat app'});

//socket.broadcast.to('the office fans').emit
socket.broadcast.to(details.room).emit('newMessage',{from:'Admin',text:`${details.name} has joined`});
}
else {
  socket.emit('didnotjoin',{message :'Invalid credentials'});
}
});
//

  socket.on('disconnect',function(){
  //console.log('User was disconnected');
  var user = users.removeUser(socket.id);

  if(user)
  {
    io.to(user.room).emit('updateUsersList',users.getUserList(user.room));
    io.to(user.room).emit('newMessage',{from :'Admin', text : `${user.name} has left`});
  }
  });

   socket.on('createMessage',function(message){
    console.log('createMessage',message);

    var user = users.getUser(socket.id);

     if(user && isRealString(message.text))
     {
       io.to(user.room).emit('newMessage',{from : user.name,text : message.text});
     }



  });

});

server.listen(port);
