// var http    = require('http');
// // var dt      = require('./modul1.js');
// var fs      = require('fs'); // File system - odczyt zapis do plikow
// var url     = require('url');
// var uc      = require('upper-case');
// var formidable = require('formidable'); // Odczyt z formularza
// var mysql   = require('mysql');


"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';
// Port where we'll run the websocket server
var webSocketsServerPort = 1337;
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
/**
 * Global variables
 */
// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];
var users_nick = [ ];
/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
  return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
});
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event
  var index = clients.push(connection) - 1;
  var userName = false;
  var userColor = false;
  console.log((new Date()) + ' Connection accepted.');
  // send back chat history
  if (history.length > 0) {
    connection.sendUTF(
        JSON.stringify({ type: 'history', data: history, users : users_nick } ));
  }



  // user sent some message
  connection.on('message', function(message) {
    var data = JSON.parse(message.utf8Data);


    if (message.type === 'utf8') { // accept only text
    // first message sent by user is their name
     if (userName === false) {
        // remember user name
        // userName = htmlEntities(message.utf8Data);
        userName = data.username;
        users_nick.push(userName);
        // get random color and send it back to the user
        userColor = colors.shift();
        connection.sendUTF( JSON.stringify({ type:'color', data: userColor, users: users_nick }));

        console.log((new Date()) + ' User is known as: ' + userName + ' with ' + userColor + ' color.');
      } else { // log and broadcast the message

        console.log((new Date()) + ' Received Message from ' + userName + ': ' + message.utf8Data.msg);
        
        // we want to keep history of all sent messages
        var obj = {
          time: (new Date()).getTime(),
          // text: htmlEntities(message.utf8Data),
          text: "jakis tekst niewazne",
          move : data.move,
          author: userName,
          color: userColor
        };
        history.push(obj);
        history = history.slice(-100);
        // broadcast message to all connected clients
        var json = JSON.stringify({ type:'message', data: obj, users: users_nick });
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
      }
    }
  });




  // user disconnected
  connection.on('close', function(connection) {
    if (userName !== false && userColor !== false) {
      console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
      // remove user from the list of connected clients
      clients.splice(index, 1);
      // push back user's color to be reused by another user
      colors.push(userColor);
    }
  });
});



























// Pierwsze akcje ------------------------------------------------
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database : "game"
//   });

//   con.connect(function(err) {
//     if (err) throw err;
//     con.query("SELECT * FROM user", function (err, result, fields) {
//       if (err) throw err;
//       console.log(result);
//     });
//   });


// http.createServer(function (req, res) {


// if (req.url == '/winter.html') {

//     var form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//         console.log(fields)
//         res.write('field value:'+fields.name);
//         res.end();
//       });
//     }

//  else {
//     var q = url.parse(req.url, true);
//     var filename = "." + q.pathname;
//     fs.readFile(filename, function(err, data) {
        
//       if (err) {
//         res.writeHead(404, {'Content-Type': 'text/html'});
//         return res.end("404 Not Found");
//       }  
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data+uc("Hellow"));
//       return res.end();
//     });

//  }


    // fs.readFile('index.html', function(err, data) {
    //     res.writeHead(200, {'Content-Type': 'text/html'});
    //     res.write(data);
    //     res.end();
    //   });


    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.end('Hello World!'+dt.myDateTime());
    // console.log(req)

// }).listen(8001);