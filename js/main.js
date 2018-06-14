var gen_map     = [];

var block = {
    over : function (top,left) {

        for (i = 0; i < gen_map.length; i++) {
            if (gen_map[i][0] == left && gen_map[i][1] == top) {
                var id      = gen_map[i][2] + "_" + i;
                var type    = gen_map[i][2];
                return this.onIn(id, type);
            }
        }
        return false;
    },
    onIn : function (id, type) {
        if (type == "empty") {
            return false;
        }        
        if (type == "stone") {
            var result = this.source.stone(id);
            this.setInfo(result.info);
            return result.res;
        }       
        if (type == "water") {
            var result = this.source.water(id);
            this.setInfo(result.info);
            return result.res;
        }
        if (type == "gold") {
            var result = this.source.gold(id);
            this.setInfo(result.info);
            this.setScore(result.score);
            return result.res;
        }
        return true;
    },
    source : {
        stone : function(id) {
            return { "info" : "Troche za wysoko nie da się wspiąć na ten głaz", "res" : true };
        },
        water : function(id) {
            return { "info" : "Zimna woda, nie możesz wejść", "res" : true };
        },
        gold : function(id) {
            $("#" + id).remove();
            return { "info" : "Znalazłeś monetę! Brawo!", "res" : false, "score" : 1 };
        },
    },
    setInfo  : function(txt){
        $("#info").html("Info : " + txt);
    },
    setScore : function (num) {
        var currentScore = parseInt($("#score").html());
        $("#score").html(currentScore + num);
    }
}


 window.movePlayer = function(username, key, position) {
     console.log("ruszam:",username,key,position)
     if (!username) {
        return true;
    }
    if (position) {
        console.log("jest pozycja zmoenia po niej")
        window.moveBox(0,0,username,position);
    }
    else if (key == 37) { //lewa strzalka
        window.moveBox(0,-1,username,position);
    }
    else if (key == 39) { // prawa strzalka
        window.moveBox(0,1,username,position);
    }
    else if (key == 40) { // strzalka w dol
        window.moveBox(1,0,username,position);
    }
    else if (key == 38) { // strzalka w gore
        window.moveBox(-1,0,username,position);
    }

}


window.moveBox = function (top,left,username,position) {

    var element = document.getElementById("username_"+username);

    if (!element) {
        return true;
    }
    
    var x,y;
    var rect    = element.getBoundingClientRect();
    if (position) {
        x = position.x;
        y = position.y;
    } else {
        x = rect.left + (left * jump);
        y = rect.top + (top * jump);
    }
// console.log("przesuwam:",x,y,username);
    if (block.over(y,x)) {
        return;
    }
    if (x) {
        element.style.left = x + 'px';
    }
    if (y) {
        element.style.top  = y + 'px';
    }
    if (username == window.currentUser.nick) {
        window.currentUser.position.x = x;
        window.currentUser.position.y = y;
    }
}


window.createUser = function(users) {
    var i;
    console.log(users)

    for (i=0; i<users.length; i++) {
        var position_start  = [48,28]; // left, top
        var new_user        = 'username_'+ users[i].nick;


        if (!$("#"+new_user).length) {
            console.log("tworze uzytkownika :"+new_user);

            var box = '<div id="' + new_user + '" class="square" style="left:' + users[i].position.x + 'px; top:' + users[i].position.x + 'px;"></div>';
            $('body').append(box);
        }

    }
}


function generateMap(map) {

    var i;
    var map_parts   = map.split("N");
    var x1          = 8;
    var y1          = 8;

    for (i=0; i < map_parts.length; i++) {
        x1 = 8;
        var row = map_parts[i].split('');

        for (j=0; j < row.length; j++) {
            var field   = row[j];
                x1      += 20;
            var type    = "";
            if (field == "S") {
                type = "stone";
            }
            if (field == "W") {
                type = "water";
            }
            if (field == "E") {
                type = "empty";
            }
            if (field == "G") {
                type = "gold";
            }
            gen_map    = gen_map.concat([ [x1, y1, type] ]);
        }
        y1 += 20;
    }

    for (i = 0; i < gen_map.length; i++) {
        var id          = gen_map[i][2] + "_" + i;
        var box_block   = "<div class=\" block " + gen_map[i][2] + "\" id=\"" + id + "\"></div>";
        var b           = $(box_block).css({top : gen_map[i][1], left : gen_map[i][0]});
        $('#area').append( b.prop("outerHTML") );
    }
}



