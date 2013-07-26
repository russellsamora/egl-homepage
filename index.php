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
  			<?php include 'nav.php' ?>
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
						<p class='enter'>Enter the</p>
						<h2>Engagement Game Lab:</h2>
						<p class='description'> 
							Explore the lab, meet our staff, and find out about what we do.
						</p>
						<p class='playGame'>
							<a class='playGameButton btn btn-large'>PLAY<span>!</span></a>
						</p>
						<p class='loading'>
							loading...
						</p>
						<p class='howTo'>
							Game Instructions: Click to explore.
						</p>
						<!-- <p class='tinyasterisk'>
							*If you prefer a traditional browsing experience, you can use the navigation at the top of the page instead.
						</p> -->
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
					.script('js/game/tv.js')
					.script('js/game/wiki.js')
					.script('js/game/player.js').wait(function() {
						$game.beginGame();
					});
				}
			});
    	</script>
  </body>
</html>
