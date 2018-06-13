
$(function () {
    "use strict";
    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
      content.html($('<p>',
        { text:'Sorry, but your browser doesn\'t support WebSocket.'}
      ));
      input.hide();
      $('span').hide();
      return;
    }



    // open connection
    var connection    = new WebSocket('ws://127.0.0.1:1337');
    window.connection = connection;

    connection.onopen = function () {
      // first we want users to enter their names
      input.removeAttr('disabled');
      status.text('Choose name:');
    };

    connection.onerror = function (error) {
      // just in there were some problems with connection...
      content.html($('<p>', {
        text: 'Sorry, but there\'s some problem with your '
           + 'connection or the server is down.'
      }));
    };


    // most important part - incoming messages
    connection.onmessage = function (message) {
      // try to parse JSON message. Because we know that the server
      // always returns JSON this should work without any problem but
      // we should make sure that the massage is not chunked or
      // otherwise damaged.
      try {

        var json = JSON.parse(message.data);
        console.log(json);
        // movePlayer(username, 37);
        if (json.type === 'color') {
          console.log(json.users);
          var i;
          for (i=0; i<json.users.length; i++ ) {
            var user_name = json.users[i];
            // console.log("robie",user_name)
            window.createUser(user_name);
          }
        }
        if (json.type === 'message') {
          var user_name = json.data.author;
          if (user_name != window.username) {
            console.log("nie sa rowne")
            window.movePlayer(user_name, json.data.move);
          }
        }

      } catch (e) {
        console.log('Invalid JSON: ', message.data);
        return;
      }

      // NOTE: if you're not sure about the JSON structure
      // check the server source code above
      // first response from the server with user's color
      // if (json.type === 'color') { 
      //   myColor = json.data;
      //   status.text(myName + ': ').css('color', myColor);
      //   input.removeAttr('disabled').focus();
      //   // from now user can start sending messages
      // } else if (json.type === 'history') { // entire message history
      //   // insert every single message to the chat window
      //   for (var i=0; i < json.data.length; i++) {
      //   addMessage(json.data[i].author, json.data[i].text,
      //       json.data[i].color, new Date(json.data[i].time));
      //   }
      // } else if (json.type === 'message') { // it's a single message
      //   // let the user write another message
      //   input.removeAttr('disabled'); 
      //   addMessage(json.data.author, json.data.text,
      //              json.data.color, new Date(json.data.time));
      // } else {
      //   console.log('Hmm..., I\'ve never seen JSON like this:', json);
      // }
    };





    // $('body').keydown(function(e){
    //     console.log(e.keyCode);
    //     var move = "";

    //     if (e.keyCode === 37) { // lewo
    //         move = "left";
    //     }
    //     if (e.keyCode === 39) { // prawo
    //         move = "right";
    //     }
    //     if (e.keyCode === 40) { // dol
    //         move = "down";
    //     }
    //     if (e.keyCode === 38) { // gora
    //         move = "up";
    //     }
    //     console.log("wysylam"+move)

    //     if (move) {
    //         connection.send(JSON.stringify({"move" : move, "username" : "damian"}));
    //     }

    // });

    /**
     * Send message when user presses Enter key
     */
    input.keydown(function(e) {


      if (e.keyCode === 13) {
        // var msg = $(this).val();
        // if (!msg) {
        //   return;
        // }
        // send the message as an ordinary text
        // connection.send(JSON.stringify({"msg" : msg}));
        $(this).val('');
        // disable the input field to make the user wait until server
        // sends back response
        input.attr('disabled', 'disabled');
        // we know that the first message sent from a user their name
        if (myName === false) {
          myName = msg;
        }
      }
    });
    /**
     * This method is optional. If the server wasn't able to
     * respond to the in 3 seconds then show some error message 
     * to notify the user that something is wrong.
     */
    setInterval(function() {
      if (connection.readyState !== 1) {
        status.text('Error');
        input.attr('disabled', 'disabled').val(
            'Unable to communicate with the WebSocket server.');
      }
    }, 3000);
    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
      content.prepend('<p><span style="color:' + color + '">'
          + author + '</span> @ ' + (dt.getHours() < 10 ? '0'
          + dt.getHours() : dt.getHours()) + ':'
          + (dt.getMinutes() < 10
            ? '0' + dt.getMinutes() : dt.getMinutes())
          + ': ' + message + '</p>');
    }
  });
