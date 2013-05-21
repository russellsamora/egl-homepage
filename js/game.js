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
	gameData,
	ready = false;

$(function() {
	setupSelectors();
	setupPlayer();
	setupEvents();
	resize();
	setPosition();
	loadData('backup');
});

function setupSelectors() {
	gameboard = $('#gameboard');
	gameboardWidth = parseInt(gameboard.css('width'),10);
	gameboardHeight = parseInt(gameboard.css('height'),10);
	scrollElement = $('html, body');
	scrollElement.each(function(i) {
        $(this).scrollTop(0).scrollLeft(0);
    });
}

function setupPlayer() {
	player = {
		selector: $('#player'),
		position: {},
		width: 80,
		height: 160,
		offset: {
			x: 40,
			y: 80
		}
	};
}

function setupEvents() {
	gameboard.on('click', function(e) {
		e.preventDefault();
		if(!inTransit) {
			//constrain to the left and top screen
			var y = Math.max(0,(e.pageY - navBarHeight - player.offset.y)),
				x = Math.max(0,e.pageX - player.offset.x);

			//constrain bottom and right of screen
			x = Math.min(x, gameboardWidth - player.width);
			y = Math.min(y, gameboardHeight - player.height);

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
}

function setPosition() {
	player.position.x = 200;
	player.position.y = 100;
	player.selector.css({
		top: player.position.y,
		left: player.position.x
	});
}

function resize() {
	width = $(window).width();
	height = $(window).height();
	maxScroll = { 
		left: Math.max(0,gameboardWidth - width),
		top: Math.max(0,gameboardHeight - height + navBarHeight)
	};
}

function movePlayer(input) {
	inTransit = true;

	//do some spatial calculations to find distance and speed
	var diffX =  input.x - player.position.x,
		diffY = input.y - player.position.y,
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
	slideScreen(input);
	player.selector.animate({
		top: input.y,
		left: input.x
	}, speed, 'linear', function() {
		inTransit = false;
		player.position.x = input.x;
		player.position.y = input.y;
		player.selector.css({
			'background-position': -640
		});
	});

	currentFrame = -1;
	animateWalkCycle();
}

function animateWalkCycle() {
	if(inTransit) {
		currentFrame++;
		if(currentFrame >= numFrames) {
			currentFrame = 0;
		}
		var pos = -(direction + currentFrame * player.width) + 'px';
		player.selector.css('background-position', pos);
		setTimeout(animateWalkCycle, 170);
	}
}

function slideScreen(input) {
	//check for page edge clicking to animate scroll!
	var destX, destY;
	//make sure transition isn't too fast.
	var speed = Math.max(500,input.speed);

	//left edge
	if(input.edgeX < player.width && pageXOffset > 0) {
		destX = Math.max(pageXOffset - width / 2, 0);
	//right edge
	} else if( input.edgeX > width - player.width) {
		destX = Math.min(pageXOffset + width / 2, maxScroll.left);
	}
	//top edge
	if(input.edgeY < player.height + navBarHeight && pageYOffset > navBarHeight) {
		destY = Math.max(pageYOffset - height / 2, 0);
	//bottom edge
	} else if( input.edgeY > height - player.height) {
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

function loadData(backupData) {
	if(backupData) {
		gameData = new Miso.Dataset({
			url: '../data/backup.csv',
			delimiter: ','
		});
	} else {
		gameData = new Miso.Dataset({
			importer : Miso.Dataset.Importers.GoogleSpreadsheet,
			parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
			key : '0AtnV9m5qu78_dEY2dWNIRXNhTk1USk9rRG9McTFuMkE',
			worksheet: '1'
		});
	}
	gameData.fetch({ 
		success : function() {
			this.each(function(row){
				console.log(row);
			});
			ready = true;
		},
		error : function() {
			console.log('having a bad day? Try backup data!');
			loadData('backup');
		}
	});
}