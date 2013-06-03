var socketio = require('socket.io'),
    nickNames = {};

exports.listen = function(server) {
    var io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
		
		
		handleNewUser(socket, nickNames);
		handleUserDisconnection(socket, nickNames);
		handleKeyUp(socket); //dopisywane znaki
		handleKeyUpDel(socket); //usuwanie znakow
		handleLine(socket);	//ilosc wersow
		
    });
};

var handleNewUser = function(socket, nickNames){
	socket.on('nick', function(nick) {
		nickNames[socket.id] = nick; 
	
        socket.emit('nick', {
			nick: nick
		});
		
		console.log("nameUser: " + nickNames[socket.id]);
		
    });
};

var handleLine = function(socket){
	socket.on('line', function(e) {
		socket.broadcast.emit('line', {
			number: e.line
		});
		console.log("line: " + e.line);
    });
};

var handleUserDisconnection = function(socket, nickNames){
	socket.on('disconnect', function() {
		console.log("leave: " + nickNames[socket.id]);
		delete nickNames[socket.id];
    });
};

var handleKeyUp = function(socket){
	var data;
	socket.on('key', function(e) {
		data = e;
		
		if(e.key != 13){
			data.text = '&#' + e.key + ';';
		}
		
		socket.broadcast.emit('key', data);
		console.log('key: ' + e.key + ', position: ' + e.position);
	});
};

var handleKeyUpDel = function(socket){
	var data;
	socket.on('keyDel', function(e) {
		socket.broadcast.emit('keyDel', e);
	});
};