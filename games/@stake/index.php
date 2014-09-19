<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include '../../head.php' ?>
	</head>
	<body>
		<div id='wrap'>
			<?php include '../../nav.php' ?>
			<div class='whatIsIt'>
				<div class='container'>
					<div class='row'>
						<div class='span4'>
							<div class='projectLogo'>
								<img src='../../img/projects/logos/@stake.png'>
							</div>
						</div>
						<div class='span8 projectDescription'>
							<p>
								<span>@Stake</span> is a role-playing / tabletop card game that fosters democracy, empathy, and creative problem solving for civic issues. Players take on a variety of roles and pitch ideas under a time pressure, competing to produce the best idea in the eyes of the table&#39;s &ldquo;Decider.&rdquo;
							</p>
						</div>
					</div>
					<div class='row'>
						<div class='span6 projectContext'>
							<h2 class='funTitle'>
								Development
							</h2>
							<p>	
								This project focused on one key challenge - the limitations among the untrained public to adequately understand abstract space. But urban planning poses other challenges as well. Most notable is conflict negotiation. Planning issues often involve conflicting interests coupled with deep resentments and community divides. Building a new highway, for example, is seldom only a question of the highway's design, but the destiny of the land, the community, and individual residents. 
							</p>
							<p>
								We were amazed at the success of @Stake in driving productive conversation at our UNDP workshop, and took it back to the Lab for further development. Since then, it&#39;s been used at the Frontiers of Democracy Conference, The Jewish Federation, youth ambassador programs for inner city planning institutions in Boston, and the United Nations in New York. Numerous expansions and customization packs have made the game robust enough to aid in processes of all types nationally and across the world.
							</p>
							<p>
								Since its inception, @Stake has become one of our best tools for proving to others that games can be productive civic tools.
							</p>
						</div>
						<div class='span6 videoContainer'>
							<img src='../../img/projects/other/@stakecard.png'>
						</div>
					</div>
				</div>
			</div>
			<div class='container projectPage'>
				<div class='theGame'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Game</h2>
							<p>
								<img class='inlineImageRightMedium' src='../../img/projects/other/@workshop.png'>
								<span>What is it about?</span> Before the game takes place, the play group must brainstorm topics for the game. The topics selected should be important questions for whatever real world process matters most to the players and their organization (ex. &ldquo;How can we get young people more involved in local issues?&rdquo;).
							</p>
							<p>
								<span>The Decider</span> Once the question for each round has been established, one player becomes the first &ldquo;Decider,&rdquo; the player who will pick from the other players&#39; pitches and determine which is best. It&#39;s up to them to keep time, promote fair play, and make prompt decisions in awarding points.							
							</p>
							<p>
								<span>Role Cards</span> All other players are assigned roles such as Mayor, Activist, or Student. Each role card features a short bio and three agenda goals that the players try to include in their pitches for bonus points.
							</p>
							<p>
								<span>The Pitch</span> Players hear the question for the round, and are then given one minute to devise an idea. Pitching occurs in two phases. Each player has one minute to give their initial pitch to the Decider, and then there is a short discussion period during which players may ask questions of one another and try to achieve compromises to attach their agenda items to others&#39; plans.
							</p>
							<p>
								<span>Decider</span> At the end of the round, the Decider must pick a winning pitch. That winning player earns points, then every player earns bonus points based on their agenda items. The new decider is the player that won the previous round.
							</P>
							<p><span>Rulebook and downloadable materials coming soon!</span></p>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>Workshops</h2>
							<p>
								As a new tool still in development, @Stake has been used in a number of workshops, including for the UN, non-profit organizations at Harvard University, and The Frontiers of Democracy. The Engagement Lab offers this game as a free tool, and also offers facilitated play sessions for organizations who are interested in using games to foster empathy, creativity, collaboration, deliberation, and enthusiasm in civic processes.
							</p>
							<p><span>Email us about using @Stake at info [at] engagementgamelab.org</p>
						</div>
					</div>
				</div>
			</div>
			<div id='push'></div>
   		</div>
		<?php include '../../footer.php' ?>

    	<!- Los javascripts ->
    	<script src='/js/libs/lab.js'></script>
    	<script>
    		$LAB
    		.script('/js/libs/jquery.min.js').wait()
			.script('/js/libs/bootstrap.min.js').wait()
			.script('/js/libs/fitvids.js').wait()
			.script('/js/other/vimeo.js');
    	</script>
  </body>
</html>
