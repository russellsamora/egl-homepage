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
	player,
	inTransit = false,
	gameboard,
	gameboardWidth,
	gameboardHeight,
	scrollElement,
	maxScroll,
	navBarHeight = 64,
	direction,
	currentFrame,
	numFrames = 2,
	gameData = [],
	ready = false,
	prevMoveX,
	prevMoveY;

$(function() {
	init();
});

function init() {
	setupSelectors();
	setupPlayer();
	setupHits(0);
	setupEvents();
	resize();
	setPosition();
	loadData('backup');
}

function setupSelectors() {
	gameboard = $('#gameboard');
	gameboardWidth = parseInt(gameboard.css('width'),10);
	gameboardHeight = parseInt(gameboard.css('height'),10);
	scrollElement = $('html, body');
	scrollElement.each(function(i) {
        $(this).scrollTop(0).scrollLeft(0);
    });
}

/*** player *****/
//set skeleton for player data
function setupPlayer() {
	player = {
		selector: $('#player'),
		otherSelector: document.getElementById('player'),
		x: 0,
		y: 0,
		w: 80,
		h: 160,
		offset: {
			x: 40,
			y: 80
		}
	};
}

//hard set of player position with no animation
function setPosition() {
	player.x = 200;
	player.y = 100;
	player.selector.css({
		top: player.y,
		left: player.x
	});
}

//figure out where to move the player and move em!
function movePlayer(input) {
	inTransit = true;

	//do some spatial calculations to find distance and speed
	var diffX =  input.x - player.x,
		diffY = input.y - player.y,
		absDiffX = Math.abs(diffX),
		absDiffY = Math.abs(diffY),
		distance =  (absDiffX + absDiffY) / 2,
		speed = distance * 10;

	input.speed = speed;
	
	//calculate direction
	//this means its going pretty vertical likely (images: left, right, down, up, idle)
	if(absDiffY / absDiffX > 1) {
		if(diffY > 0) {
			//down
			direction = 320;
		} else {
			//up
			direction = 480;
		}
	} else {
		if(diffX > 0) {
			//right
			direction = 160;
		} else {
			//left
			direction = 0;
		}
	}

	//figure out if we need to slide screen
	slideScreen(input);

	//set the animation
	player.selector.animate({
		top: input.y,
		left: input.x
	}, speed, 'linear', function() {
		inTransit = false;
		player.x = input.x;
		player.y = input.y;
		player.selector.css({
			'background-position': -640
		});
	});

	
	hitTest();
	//reset frame since it auto counts up (so first is really 0 when it starts)
	currentFrame = -1;
	//delay this so if we have a hit right away, we don't animate
	setTimeout(animateWalkCycle, 17);	
}

//switch out sprite for walk cycle
function animateWalkCycle() {
	if(inTransit) {
		currentFrame++;
		if(currentFrame >= numFrames) {
			currentFrame = 0;
		}
		var pos = -(direction + currentFrame * player.w) + 'px';
		player.selector.css('background-position', pos);
		setTimeout(animateWalkCycle, 170);
	}
}

/*** setup ****/
//bind input events to trigger functionality
function setupEvents() {
	gameboard.on('click', function(e) {
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
	});
	$(window).on('resize', resize);
	gameboard.on('click','.item', function(e) {
		//this.id;
	});
}

//load in data for environmental image assets and attach to DOM
function setupEnvironment(index) {
	var b = background[index];
	//create item, add to dom
	var d = document.createElement('div');
	i = new Image();
	i.src = '../img/' + b.class + '.png';
	i.onload = function() {
		d.setAttribute('class', b.class + ' item');
		d.setAttribute('id', b.id);
		d.appendChild(i);
		$(d).css({
			position: 'absolute',
			top: b.y,
			left: b.x,
			width: b.w,
			height: b.h
		});
		gameboard.append(d);
		index++;
		if(index < background.length) {
			setupEnvironment(index);
		} else {
			console.log('environment loaded');
		}
	}
}

//load in all the data for the invisible hit tests
function setupHits(index) {
	var b = invisibleOverlays[index];
	//create item, add to dom
	var d = document.createElement('div');
	d.setAttribute('id', b.id);
	$(d).css({
		position: 'absolute',
		top: b.y,
		left: b.x,
		width: b.w,
		height: b.h
	});
	gameboard.append(d);
	index++;
	if(index < invisibleOverlays.length) {
		setupHits(index);
	} else {
		setupEnvironment(0);
	}
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
		success : function() {
			this.each(function(row){
				gameData.push(row);
			});
			ready = true;
		},
		error : function() {
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
function slideScreen(input) {
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

//TODO: get bounding box to reduce number of checks
//do a hit test with all invisible objects to see if we need to stop the player movement
function hitTest() {
	other = invisibleOverlays[0];
	//only test if moving...
	if(inTransit) {
		//must pull the current position (yuck)
		var tempX = parseFloat(player.otherSelector.style.left),
			tempY = parseFloat(player.otherSelector.style.top);

		//classic rectangle hit test -> stop movement
		if ((tempX + player.w >= other.x) && (tempX <= other.x + other.w) && (tempY + player.h >= other.y) && (tempY <= other.y + other.h)) {
			stopMove();
		}
		//store the last step so we can place player there for no conflicts on next move
		prevMoveX = tempX;
		prevMoveY = tempY;
		requestAnimationFrame(hitTest);
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
}