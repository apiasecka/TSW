/*jshint node: true, browser: true, jquery: true */
/*global io: false */
$(document).ready(function () {
    'use strict';
	
	var socket = io.connect('http://localhost:3000');
	var appEditor = new Editor(socket);
	var Unick;
	var line = 1;
	
	socket.on('line', function (line_all) {
		line = line_all.number;
	});
	
	socket.on('nick', function (nickNames) {
		console.log(nickNames.nick);
        $('#nick').css({'display': 'none'});
		$('#content').css({'display': 'block'});
    }); 
	
	socket.on('key', function (e) {
		//setCaretPos(e.startNode, e.start);
		console.log('line: ' + line);
		if(e.key == 13){
			$('#document').append('<div class="line' + line + '"></div>');
		} else {
			console.log('key line: ' + e.line + ', key text: ' + e.text);
			$('#document .' + e.line).append(e.text);
		}
		//console.log(e.key);
    }); 
	
	
	$('button').click(function(){
		Nick(appEditor);
	});
	
	$('#nick').submit(function(){
		return false;
	});
	
	var Nick = function(appEditor){
		Unick = $('#name').val();
		appEditor.UserNick(Unick);
	};
	
	$("#document").keydown(function(e){
		//console.log('keydown' + e.keyCode);
		if(e.keyCode == 46){ //delete
			//return false;
			//Renumber();
		} 
		
	});
	
	$("#document").click(function(){
		//
	});
	
	
	$("#document").keyup(function(e){
		//console.log('keyup' + e.keyCode);
		var position_line;
		var selection = window.getSelection().getRangeAt(0).startContainer;
		
		if(e.keyCode == 8){ //backspace
			//Renumber();
			if($("#document").find('div').length){}
			else {
				$('#document').append('<div class="line' + line + '"></div>');
				line++;
				appEditor.ChangeLine(line);
			}
		}
		
		if(e.keyCode == 13){ //enter
			//Renumber();
			//console.log(window.getSelection().getRangeAt(0).commonAncestorContainer.id);
			
			
			if(selection.nodeName == "DIV") {
				position_line = selection;
			} else {
				position_line = selection.parentNode;
			}
			
			//console.log(position_line);
			$(position_line).removeClass().addClass('line' + line);
			//console.log($(position_line).attr('class') + ' ' + line);
			line++;
			appEditor.ChangeLine(line);
		} else {
			position_line = selection.parentNode;
			console.log($(position_line).attr('class'));
		}
		
		//$(#document).find('div')
		//showCaretPos() 
		//saveSelection();
	});
	
	function showCaretPos() {
		var pos = getCaretClientPosition();
		//console.log("Caret position: " + pos.x + ", " + pos.y);
	}
	
	$("#document").keypress(function(key) {
	var akt_class;
	if(window.getSelection().getRangeAt(0).commonAncestorContainer.nodeValue == null){
		akt_class = $(window.getSelection().getRangeAt(0).startContainer).attr('class');
	} else {
		akt_class = $(window.getSelection().getRangeAt(0).startContainer.parentNode).attr('class');
	}
	console.log('keypress ' + akt_class);
		KeyUp(key.keyCode, akt_class);
	});
	
	var KeyUp = function(key, line){
		
		//console.log('line: ' + line);
		appEditor.ChangeDoc(key, line);
	};
	
	
	var Renumber = function(){
		$('#document > div').each(function(index, el){
			$(this).removeClass().addClass('line' + index);
		});
	};
	


});