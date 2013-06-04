var Editor = function(socket) {
	this.socket = socket;
};

Editor.prototype.UserNick = function(nick){
	this.socket.emit('nick', nick);
};

Editor.prototype.ChangeDoc = function(key, line, startOffSet, endOffSet){
	this.socket.emit('key', {
		'key': key,
		'line': line,
		'positionStart': startOffSet,
		'positionEnd': endOffSet
	});
};

Editor.prototype.ChangeDocDel = function(key, line, startOffSet, endOffSet, empty){
	this.socket.emit('keyDel', {
		'key': key,
		'line': line,
		'positionStart': startOffSet,
		'positionEnd': endOffSet,
		'empty': empty
	});
};

Editor.prototype.ChangeLine = function(line){
	this.socket.emit('line', {
		'line': line
	});
	//console.log(line);
};

Editor.prototype.ActivePosition = function(line){
	this.socket.emit('active', {
		'line': line
	});
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