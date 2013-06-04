/*jshint node: true, browser: true, jquery: true */
/*global io: false */
$(document).ready(function () {
    'use strict';
	
	var socket = io.connect('http://localhost:3000');
	var appEditor = new Editor(socket);
	var Unick;
	var line = 1;
	var block = false;
	
	/* ------------------------- BEGIN socket ------------------------- */
	
	socket.on('line', function (line_all) {
		line = line_all.number;
	});
	
		//console.log(e.socket);
	socket.on('active', function (e) {
		if($('.' + e.line).attr('use') == 'null'){
			$('#document div[use]').attr('use', 'null');
			$('.' + e.line).attr('use', e.socket);
		}
		//$('.' + e.line).attr('use', e.socket);
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
			$('#document .' + e.line).after('<div class="line' + line + '" use="null"></div>');
		} else if(e.key == 13 && text != null) {
			text = text.slice(0, e.positionStart);
			text2 = '<div class="line' + line + '" use="null">' + text2.slice(e.positionEnd, text2.length) + '</div>';
			$('#document .' + e.line).html(text).after(text2);
		
		} else {
			//console.log('key line: ' + e.line + ', key text: ' + e.text);
			//$('#document .' + e.line).append(e.text);
			text = text.slice(0, e.positionStart) + e.text + text.slice(e.positionEnd, text.length);
			$('#document .' + e.line).html(text);
		}
		//console.log(e.key);
    }); 
	
	socket.on('keyDel', function (e) {
		var text = $('#document .' + e.line).html(),
			attr_prev,
			attr_next;
			
		console.log('keyDel ' + e.empty + ', line: ' + e.line);
		if(e.keyCode == 8){
			if(e.empty){
				$('.' + e.line).remove();
			} else if(e.positionStart == 0) {
				attr_prev = $('#document .' + e.line).prev().attr('class');
				if(!attr_prev) return;
				$('.' + attr_prev).append(text);
				$('.' + e.line).remove();
			} else if(e.positionStart == e.positionEnd){
				text = text.slice(0, e.positionStart-1) + text.slice(e.positionEnd, text.length);
				$('#document .' + e.line).html(text);
			} else {
				text = text.slice(0, e.positionStart) + text.slice(e.positionEnd, text.length);
				$('#document .' + e.line).html(text);
			}
		} else {
			if(e.empty){
				attr_next = $('#document .' + e.line).next().attr('class');
				$('.' + attr_next).remove();
			} else if(e.positionStart == e.positionEnd && e.positionEnd == text.length){
				attr_next = $('#document .' + e.line).next().attr('class');
				text = $('#document .' + attr_next).html();
				$('.' + e.line).append(text);
				$('.' + attr_next).remove();
			} else if(e.positionStart == e.positionEnd){
				text = text.slice(0, e.positionStart) + text.slice(e.positionEnd+1, text.length);
				$('#document .' + e.line).html(text);
			} else {
				text = text.slice(0, e.positionStart) + text.slice(e.positionEnd, text.length);
				$('#document .' + e.line).html(text);
			}
		}
	}); 
	
	/* ------------------------- END socket ------------------------- */
	
	$('button').click(function(){
		Nick(appEditor);
	});
	
	$('#nick').submit(function(){
		return false;
	});
	
	/* --------------- KeyDOWN ----------------- */
	$("#document").keydown(function(e){
		var node = window.getSelection().getRangeAt(0),
			akt_class, 
			position_line,
			empty,
			userUse = $().attr('use'),
			startOffSet = node.startOffset,
			endOffSet = node.endOffset;
			
		if(node.startContainer.nodeName == "DIV") {
			position_line = node.startContainer;
		} else {
			position_line = node.startContainer.parentNode;
		}
		//console.log(position_line)
		
		if(e.keyCode){ //any key
			if($(position_line).attr('use') != ('null' && 'active')){
				console.log('Fragment edytowany przez innego uzytkownika');
				block = true;
				return false;
			} else {
				block = false;
			}
		} 
		
		
		//console.log('keydown' + e.keyCode);
		//if(e.keyCode == 46){ //delete
		//} 
		
		//userUse = $(position_line).attr('use');
		
		if(e.keyCode == 8 || e.keyCode == 46){ //backspace || delete
			
			if(node.commonAncestorContainer.nodeValue == null){
				akt_class = $(node.startContainer).attr('class');
				empty = true;
			} else {
				akt_class = $(node.startContainer.parentNode).attr('class');
				empty = false;
			}
			console.log('keydown: ' + akt_class);
			KeyUpDel(e.keyCode, akt_class, startOffSet, endOffSet, empty);
		} 
		
	});
	
	$("#document").click(function(){
		//
	});
	
	/* --------------- KeyUP ----------------- */
	$("#document").keyup(function(e){
		var node = window.getSelection().getRangeAt(0).startContainer,
			position_line,
			whats;
			
		
		if(e.keyCode == 8){ //backspace
			var akt_class;
			if(!($("#document").find('div').length)){
				$('#document').append('<div class="line' + line + '" use="null"></div>');
				line++;
				appEditor.ChangeLine(line);
			}
			
		}
		
		if(node.nodeName == "DIV") {
			position_line = node;
		} else {
			position_line = node.parentNode;
		}
		
		if(e.keyCode == 13){ //enter
			if(block){
				console.log('Fragment edytowany przez innego uzytkownika');
				return false;
			}
			
			$(position_line).removeClass().addClass('line' + line).attr('use',null);
			line++;
			appEditor.ChangeLine(line);
		} 

		if($(position_line).attr('use') == 'null'){
			$('#document div[use=active]').attr('use', 'null');
			$(position_line).attr('use','active');
			
			ActiveBlock($(position_line).attr('class'));
		} 
		
		//$(this).addClass('active');
		//console.log($(position_line).attr('class'));
		
	});
	
	/* --------------- KeyPRESS ----------------- */
	$("#document").keypress(function(key) {
		var node = window.getSelection().getRangeAt(0);
		var akt_class,
			startOffSet = node.startOffset,
			endOffSet = node.endOffset;
		
		if(node.commonAncestorContainer.nodeValue == null){
			akt_class = $(node.startContainer).attr('class');
		} else {
			akt_class = $(node.startContainer.parentNode).attr('class');
		}
		
		KeyUp(key.keyCode, akt_class, startOffSet, endOffSet);
		
	});
	
	/* ----------------------- FUNCTION ------------------------- */
	var Nick = function(appEditor){
		Unick = $('#name').val();
		appEditor.UserNick(Unick);
	};
	
	var KeyUp = function(key, line, startOffSet, endOffSet){
		
		//console.log('line: ' + line);
		appEditor.ChangeDoc(key, line, startOffSet, endOffSet);
	};
	
	var KeyUpDel = function(key, line, offSet, empty){
		
		//console.log('line: ' + line);
		appEditor.ChangeDocDel(key, line, offSet, empty);
	};
	
	var ActiveBlock = function(line){
	
		//console.log('line: ' + line);
		appEditor.ActivePosition(line);
	}
});