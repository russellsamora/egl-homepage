window.requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element) {
			// window.setTimeout(callback, _tickSpeed); // <-- OLD VERSION
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - _lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			_lastTime = currTime + timeToCall;
			return id;
		};
}());

var width,
	height,
	inTransit = false,
	gameboard,
	gameboardWidth,
	gameboardHeight,
	scrollElement,
	maxScroll,
	navBarHeight = 80,
	gameData = [],
	ready = false,
	prevMoveX,
	prevMoveY,
	hitList,
	messageBox,
	messageBoxP,
	messageTimeout,
	preventMovement = false,
	preventMovementTimer,
	infoBox,
	infoBoxContent,
	playing = false,
	heightBuffer = 20,
	keyUp = true,
	$body;

var devMode = false;

$(function() {
	init();
});

function init() {
	setupSelectors();
	setupEnvironment(0);
	resize();
	getFeed();
}

function setupSelectors() {
	$body = $('body');
	gameboard = $('#gameboard');
	gameboardWidth = parseInt(gameboard.css('width'),10);
	gameboardHeight = parseInt(gameboard.css('height'),10);
	scrollElement = $('html, body');
	scrollElement.each(function(i) {
        $(this).scrollTop(0).scrollLeft(0);
    });
    infoBox = $('#infoBox');
    infoBoxContent = $('#infoBox .content');
    messageBox = $('#message');
    messageBoxP = $('#message p');
}

/*** setup ****/
//bind input events to trigger functionality
function setupEvents() {
	$body.on('click', '#gameboard', function(e) {
		//only if we didn't click on the player
		if(!preventMovement) {
			//hide boxes
			clearTimeout(messageTimeout);
			messageBox.fadeOut();
			e.preventDefault();
			if(!inTransit) {
				//constrain to the left and top screen
				var y = Math.max(0,(e.pageY - navBarHeight - player.offset.y)),
					x = Math.max(0,e.pageX - player.offset.x);

				//constrain bottom and right of screen
				x = Math.min(x, gameboardWidth - player.w);
				y = Math.min(y, gameboardHeight - player.h);

				var input = {
					x: x,
					y: y,
					edgeX: e.clientX,
					edgeY: e.clientY
				};

				movePlayer(input);
			}
		}
	});
	$(window).on('resize', resize);

	//show a message box with the items info
	$body.on('click','#gameboard .backgroundItem', function(e) {
		if(!inTransit) {
			//grab the message
			var index = parseInt($(this).attr('data-index'),10),
				messages = background[index].messages;
			showMessage(this, messages);	
		}
	});
	//click to move or show message
	$body.on('click','#player', function(e) {
		if(!inTransit) {
			messages = player.messages;
			showMessage(this, messages);
		}
	});
	//jump or dev mode
	$body.on('keypress', function(e) { 
		if(!inTransit && e.which === 32) {
			jumpPlayer();
		} else if(e.which === 114) {
			dev();
		}
	});
	//wasd move player
	// $body.on('keydown', function(e) {
	// 	if(!inTransit && keyUp) {
	// 		var key = e.which;
	// 		if(key === 87 || key === 65 || key === 83 || key === 68) {
	// 			movePlayerKey(key);
	// 		}	
	// 	}
	// });
	// //end move
	// $body.on('keyup', function(e) {
	// 	keyUp = true;
	// });
	showMessage(player.otherSelector,['click anywhere to move.']);
}

function showMessage(el, messages, noFade) {
	clearTimeout(preventMovementTimer);
	preventMovement = true;
	preventMovementTimer = setTimeout(function() {
		preventMovement = false;
	}, 17);

	var num = messages.length,
		msg;
	if(num === 1) {
		msg = messages[0];
		messageBoxP.text(msg);	
	} else {
		//pick random?
		var ran = Math.floor(Math.random() * num);
		msg = messages[ran];
		messageBoxP.text(msg);
	}
	
	//figure out how to align it center
	var	top = parseInt(el.style.top,10) + 20,
		left = parseInt(el.style.left,10),
		mid = left + parseInt(el.style.width,10) / 2;

	var msgWidth = parseInt(messageBox.css('width'), 10),
		msgLeft = Math.floor(mid - msgWidth / 2);
	
	//clear old messages and change position and show and add fade out timer
	clearTimeout(messageTimeout);
	messageBox.hide().css({
		top: top,
		left: msgLeft
	});

	var duration = msg.length * 80;
		fade = 200;
	if(noFade) {
		fade = 0;
	}

	messageBox.fadeIn(fade, function() {
		messageTimeout = setTimeout(function() {
			messageBox.fadeOut();
		}, duration);
	});
}

