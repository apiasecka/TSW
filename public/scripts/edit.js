var Editor = function(socket) {
	this.socket = socket;
};

Editor.prototype.UserNick = function(nick){
	this.socket.emit('nick', nick);
};

Editor.prototype.ChangeDoc = function(key, start, startNode){
	this.socket.emit('key', {
		'key': key, 
		'start': start, 
		'startNode': startNode
	});
};