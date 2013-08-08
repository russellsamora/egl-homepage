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
				</div>
				<div id='popupBox'>
					<div class='bio'>
						<img class='bioImage'>
						<p class='bioName'>NAME: <span></span></p>
						<p class='bioTitle'>TITLE: <span></span></p>
						<p class='bioAbout'>ABOUT: <span></span></p>
					</div>
					<div class='wiki'><p></p></div>
					<div class='soundcloud'>
						<p class='songTitle'></p>
						<p class='user'></p>
						<p><img src='img/soundcloud/white_text.png'></p>
					</div>
				</div>
				<div id='pregame'>
					<div class='instructions'>
						<p class='enter'>Enter the</p>
						<h2>Engagement Game Lab:</h2>
						<p class='description'> 
							<!-- An applied research lab harnessing play for civic engagement. -->
							<!-- An applied research lab dedicated to harnessing play for civic engagement. -->
							<!-- An applied research lab designing games for civic engagement. -->
							<!-- An applied research lab, foreplay, and civic engagement. -->
							An applied research lab for play and civic engagement.
						</p>
						<p class='playGame'>
							<a class='playGameButton btn btn-large'>PLAY<span>!</span></a>
						</p>
						<p class='loading'>
							loading...
						</p>
						<p class='howTo'>
							Meet our staff, faculty, and students, explore our projects, and find out more about what we do. 
							<br>Game Instructions: Click to explore.
							<!-- Game Instructions: Click to explore. -->
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
			<div id='nongameH'>
				<div class='container'>
					<div class='row'>
						<div class='span12'>
							<p>
								Welcome to the Engagement Game Lab! If you make your browser taller, you can play a game to learn about what we do.
							</p>
						</div>
					</div>
					<!-- <div class='row'>
						<div class='span3'>
							<p>Projects</p>
						</div>
						<div class='span3'>
							<p>Projects</p>
						</div>
						<div class='span3'>
							<p>Projects</p>
						</div>
						<div class='span3'>
							<p>Projects</p>
						</div>
					</div> -->
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
