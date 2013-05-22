var Editor = function(socket) {
	this.socket = socket;
};

Editor.prototype.UserNick = function(nick){
	this.socket.emit('nick', nick);
};