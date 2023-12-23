// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html
// from the https://github.com/processing/p5.js/wiki/p5.js,-node.js,-socket.io
// As well as Dan Shiffman Coding Train 12.1-12.4 : https://www.youtube.com/watch?v=bjULmG8fqc8&ab_channel=TheCodingTrain

console.log("My socket server is up and running");

var express = require('express');
var app = express();

var server = app.listen(8080); 

app.use(express.static('public'));

console.log('Server started on port 8080');

// WebSocket Portion
// WebSockets work with the HTTP server

var socket = require('socket.io');

var io = socket(server);


//Variable to keep track of counts

var count = [0,0,0,0,0,0,0,0,0]

var clickedIndexes = [0,0,0,0,0,0,0,0,0]

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', newConnection);
  // We are given a websocket object in our function
function newConnection(socket) {
  
    console.log("We have a new client: " + socket.id);
  
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse', mouseMsg);
    socket.on('message', handleMsg);
    socket.on('idx', handleImgs);
    socket.on('mousePressed', handleMousePressed);

    //Arrow function is a compact version of a normal function. I am using it here so I can call my function without creating a whole other function (basically avoiding syntax rules of a function)
    socket.on('clickedImageIndex',(index)=>{   //index is the parameter that gets passed into the clickedImgIndex function 
        console.log("Index clicked: ",index);
        clickedIndexes[index] ++;
        if (clickedIndexes[index] % 2==0){   //if even draw green square
            console.log("DRAWING GREEN SQUARE");
            io.emit('drawGreen',index);
        }
    });

 

  // function handleRedSquare(data){
  //   console.log("redsquaredrawn" + data.drawRedSquare);

  //   io.sockets.emit('drawRedSquare', data);
  // }


  function handleMousePressed(data) {
    console.log("Received: 'mousePressed' " + data.x + data.y +data.idx);

    // Broadcast the data to all other clients, including the sender
    io.sockets.emit('mousePressed', data);
  }



  function handleImgs(data) {
     console.log("Received: 'idx' " + data.idx); //data.x + data.y

      // Broadcast the data to all other clients
       //io.sockets.emit('idx', data);
       socket.broadcast.emit('idx', data);
    }


  function mouseMsg(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'mouse' " + data.x + " " + data.y);
    
      // Send it to all other clients
      socket.broadcast.emit('mouse', data);
      //console.log(data);
      
      // This is a way to send to everyone including sender
      // global socket
       //io.sockets.emit('mouse', "this goes to everyone");

  }

  function handleMsg(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'message' " + data);
    
      // Send it to all other clients
      //socket.broadcast.emit('message', data);
      io.emit('message', data);
      //console.log(data);
      
      // This is a way to send to everyone including sender
      // global socket
      // io.sockets.emit('message', "this goes to everyone");

  }
    
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  } // new connection
