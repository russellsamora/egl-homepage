<!--
          .         .              
          |         |              
,-. ,-. ,-| ,-. ;-. |-. ,-. ;-. ,-:
|   | | | | |-' | | | | |-' |   | |
`-' `-' `-' `-' ' ' `-' `-' '   `-|
                                `-'
-->
<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include 'head.php' ?>
		<link href='css/custom-game.css' rel='stylesheet'>
	</head>
	<body>
		<div id='wrap'>
	    	<div class='navbar navbar-fixed-top'>
	  			<?php include 'nav.php' ?>
			</div> <!-- end nav -->
			<div id='game'>
				<div id='message'>
					<p class='messageText'></p>
					<div class='soundcloud'>
						<p></p>
						<img src='img/soundcloud/black_text.png'>
					</div>
				</div>
				<div id='bioCard'>
					<img class='bioImage'>
					<p class='bioName'>Name: <span></span></p>
					<p class='bioTitle'>Title: <span></span></p>
					<p class='bioAbout'>About: <span></span></p>
				</div>
				<div id='pregame'>
					<div class='instructions'>
						<h2> Welcome to the Engagement Game Lab! </h2>
						<p> 
							Click PLAY to begin the interactive experience, meet our staff, and explore the lab and our projects. Just click (or touch) anywhere in the environment to move. Clicking people or objects lets you interact. Are you ready?
						</p>
						<p> If you prefer a traditional browsing experience, you can use the navigation at the top of the page instead.
						</p>
						<p class='playGame'>
							<a class='playGameButton btn btn-large'>PLAY!</a>
						</p>
						<p class='loading'>
							loading...
						</p>
					</div>
				</div>
			</div>
			<div id='blogTease'></div>
			<div id='nongame'>
				<div class='row-fluid'>
					<div class='span4 projectsLink'>
						<p>Projects</p>
					</div>
				</div>
				<div class='row-fluid'>
					<div class='span4 researchLink'>
						<p>Research</p>
					</div>
				</div>
				<div class='row-fluid'>
					<div class='span4 aboutLink'>
						<p>About</p>
					</div>
				</div>
				<div class='row-fluid'>
					<div class='span4 blogLink'>
						<p>Blog</p>
					</div>
				</div>
			</div>
			<!-- <div id='push'></div> -->
   		</div>
    	<!-- Los javascripts -->
    	<script src='js/libs/lab.js'></script>
    	<script>
    		$LAB
			.script('js/libs/jquery.min.js')
			.script('js/libs/bootstrap.min.js')
			.script('js/libs/modernizr.js')
			.script('js/libs/plugins.js').wait()
			.script('js/game/main.js').wait(function() {
				var gotGame = $game.init();
				if(gotGame) {
					$LAB
					.script('js/game/input.js')
					.script('js/game/audio.js')
					.script('js/game/items.js')
					.script('js/game/whiteboard.js')
					.script('js/game/player.js').wait(function() {
						$game.beginGame();
					});
				}
			});
    	</script>
  </body>
</html>
