/*jshint node: true, browser: true, jquery: true */
/*global io: false */
$(document).ready(function () {
    'use strict';
	
	var socket = io.connect('http://localhost:3000');
	var appEditor = new Editor(socket);
	var Unick;
	
	socket.on('nick', function (nickNames) {
		console.log(nickNames.nick);
        $('#nick').css({'display': 'none'});
		$('#content').css({'display': 'block'});
    });
	
	
	$('button').click(function(){
		Nick(socket, appEditor);
	});
	
	$('#nick').submit(function(){
		return false;
	});
	
	var Nick = function(socket, appEditor){
		Unick = $('#name').val();
		appEditor.UserNick(Unick);
	};
});