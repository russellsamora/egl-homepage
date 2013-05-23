var direction,
	currentFrame,
	numFrames = 2,
	speedAmplifier = 7;
/*** player *****/
//set skeleton for player data
function setupPlayer(file) {
	var d = document.createElement('div');
	var i = new Image();
	i.onload = function() {
		d.setAttribute('class', player.class);
		d.setAttribute('id', player.id);
		$(d).css({
			position: 'absolute',
			top: player.y,
			left: player.x,
			width: player.w,
			height: player.h,
			backgroundImage: 'url(' + i.src + ')',
			backgroundPosition: '-640px'
		});
		$gameboard.append(d);
		player.selector = $('#player');
		player.otherSelector = document.getElementById('player');
		//now we will enable all sorts of clickin!
		setupEvents();

		//hide the player picker box
		$('#infoBox').css('left', -360);
		$gameboard.removeClass('outOfFocus');
	}
	i.src = '../img/' + file + '.png';
}

//figure out where to move the player and move em!
function movePlayer(input) {
	inTransit = true;
	//do some spatial calculations to find distance and speed
	var diffX =  input.x - player.x,
		diffY = input.y - player.y,
		absDiffX = Math.abs(diffX),
		absDiffY = Math.abs(diffY),
		distance =  Math.sqrt((diffX * diffX) + (diffY * diffY));
		speed = distance * speedAmplifier;

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
	
	//set the z-indexes to the right value
	setZIndex(input);

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

	//for hitting AND for flipping index
	hitTest();

	//reset frame since it auto counts up (so first is really 0 when it starts)
	currentFrame = -1;
	//delay this so if we have a hit right away, we don't animate
	setTimeout(animateWalkCycle, 17);	
}

//key movement is much different than mouse
// function movePlayerKey(key) {
// 	inTransit = true;

// 	var input,
// 		diffX = 0,
// 		diffY = 0,
// 		absDiffX = 20,
// 		absDiffY = 20;
	
// 	if(key === 87) {
// 		//up
// 		direction = 480;
// 		diffY = -20;
// 	} else if (key === 83) {
// 		//down
// 		direction = 320;
// 		diffY = 20;
// 	} else if (key === 68) {
// 		//right
// 		direction = 160;
// 		diffX = 20;
// 	} else if (key === 65) {
// 		//left
// 		direction = 0;
// 		diffX = -20;
// 	}
	
// 	var distance = Math.sqrt((diffX * diffX) + (diffY * diffY)),
// 	speed = distance * speedAmplifier;

// 	input.x = player.x + diffX;
// 	input.y = player.y + diffY;
// 	input.speed = speed;
// 	input.w = absDiffX + player.w;
// 	input.h = absDiffY + player.h;

// 	//set the z-indexes to the right value
// 	setZIndex(input);

// 	//figure out if we need to slide screen
// 	slideScreen(input, true);
// }

//perform a jump move!
function jumpPlayer() {
	inTransit = true;
	player.selector.css('background-position', -720);
	sound.play('jump');
	player.selector.animate({
		top: player.y - 100
	}, 250, function() {
		$(this).animate({
			top: player.y
		},250, function() {
			inTransit = false;
			player.selector.css('background-position', -640);
		});
	});
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
