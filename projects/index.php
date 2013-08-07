<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include '../head.php' ?>
	</head>
	<body>
		<div id='wrap'>
			<?php include '../nav.php' ?>
			<div class='container'>
				<div id='projects'>
					<div class='row'>
						<div class='span4'>
							<h3> Community PlanIt </h3>
							<p class='picture'><img src='http://placehold.it/192x192.png'></p>
							<p class='description'>Community PlanIt is a game that makes planning playful, and gives everyone the power to shape the future of their community.</p>
						</div>
						<div class='span4'>
							<h3> Civic Seed </h3>
							<p class='picture'><img src='http://placehold.it/192x192.png'></p>
							<p class='description'>Civic Seed is a multi-player RPG that harnesses the power of online social play to teach and certify students to civically engage with partner communities.</p>
						</div>
						<div class='span4'>
							<h3> Nyami Nyami </h3>
							<p class='picture'><img src='http://placehold.it/192x192.png'></p>
							<p class='description'>In partnership with the Red Cross / Red Crescent Climate  Center, this game will teach people living in the Zambezi River valley in Zimbabwe to predict dangerous floods.</p>
						</div>
					</div>
					<div class='row'>
						<div class='span4'>
							<h3> Participatory Chinatown </h3>
							<p class='picture'><img src='http://placehold.it/192x192.png'></p>
							<p class='description'>Players of Participatory Chinatown explored a digital, 3D version of Boston's Chinatown neighborhood, and took on the role of Chinatown residents faced with real challenges and decisions.</p>							
						</div>
						<div class='span4'>
							<h3> Hub2 </h3>
							<p class='picture'><img src='http://placehold.it/192x192.png'></p>
							<p class='description'>Hub2 brings citizens together in virtual spaces to collaborate, participate in workshops, and reimagine their communities together.</p>
						</div>
						<div class='span4'>
							<h3> Student Projects </h3>
							<p class='picture'><img src='http://placehold.it/192x192.png'></p>
							<p class='description'>Engagement Game Lab students create their own games and projects, including Level 257, a monthly multi-media exploration of games.</p>
						</div>
					</div>
				</div>
			</div>
			<div id='push'></div>
   		</div>
		<?php include '../footer.php' ?>

    	<!-- Los javascripts -->
    	<script src='/js/libs/lab.js'></script>
    	<script>
    		$LAB
    		.script('/js/libs/jquery.min.js').wait()
			.script('/js/libs/bootstrap.min.js');
    	</script>
  </body>
</html>
