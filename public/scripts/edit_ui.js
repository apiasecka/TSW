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
		var selection = window.getSelection().getRangeAt(0).startContainer;
		
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
			
			
			if(selection.nodeName == "DIV") {
				position_line = selection;
			} else {
				position_line = selection.parentNode;
			}
			
			//console.log(position_line);
			$(position_line).removeClass().addClass('line' + line);
			console.log($(position_line).attr('class') + ' ' + line);
			line++;
		} else {
			position_line = selection.parentNode;
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
	
		
	
var savedRange,isInFocus;
function saveSelection(){
        //savedRange = ;
		//window.getSelection().getRangeAt(0).startContainer.parentNode.id;
	
}

function restoreSelection()
{
    isInFocus = true;
    document.getElementById("area").focus();
    if (savedRange != null) {
        if (window.getSelection)//non IE and there is already a selection
        {
            var s = window.getSelection();
            if (s.rangeCount > 0) 
                s.removeAllRanges();
            s.addRange(savedRange);
        }
        else 
            if (document.createRange)//non IE and no selection
            {
                window.getSelection().addRange(savedRange);
            }
            else 
                if (document.selection)//IE
                {
                    savedRange.select();
                }
    }
}
//this part onwards is only needed if you want to restore selection onclick
var isInFocus = false;
function onDivBlur()
{
    isInFocus = false;
}

function cancelEvent(e)
{
    if (isInFocus == false && savedRange != null) {
        if (e && e.preventDefault) {
            //alert("FF");
            e.stopPropagation(); // DOM style (return false doesn't always work in FF)
            e.preventDefault();
        }
        else {
            window.event.cancelBubble = true;//IE stopPropagation
        }
        restoreSelection();
        return false; // false = IE style
    }
}

});