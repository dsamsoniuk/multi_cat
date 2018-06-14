

var box             = "square";
var jump            = 20;
var size_block      = 20; // in px
var map             = "";

window.currentUser     = {
    nick : "",
    position : {
        x : 28,
        y : 28
    },
    color : "red"
};

map    += "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSN";
map    += "SEEEWWEGGGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEGEESN";
map    += "SEEEWWWWWWWEEEEEEEEEEEEEEEEEEEEEWWWWWWWWWWSN";
map    += "SEEEEEEEEEWWWWWWWWWWWEEEEWWWWGGGGGGGGGEGEESN";
map    += "SEEEEEEEEEEEEEEEEEESSEEEEEEEEWWWWWWWEEEGEESN";
map    += "SEEEEEEEEEEEEEEEEEESSEEEEEEEEGGGGGGGGGEGEESN";
map    += "SEEEEEEEEEEEEEEEEEEEEEEEEEEEEGGGGGGGGGEGEESN";
map    += "SEEEEEEEEEEEEEEEEEEEEEEEEEEEEGGGGGGGGGEGEESN";
map    += "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS";

generateMap(map);

$("#start").click(function(){

    var un = $("input#username").val();

    if (un && !window.currentUser.nick) {

        window.currentUser.nick = un;
        window.createUser([window.currentUser]);
        window.connection.send(JSON.stringify({"user_data" : window.currentUser}));
    }
});

$( "body" ).on( "keydown", function( event ) {
    var key = event.keyCode;

    if (key == 37 || key == 38 ||key == 39 ||key == 40 ) {
        var username = window.currentUser.nick;
        window.movePlayer(username, key);
        window.connection.send(JSON.stringify({"user_data" : window.currentUser}));
    }
});

