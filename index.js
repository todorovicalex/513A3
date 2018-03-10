var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;

var user= {
    color : '000000',
    userSocket : io.socket,
    nickname : ""
};

var users = [];

server.listen(3000);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket){
    socket.on('new user', function(data, callback){

        var nicknames = [];

        users.forEach(function(item){

            nicknames.push(item.nickname);

        });

        var check = data;

        var flag = false;

        nicknames.forEach(function(name){

            if(data === name){
                flag = true;
            }

        });

        if(flag){
            callback(false);
        }
        else{
            callback(true);
            socket.nickname = data;

            users.push({color : 'ffffff', userSocket : socket, nickname: socket.nickname});

            updateNick();
        }
        
    });

    function updateNick(){

        var currentUsers = [];

        users.forEach(function(item){

            currentUsers.push(item.nickname);

        });

        io.sockets.emit('usernames', currentUsers);
    };

    function isHex(data){

        return(typeof data === "string") && data.length === 6 &&
            ! isNaN(parseInt(data, 16));

    };

    socket.on('chat', function(data, callback){

        var current = [];

        var myColor = "";
        var myNick = "";
        var thisSocket;

        users.forEach(function(item){

            if(item.nickname === socket.nickname){

                myColor = item.color;
                myNick = item.nickname;
                thisSocket = item.userSocket;

            }

            current.push(item.nickname);

        });

        var msg = data;

        msg = msg.toString();

        var msg2 = msg.substr(1,5);

        if(msg2 === "nick "){

            var check = msg.substr(5, msg.length-1);

            if(check.length !== 0){

                var name = msg.substr(6, msg.length-1);

                var flag2 = false;

                current.forEach(function(thing){

                    if(thing === name){
                        flag2 = true;
                        
                    }

                });

                if(flag2){

                    callback(("Name already exists!").bold());

                }
                else{

                    users.forEach(function(item){

                        if(item.nickname === myNick){
            
                            item.nickname = name;

                            socket.nickname = name;
            
                        }
            
                    });

                    updateNick();

                }

            }
            else{

                callback(("Enter valid nickname!").bold());

            }

        }

        else{

            var msg3 = msg.substr(1,10);

            if(msg3 === "nickcolor "){

                var checkColor = msg.substr(11,msg.length - 1);

                if(isHex(checkColor)){

                    myColor = checkColor;

                    users.forEach(function(item){

                        if(item.nickname === socket.nickname){
            
                            item.color = myColor;
            
                        }
            
                    });

                }
                else{

                    callback(("Not a valid color!").bold());

                }

            }
            else{

                io.sockets.emit('chat', {msg: data, nick: myNick, color: myColor});

            }
        }
    });
    
    socket.on('disconnect', function(data){

        var currentUsers = [];

        var removeIndex = users.map(function(item) { return item.nickname; }).indexOf(socket.nickname);

        users.splice(removeIndex, 1);

        users.forEach(function(item){

            currentUsers.push(item.nickname);

        });
        
        io.sockets.emit('usernames', currentUsers);
    });

});

