// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var $nickForm = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#nickname');
    var $users = $('#users');
    var $current = $('#currentUser');
    
    //var $messageForm = $('#send-message');

    $nickForm.submit(function(e){
        e.preventDefault();
        socket.emit('new user', $nickBox.val(), function(data){
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }
            else{
                $nickError.html('That username is already taken!');

            }
        });
        $nickBox.val('');

    });

    function timeStamp(){
        var now = new Date();
    
        var time = [ now.getHours(), now.getMinutes() ];
    
        var suffix = ( time[0] < 12 ) ? "AM" : "PM";
    
        time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    
        time[0] = time[0] || 12;
    
        for ( var i = 1; i < 3; i++ ) {
            if ( time[i] < 10 ) {
              time[i] = "0" + time[i];
            }
          }
    
        return time.join(":") + " " + suffix;
    }

    socket.on('usernames', function(data){

        var html = '';

        for(i = 0; i < data.length; i++){

            html += data[i] + '<br/>';

        }

        $users.html(html);
        

    });

    $('#send-message').submit(function(e){
        e.preventDefault();
	    socket.emit('chat', $('#m').val(), function(data){
	        $('#messages').append(data + '<br/>');
        });
	    $('#m').val('');
    });



    socket.on('chat', function(data){
        data.msg = timeStamp() + " " + data.nick + ":" + " " + data.msg;

        data.msg = data.msg.fontcolor(data.color);

    //$('#messages').append($('<li>').text(data.msg));
        $('#messages').append(data.msg + "<br/>");
    });
});
