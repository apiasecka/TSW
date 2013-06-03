var Editor = function(socket) {
	this.socket = socket;
};

Editor.prototype.UserNick = function(nick){
	this.socket.emit('nick', nick);
};

Editor.prototype.ChangeDoc = function(key, line, offSet){
	this.socket.emit('key', {
		'key': key,
		'line': line,
		'position': offSet
	});
};

Editor.prototype.ChangeDocDel = function(key, line, offSet, empty){
	this.socket.emit('keyDel', {
		'key': key,
		'line': line,
		'position': offSet,
		'empty': empty
	});
};

Editor.prototype.ChangeLine = function(line){
	this.socket.emit('line', {
		'line': line
	});
	//console.log(line);
};


/*
Editor.prototype.ChangeDoc = function(key, start, startNode){
	this.socket.emit('key', {
		'key': key, 
		'start': start, 
		'startNode': startNode
	});
};
*/