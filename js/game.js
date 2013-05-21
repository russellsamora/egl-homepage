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
	navBarHeight = 64,
	gameData = [],
	ready = false,
	prevMoveX,
	prevMoveY,
	hitList;

var devMode = false;

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
	dev();
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
	d.setAttribute('class', 'hit');
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

//do a hit test with all invisible objects to see if we need to stop the player movement
function hitTest() {
	//only test if moving...
	if(inTransit) {
		for(var h = 0; h < hitList.length; h++) {
			var other = hitList[h];
			//must pull the current position (yuck)
			var tempX = parseFloat(player.otherSelector.style.left),
				tempY = parseFloat(player.otherSelector.style.top);

			//classic rectangle hit test -> stop movement
			if ((tempX + player.w >= other.x) && (tempX <= other.x + other.w) && (tempY + player.h >= other.y) && (tempY <= other.y + other.h)) {
				stopMove();
				break;
			}
			//store the last step so we can place player there for no conflicts on next move
			prevMoveX = tempX;
			prevMoveY = tempY;
			requestAnimationFrame(hitTest);
		}
	}
}

//create a list of objects that are in the general vicinity of the new path being traveled
//this will let us iterate thru less objects when doing hit test
function getHitList(input) {
	var minX = Math.min(input.x,player.x),
		minY = Math.min(input.y,player.y);

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
	for(var i = 0; i < invisibleOverlays.length; i++) {
		var other = invisibleOverlays[i];
		if ((minX + input.w >= other.x) && (minX <= other.x + other.w) && (minY + input.h >= other.y) && (minY <= other.y + other.h)) {
			hitList.push(other);
		}
	}
	console.log(hitList);
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

function dev() {
	devMode = true;
	$('.hit').addClass('hitBound');
	$('#player').css('background-color', 'rgba(0,255,0,0.5)');
}