//bind input events to trigger functionality
function setupEvents() {
	$(window).on('resize', resize);

	//move player
	$body.on('click', '#gameboard', function(e) {
		//only if we didn't click on the player
		if(!preventMovement) {
			//hide boxes
			clearTimeout(messageTimeout);
			$messageBox.fadeOut();
			e.preventDefault();
			if(!inTransit) {
				//constrain to the left and top screen
				var y = Math.max(0,(e.pageY - NAVBAR_HEIGHT - player.offset.y)),
					x = Math.max(0,e.pageX - player.offset.x);

				//constrain bottom and right of screen
				x = Math.min(x, GAMEBOARD_WIDTH - player.w);
				y = Math.min(y, GAMEBOARD_HEIGHT - player.h);

				var input = {
					x: x,
					y: y,
					edgeX: e.clientX,
					edgeY: e.clientY
				};

				player.movePlayer(input);
			}
		}
	});

	//show a message box with the items info
	$body.on('click','#gameboard .item', function(e) {
		if(!inTransit) {
			//grab the message
			preventMove();
			var key = $(this).attr('data-key');
			if(items[key].action) {
				items[key].action();
			} else {
				showMessage({el: this, messages: items[key].messages});
			}
		}
	});

	//show a message box with players status message
	$body.on('click','#gameboard .person', function(e) {
		if(!inTransit) {
			//grab the message
			preventMove();
			var key = $(this).attr('data-key');
			if(people[key].action) {
				people[key].action();
			} else {
				showMessage({el: this, messages: people[key].messages, name: key});
			}
		}
	});

	//click to move or show message
	$body.on('click','#player', function(e) {
		if(!inTransit) {
			preventMove();
			showMessage({el: this, messages: player.messages});
		}
	});

	//jump or dev mode
	$body.on('keypress', function(e) { 
		if(!inTransit && e.which === 32) {
			player.jumpPlayer();
		} else if(e.which === 114) {
			dev();
		}
	});

	//fade out overlay
	$body.on('click','.returnToGame', function(e) {
		$overlay.fadeOut();
	});

	//on load, this is our tutorial
	showMessage({el: player.otherSelector, messages:['click anywhere to move.']});
}

//special event for selecting character, triggers other events to load
function selectCharacter() {
	$body.on('click','#chooseCharacter img', function() {
		var p = $(this).attr('data-player');
		player.setup(p, function() {
			setupEvents();
			//hide the player picker box
			$('#chooseCharacter').css('left', -420);
			$gameboard.removeClass('outOfFocus');
		});
	});
	$chooseCharacter.css('top', height/2 - 152);
	setTimeout(function() {
		$chooseCharacter.css({
			left: 0
		});
	}, 200);
}

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