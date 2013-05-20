var width,
	height,
	player,
	inTransit = false,
	gameboard,
	scrollElement;

$(function() {
	setupSelectors();
	setupPlayer();
	setupEvents();
	resize();
	setPosition();
});

function setupSelectors() {
	gameboard = $('#gameboard');
	scrollElement = $('body');
	scrollElement.each(function(i) {
        $(this).attr('scrollTop', 0).attr('scrollLeft',0);
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
			var info = {
				x: e.pageX,
				y: e.pageY,
				edgeX: e.clientX,
				edgeY: e.clientY
			};

			movePlayer(info);
		}
	});
}

function setPosition() {
	player.position.x = width / 2;
	player.position.y = height / 2;
	player.selector.css({
		top: player.position.y,
		left: player.position.x
	});
}

function resize() {
	width = $(window).width();
	height = $(window).height();
}

function movePlayer(info) {
	//check for page edge clicking to animate scroll!
	if(info.edgeX < player.width) {
		var left = scrollElement.scrollLeft();
		// left -= width;
		// scrollElement.scrollLeft(left);
	} else if( info.edgeX > width - player.width) {
	}
	inTransit = true;
	var distance = (Math.abs(player.position.x - info.x) + Math.abs(player.position.y - info.y)) / 2,
		speed = distance * 5;
	player.selector.animate({
		top: info.y - player.offset.y,
		left: info.x - player.offset.x
	}, speed, 'linear', function() {
		inTransit = false;
		player.position.x = info.x;
		player.position.y = info.y;
	});
}