//player file
(function() {
	//private vars
	var _direction,
		_currentFrame,
		_numFrames = 2,
		_walkTimeout = null,
		_speedAmplifier = 7;
	
	var self = $game.player = {
		//public vars
		ready: false,
		id: 'player',
		class: 'character',
		x: 550,
		y: 250,
		w: 100,
		h: 200,
		offset: {
			x: 50,
			y: 100
		},
		messages: ['I am you, you are me....woah.','What?! I am inside a computer?','I am so tired of walking...','Stop clicking on me, it tickles!'],
		score: 0,
		response: {},

		init: function (file) {
			var d = document.createElement('div');
			var i = new Image();
			i.onload = function() {
				d.setAttribute('class', self.class);
				d.setAttribute('id', self.id);
				$(d).css({
					position: 'absolute',
					top: self.y,
					left: self.x,
					width: self.w,
					height: self.h,
					backgroundImage: 'url(' + i.src + ')',
					backgroundPosition: '-800px'
				});
				$GAMEBOARD.append(d);
				self.selector = $('#player');
				self.otherSelector = document.getElementById('player');
				self.ready = true;
			}
			i.src = '../../img/player/' + file + '.png';
		}

		// //figure out where to move the player and move em!
		// movePlayer: function(input) {
		// 	inTransit = true;
		// 	//do some spatial calculations to find distance and speed
		// 	var diffX =  input.x - player.x,
		// 		diffY = input.y - player.y,
		// 		absDiffX = Math.abs(diffX),
		// 		absDiffY = Math.abs(diffY),
		// 		distance =  Math.sqrt((diffX * diffX) + (diffY * diffY));
		// 		speed = distance * speedAmplifier;

		// 	input.speed = speed;
			
		// 	//calculate direction
		// 	//this means its going pretty vertical likely (images: left, right, down, up, idle)
		// 	if(absDiffY / absDiffX > 1) {
		// 		if(diffY > 0) {
		// 			//down
		// 			direction = 320;
		// 		} else {
		// 			//up
		// 			direction = 480;
		// 		}
		// 	} else {
		// 		if(diffX > 0) {
		// 			//right
		// 			direction = 160;
		// 		} else {
		// 			//left
		// 			direction = 0;
		// 		}
		// 	}
		// 	input.w = absDiffX + player.w;
		// 	input.h = absDiffY + player.h;
			
		// 	//set the z-indexes to the right value
		// 	setZIndex(input);

		// 	//figure out if we need to slide screen
		// 	slideScreen(input);

		// 	//set the animation
		// 	player.selector.stop().animate({
		// 		top: input.y,
		// 		left: input.x
		// 	}, speed, 'linear', function() {
		// 		inTransit = false;
		// 		player.x = input.x;
		// 		player.y = input.y;
		// 		player.selector.css({
		// 			'background-position': -640
		// 		});
		// 	});

		// 	//for hitting AND for flipping index
		// 	hitTest();

		// 	//reset the frame
		// 	currentFrame = 0;
		// 	steps = 0;
		// 	//delay this so if we have a hit right away, we don't animate
		// 	clearTimeout(walkTimeout);
		// 	setTimeout(self.animateWalkCycle, 17);	

		// },

		// //perform a jump move!
		// jumpPlayer: function() {
		// 	inTransit = true;
		// 	player.selector.css('background-position', -720);
		// 	sound.fx.play('jump');
		// 	player.selector.animate({
		// 		top: player.y - 100
		// 	}, 250, function() {
		// 		$(this).animate({
		// 			top: player.y
		// 		},250, function() {
		// 			inTransit = false;
		// 			player.selector.css('background-position', -640);
		// 		});
		// 	});
		// },

		// //switch out sprite for walk cycle
		// animateWalkCycle: function() {
		// 	steps++;
		// 	if(inTransit) {
		// 		currentFrame++;
		// 		if(currentFrame >= numFrames) {
		// 			currentFrame = 0;
		// 		}
		// 		var pos = -(direction + currentFrame * player.w) + 'px';
		// 		player.selector.css('background-position', pos);
		// 		clearTimeout(walkTimeout);
		// 		walkTimeout = setTimeout(self.animateWalkCycle, 170);
		// 	}
		// }
	};
})();