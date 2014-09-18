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
							Games and play are a central part of the human experience, and key to the <a href='/research'>research</a> and output of the Engagement Lab. Our focus on games centers around the philosophy of <a href='/initiatives/#engagementgames'>Engagement Games</a>, a genre defined by our work at the Lab that uses game actions not just to facilitate real world processes, but to natively be real-world actions themselves.						
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
							<p class='picture'><a href='riskhorizon/'><img src='../../img/projects/logos/riskpod.png'></a></p>
							<p class='description'><span>Risk Horizon</span> is a lite strategy game created in partnership with the World Bank designed to teach risk management skills. <span class='when'>[now]</span></p>
						</div>
						<div class='span4'>
							<p class='picture'><a href='bodaboda/'><img src='../../img/projects/logos/bodaboda.png'></a></p>
							<p class='description'><span>Boda Boda</span> is a game designed in partnership with the Red Cross to encourage positive Boda Boda practices. <span class='when'>[now]</span></p>
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
							<p class='picture'><a href='@stake/'><img src='/img/projects/mayor.png'></a></p>
							<p class='description'><span>@Stake</span> is a role-playing / tabletop card game that fosters democracy, empathy, and creative problem solving for civic issues.<span class='when'>[now]</span></p>
						</div>
						<div class='span4'>
							<p class='picture'><a href='student-projects/'><img src='/img/projects/students.jpg'></a></p>
							<p class='description'>Engagement Lab students create their own games and projects, including Level 257, a monthly multi-media exploration of games.</p>
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
