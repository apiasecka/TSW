var socketio = require('socket.io'),
    nickNames = {};

exports.listen = function(server) {
    var io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
		
		
		handleNewUser(socket, nickNames);
		handleUserDisconnection(socket, nickNames);
		handleKeyUp(socket);
		
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

var handleUserDisconnection = function(socket, nickNames){
	socket.on('disconnect', function() {
		console.log("leave: " + nickNames[socket.id]);
		delete nickNames[socket.id];
    });
};

var handleKeyUp = function(socket){
	socket.on('key', function(e) {
		if(e.key == 13){
			socket.broadcast.emit('key', {
				key: '<div></div>',
				start: e.start,
				startNode: e.startNode
			});
		} else {
			socket.broadcast.emit('key', {
				key: '&#' + e.key + ';',
				start: e.start,
				startNode: e.startNode
			});
		}
		console.log("key: " + e.key + ", start:" + e.start + ", startNode:" + e.startNode);
	});
};