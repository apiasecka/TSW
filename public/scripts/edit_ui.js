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
		var text = $('#document .' + e.line).html(),
			text2 = $('#document .' + e.line).html();
		
		if(e.key == 13 && text == null){
			//$('#document').append('<div class="line' + line + '"></div>');
			$('#document .' + e.line).after('<div class="line' + line + '"></div>');
		} else if(e.key == 13 && text != null) {
			text = text.slice(0, e.position);
			text2 = '<div class="line' + line + '">' + text2.slice(e.position, text2.length) + '</div>';
			$('#document .' + e.line).html(text).after(text2);
		
		} else {
			console.log('key line: ' + e.line + ', key text: ' + e.text);
			//$('#document .' + e.line).append(e.text);
			text = text.slice(0, e.position) + e.text + text.slice(e.position, text.length);
			$('#document .' + e.line).html(text);
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
		} 
		
	});
	
	$("#document").click(function(){
		//
	});
	
	
	$("#document").keyup(function(e){
		var position_line;
		var selection = window.getSelection().getRangeAt(0).startContainer;
		
		if(e.keyCode == 8){ //backspace
			if($("#document").find('div').length){}
			else {
				$('#document').append('<div class="line' + line + '"></div>');
				line++;
				appEditor.ChangeLine(line);
			}
		}
		
		if(e.keyCode == 13){ //enter
			
			
			if(selection.nodeName == "DIV") {
				position_line = selection;
			} else {
				position_line = selection.parentNode;
			}
			
			$(position_line).removeClass().addClass('line' + line);
			line++;
			appEditor.ChangeLine(line);
		} else {
			position_line = selection.parentNode;
			console.log($(position_line).attr('class'));
		}
		
	});
	
	
	$("#document").keypress(function(key) {
	var akt_class, offSet;
	
	offSet = window.getSelection().getRangeAt(0).startOffset;
	
	if(window.getSelection().getRangeAt(0).commonAncestorContainer.nodeValue == null){
		akt_class = $(window.getSelection().getRangeAt(0).startContainer).attr('class');
	} else {
		akt_class = $(window.getSelection().getRangeAt(0).startContainer.parentNode).attr('class');
	}
	console.log('keypress ' + akt_class);
		KeyUp(key.keyCode, akt_class, offSet);
	});
	
	var KeyUp = function(key, line, offSet){
		
		//console.log('line: ' + line);
		appEditor.ChangeDoc(key, line, offSet);
	};
	


});