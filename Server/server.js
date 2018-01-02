const path = require('path');
const express = require('express');
//const http = require('http');
//const socketIO = require('socket.io');
//There is no need to install the path module. it comes preinstalled.
const Pathpublic = path.join(__dirname,'../public');
// console.log(__dirname + '/../public');
//
// console.log(Pathpublic);

var app = express();

app.use(express.static(Pathpublic));
app.listen(3000);
