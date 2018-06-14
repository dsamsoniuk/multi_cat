

var box             = "square";
var jump            = 20;
var size_block      = 20; // in px
window.username = "";
var map    = "";


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
    if (un && !window.username) {
        window.createUser([un]);
        window.username = un;
        window.connection.send(JSON.stringify({"move" : {},  "username" : un}));
    }
});

$( "body" ).on( "keydown", function( event ) {
    var username = window.username;
    var key = event.keyCode;
    window.movePlayer(username, event.keyCode);
    if (key == 37 || key == 38 ||key == 39 ||key == 40 ) {
        window.connection.send(JSON.stringify({"move" : key,  "username" : username}));
    }

});

