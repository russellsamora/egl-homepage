<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include '../head.php' ?>
	</head>
	<body>
		<div id='wrap'>
			<?php include '../nav.php' ?>
			<div id='projectBlurb'>
				<div class='row'>
					<div class='projectBlurbBody'>
						<!-- <h2> What We Do </h2> -->
						<p class='bigIdea'>
							Our games and play-based projects were designed in partnership with the Knight Foundation, Tufts University, The Red Cross / Red Crescent Climate Center, and <a href='/about/#partners' target='_blank'>others</a>.
						</p>
					</div>
				</div>
			</div>
			<div class='container'>
				<div id='projects'>
					<div class='row'>
						<div class='span4'>
							<p class='picture'><img src='/img/projects/cpi.jpg'></p>
							<p class='description'><span>Community PlanIt</span> is a game that makes planning playful, and gives everyone the power to shape the future of their community.</p>
						</div>
						<div class='span4'>
							<p class='picture'><img src='/img/projects/cs.jpg'></p>
							<p class='description'><span>Civic Seed</span> is a multi-player RPG that harnesses the power of online social play to teach and certify students to civically engage with partner communities.</p>
						</div>
						<div class='span4'>
							<p class='picture'><img src='/img/projects/nyami.jpg'></p>
							<p class='description'><span>UpRiver!</span> is made in partnership with the Red Cross / Red Crescent Climate  Center.  This game will teach people living in <!-- the Zambezi River valley in --> Zimbabwe to predict dangerous floods.</p>
						</div>
					</div>
					<div class='row'>
						<div class='span4'>
							<p class='picture'><img src='/img/projects/chinatown.jpg'></p>
							<p class='description'><span>Participatory Chinatown</span> players explored a digital, 3D version of Boston's Chinatown neighborhood, and took on the role of Chinatown residents faced with real challenges and decisions.</p>							
						</div>
						<div class='span4'>
							<p class='picture'><img src='/img/projects/hub2.jpg'></p>
							<p class='description'><span>Hub2</span> brings citizens together in virtual spaces to collaborate, participate in workshops, and reimagine their communities together.</p>
						</div>
						<div class='span4'>
							<p class='picture'><img src='/img/projects/students.jpg'></p>
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
