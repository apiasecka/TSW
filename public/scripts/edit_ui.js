/*jshint node: true, browser: true, jquery: true */
/*global io: false */
$(document).ready(function () {
    'use strict';
	
	var socket = io.connect('http://localhost:3000');
	var appEditor = new Editor(socket);
	var Unick;
	var line = 1;
	
	socket.on('nick', function (nickNames) {
		console.log(nickNames.nick);
        $('#nick').css({'display': 'none'});
		$('#content').css({'display': 'block'});
    }); 
	
	socket.on('key', function (e) {
		//setCaretPos(e.startNode, e.start);
		console.log(e.key);
		if(e.key == 13){
			$('#document').append('<div class="new"></div>');
		} else {
			$('#document').append(e.text);
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
		if(e.keyCode == 8){ //backspace
			//Renumber();
			if($("#document").find('div').length){}
			else {
				$('#document').append('<div class="line' + line + '"></div>');
				line++;
			}
		}
		
		if(e.keyCode == 13){ //enter
			//Renumber();
			//console.log(window.getSelection().getRangeAt(0).commonAncestorContainer.id);
			
			
			position_line = window.getSelection().getRangeAt(0).startContainer;
			//console.log(position_line);
			$(position_line).removeClass().addClass('line' + line);
			console.log($(position_line).attr('class'));
			line++;
		} else {
			position_line = window.getSelection().getRangeAt(0).startContainer.parentNode;
			console.log($(position_line).attr('class'));
		}
		
		//$(#document).find('div')
		//showCaretPos() 
		//saveSelection();
	});
	
	function getCaretClientPosition() {
    var x = 0, y = 0;
    var sel = window.getSelection();
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        if (range.getClientRects) {
            var rects = range.getClientRects();
            if (rects.length > 0) {
                x = rects[0].left;
                y = rects[0].top;
            }
        }
    }
    return { x: x, y: y };
}

	function showCaretPos() {
		var pos = getCaretClientPosition();
		//console.log("Caret position: " + pos.x + ", " + pos.y);
	}
	
	$("#document").keypress(function(key, appEditor) {
		
		KeyUp(key.keyCode);
	});
	
	var KeyUp = function(key){
		
		//console.log('start: ' + start);
		appEditor.ChangeDoc(key);
	};
	
	
	var Renumber = function(){
		$('#document > div').each(function(index, el){
			$(this).removeClass().addClass('line' + index);
		});
	};
	
	
	
	// ------------------------------------------
	
	

});