//load in data for environmental image assets and attach to DOM
function setupEnvironment(index) {
	var info = items[index];
	//create item, add to dom
	var item = document.createElement('div');
	var img = new Image();
	img.onload = function() {
		//set the background image and append
		var id = info.class + index;
		item.setAttribute('id', id);
		item.setAttribute('class', info.class + ' item');
		item.setAttribute('data-index', index);
		$(item).css({
			position: 'absolute',
			top: info.y,
			left: info.x,
			width: img.width,
			height: img.height,
			backgroundImage: 'url(' + img.src + ')'
		});
		gameboard.append(item);
		info.selector = $('#' + id);
		info.w = img.width;
		info.h = img.height;
		info.bottom = info.y + info.h;
		index++;
		if(index < items.length) {
			setupEnvironment(index);
		} else {
			console.log('environment loaded');
			loadData('backup');
		}
	}
	img.src = '../img/' + info.class + '.png';
}

//load in the custom data from either google spreadsheet or backup to csv
function loadData(backupData) {
	var rawData;
	if(backupData) {
		rawData = new Miso.Dataset({
			url: '../data/backup.csv',
			delimiter: ','
		});
	} else {
		rawData = new Miso.Dataset({
			importer : Miso.Dataset.Importers.GoogleSpreadsheet,
			parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
			key : '0AtnV9m5qu78_dEY2dWNIRXNhTk1USk9rRG9McTFuMkE',
			worksheet: '1'
		});
	}
	rawData.fetch({ 
		success: function() {
			this.each(function(row){
				gameData.push(row);
			});
			ready = true;
			selectCharacter();
		},
		error: function() {
			console.log('having a bad day? Try backup data!');
			loadData('backup');
		}
	});
}

//resize and update some vars
function resize() {
	width = $(window).width();
	height = $(window).height();
	maxScroll = { 
		left: Math.max(0,gameboardWidth - width),
		top: Math.max(0,gameboardHeight - height + navBarHeight)
	};
}

//slide the screen if the player is transition outside the current frame
function slideScreen(input, key) {
	//check for page edge clicking to animate scroll!
	var destX, destY;
	//make sure transition isn't too fast.
	var speed = Math.max(500,input.speed);

	//left edge
	if(input.edgeX < player.w && pageXOffset > 0) {
		destX = Math.max(pageXOffset - width / 2, 0);
	//right edge
	} else if( input.edgeX > width - player.w) {
		destX = Math.min(pageXOffset + width / 2, maxScroll.left);
	}
	//top edge
	if(input.edgeY < player.h + navBarHeight && pageYOffset > navBarHeight) {
		destY = Math.max(pageYOffset - height / 2, 0);
	//bottom edge
	} else if( input.edgeY > height - player.h) {
		destY = Math.min(pageYOffset + height / 2, maxScroll.top);
	}
	//console.log('y:', input.y,'edge:', input.edgeY,'page:', pageYOffset,'max:', maxScroll.top);

	//choose which to animate (must lump together so it doesn't halt other)
	if(destX !== undefined && destY !== undefined) {
		scrollElement.stop().animate({
			scrollLeft: destX,
			scrollTop: destY
		}, speed,'linear');	
	} else if(destY !== undefined) {
		scrollElement.stop().animate({
			scrollTop: destY
		}, speed,'linear');	
	} else if(destX !== undefined) {
		scrollElement.stop().animate({
			scrollLeft: destX
		}, speed,'linear');	
	}
}

