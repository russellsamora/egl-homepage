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
							Our engagement games and play-based projects are all designed not just to facilitate official processes, education, and real-world action, but to natively be real-world actions themselves. They are designed and built in cooperation with our <a href='/about/#partners' target='_blank'>partners</a>.
						</p>
					</div>
				</div>
			</div>
			<div class='container'>
				<div id='projects'>
					<div class='row'>
						<div class='span4'>
							<p class='picture'><a href='community-planit/'><img src='/img/projects/cpi.jpg'></a></p>
							<p class='description'><span>Community PlanIt</span> is a game that makes planning playful, and gives everyone the power to shape the future of their community. <span class='when'>[2011-now]</span></p>
						</div>
						<div class='span4'>
							<p class='picture'><a href='civic-seed/'><img src='/img/projects/cs.jpg'></a></p>
							<p class='description'><span>Civic Seed</span> is a multi-player RPG that harnesses the power of online social play to teach and certify students to civically engage with partner communities. <span class='when'>[2012-now]</span></p>
						</div>
						<div class='span4'>
							<p class='picture'><a href='upriver/'><img src='/img/projects/upriver.jpg'></a></p>
							<p class='description'><span>UpRiver</span> is made in partnership with the Red Cross / Red Crescent Climate Center. This game will teach people living in high-risk areas to predict dangerous floods. <span class='when'>[now]</span></p>
						</div>
					</div>
					<div class='row'>
						<div class='span4'>
							<p class='picture'><a href='street-cred/'><img src='/img/projects/streetcred.jpg'></a></p>
							<p class='description'><span>Street Cred</span> is a game-based civic badging API that is meant to expand the types of civic actions people take using existing tools like Citizens Connect or Foursquare. <span class='when'>[now]</span></p>
						</div>
						<div class='span4'>
							<p class='picture'><a href='habitat/'><img src='/img/projects/habitat.jpg'></a></p>
							<p class='description'><span>Habit@</span> is designed to give local citizens many ways to both make their voice heard and access important information, and take action with others in their community. <span class='when'>[now]</span></p>
						</div>
						<div class='span4'>
							<p class='picture'><a href='participatory-chinatown/'><img src='/img/projects/chinatown.jpg'></a></p>
							<p class='description'><span>Participatory Chinatown</span> players explored a digital, 3D version of Boston's Chinatown neighborhood, and took on the role of Chinatown residents faced with real challenges and decisions. <span class='when'>[2011]</span></p>							
						</div>
					</div>
					<div class='row'>
						<div class='span4'>
							<p class='picture'><a href='hub2/'><img src='/img/projects/hub2.jpg'></a></p>
							<p class='description'><span>Hub2</span> brings citizens together in virtual spaces to collaborate, participate in workshops, and reimagine their communities together. <span class='when'>[2011]</span></p>
						</div>
						<div class='span4'>
							<p class='picture'><a href='student-projects/'><img src='/img/projects/students.jpg'></a></p>
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
