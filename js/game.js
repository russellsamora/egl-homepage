var width,
	height,
	player,
	inTransit = false,
	gameboard,
	scrollElement,
	maxScroll,
	navBarHeight = 64;

$(function() {
	setupSelectors();
	setupPlayer();
	setupEvents();
	resize();
	setPosition();
});

function setupSelectors() {
	gameboard = $('#gameboard');
	scrollElement = $('html, body');
	scrollElement.each(function(i) {
        $(this).scrollTop(0).scrollLeft(0);
    });
}

function setupPlayer() {
	player = {
		selector: $('#player'),
		position: {},
		width: 128,
		height: 256,
		offset: {
			x: 64,
			y: 128
		}
	};
}

function setupEvents() {
	gameboard.on('click', function(e) {
		e.preventDefault();
		if(!inTransit) {
			var input = {
				x: (e.pageX - player.offset.x),
				y: (e.pageY - navBarHeight - player.offset.y),
				edgeX: e.clientX,
				edgeY: e.clientY
			};

			movePlayer(input);
		}
	});
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
		left: Math.max(0,parseInt(gameboard.css('width'),10) - width),
		top: Math.max(0,parseInt(gameboard.css('height'),10) - height)
	};
}

function movePlayer(input) {
	inTransit = true;
	var distance = (Math.abs(player.position.x - input.x) + Math.abs(player.position.y - input.y)) / 2,
		speed = distance * 5;

	input.speed = speed;
	slideScreen(input);
	player.selector.animate({
		top: input.y,
		left: input.x
	}, speed, 'linear', function() {
		inTransit = false;
		player.position.x = input.x;
		player.position.y = input.y;
	});
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