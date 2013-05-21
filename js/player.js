var player,
	direction,
	currentFrame,
	numFrames = 2;
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
	input.w = absDiffX + player.w;
	input.h = absDiffY + player.h;
	getHitList(input);

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