//hit test / flip z-index test on walk cycle
function hitTest() {
	//only test if moving...
	if(inTransit) {
		//must pull the current position (yuck)
		var tempX = parseFloat(player.otherSelector.style.left),
			tempY = parseFloat(player.otherSelector.style.top),
			bottomY = tempY + player.h;
		
		for(var h = 0; h < hitList.length; h++) {
			var other = hitList[h];
			//hit test for bottom of both rectangles
			if((bottomY >= other.bottom) && (bottomY <= other.bottom + heightBuffer)) {
				var readyToFlip;
				//if we just crossed hit the vertical intersection, switch the z-index, but only once
				if(!other.flipped) {
					readyToFlip = true;
				}
				//check for actual collision
				if ((tempX + player.w >= other.x) && (tempX <= other.x + other.w)) {
					stopMove();
					break;
				}
				if(readyToFlip) {
					other.flipped = true;
					other.selector.toggleClass('fgItem');
					hitList.splice(h,1);				
				}
			}
		}
		//store the last step so we can place player there for no conflicts on next move
		prevMoveX = tempX;
		prevMoveY = tempY;

		//this might be too frequent? ( can just do ever 150 and be safe?)
		requestAnimationFrame(hitTest);
		//setTimeout(hitTest,speedAmplifier * (heightBuffer - 10));
	}
}

function setZIndex(input) {
	var minX = Math.min(input.x,player.x),
		minY = Math.min(input.y,player.y),
		playerBottom = player.y + player.h;

	if(devMode) {
		$('.dirtyBound').remove();
		var d = document.createElement('div');
		d.setAttribute('class', 'dirtyBound');
		$(d).css({
			position: 'absolute',
			top: minY,
			left: minX,
			width: input.w,
			height: input.h
		});	
		gameboard.append(d);
	}
	hitList = [];
	for(var i = 0; i < items.length; i++) {
		var other = items[i];
		if ((minX + input.w >= other.x) && (minX <= other.x + other.w) && (minY + input.h >= other.y) && (minY <= other.y + other.h)) {
			other.flipped = false;
			hitList.push(other);
			//check to see which side the player is on (above or below)
			if(playerBottom < other.bottom) {
				other.selector.addClass('fgItem');
			} else {
				other.selector.removeClass('fgItem');
			}
		}
	}
}

//stop the current player movement animation
function stopMove() {
	inTransit = false;
	player.selector.stop(true).css({
		'background-position': -640
	});
	scrollElement.stop(true);
	player.x = prevMoveX;
	player.y = prevMoveY;
	player.selector.css({
		top: prevMoveY,
		left: prevMoveX
	});
	showMessage(player.otherSelector,['Ouch!'], true);
}

function getFeed() {
	$('#blog').rssfeed('http://communityplanit.engagementgamelab.org/?feed=rss2', {
		limit: 1,
		header: false,
		dateformat: 'date',
		snippet: false,
		// media: false,
		errormsg: 'check out our blog at this website!'
	}, function() {
		$('iframe').remove();
		//remove the last paragraph tag (super hack!)
		$('#blog p').first().remove();
		$('#blog p').last().remove();
		$('#blog p').last().remove();
		$('#blog p').last().remove();

		$('#blog h4 a').attr('target', '_blank');
		var s = $('#blog p').text(),
			link = $('#blog h4 a').attr('href');
		var sub = s.substring(0,144) + '... <a target="_blank" href="' + link + '">[view post]</a>';
		$('#blog p').html(sub);
		$('#blog').append('<p style="text-align:center;"><button style="width: 90%;" id="hideBlog" class="btn btn-mini btn-warning" type="button">hide</button><p>')
		$('#blog').fadeIn();
		$('#hideBlog').on('click', function() {
			$('#blog').fadeOut();
		});
	});
}

function selectCharacter() {
	$body.on('click','#infoBox img', function() {
		var p = $(this).attr('data-player');
		setupPlayer(p);
	});
	infoBox.css('top', height/2 - 152);
	setTimeout(function() {
		infoBox.css({
			left: 0
		});
	}, 200);
}

function dev() {
	devMode = !devMode;
	console.log(devMode);
	if(devMode) {
		$('.item').addClass('hitBound');
		$('#player').css('background-color', 'rgba(0,255,0,0.5)');		
	} else {
		$('.item').removeClass('hitBound');
		$('#player').css('background-color', 'rgba(0,0,0,0)');
	}
}