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
			var index = parseInt($(this).attr('data-index'),10);
			if(items[index].action) {
				items[index].action();
			} else {
				showMessage(this, items[index].messages);
			}
		}
	});

	//click to move or show message
	$body.on('click','#player', function(e) {
		if(!inTransit) {
			preventMove();
			showMessage(this, player.messages);
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
	showMessage(player.otherSelector,['click anywhere to move.']);
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
