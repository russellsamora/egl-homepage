<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include '../../head.php' ?>
	</head>
	<body>
		<div id='wrap' class='specialBackground'>
			<?php include '../../nav.php' ?>
			<div class='whatIsIt'>
				<div class='projectLogo'>
					<p><a href='http://communityplanit.org' target='_blank'><img src='../../img/projects/logos/cpi.png'></a>
					</p>
				</div>
				<p class='projectTagline'>
					Your Community, Your Future, Your Move!		
				</p>
			</div>
			<div class='container projectPage'>
				<div class='row briefOverview'>
					<div class='span6'>
							<p>
								<span><a target='_blank' href='http://communityplanit.org'>Community PlanIt</a></span> is a playful and dynamic way to give input to city officials for long-range strategic planning, while rallying around awards for local causes, connecting with others in your community, and gaining a sense of empowerment in the process of active of civic engagement.
							</p>
					</div>
					<div class='span6 videoContainer'>
						<iframe src="http://player.vimeo.com/video/55893197?title=0&amp;byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen="" allowfullscreen=""></iframe>
					</div>
				</div>
				<div class='realProblem'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle indentH2'>
								Context
							</h2>
						</div>
						<div class='span12'>
							<p>	
								<!-- <span class='contextTagline'>Better Access, Broader Input, More Discussion and Deliberation</span><br> -->

								<img class='inlineImage' src='../../img/projects/other/cpi1.png'>
								Civic leaders and town planners often seek community input when trying to imagine solutions to complex issues that take into consideration the actual needs of the community. With our busy schedules and other pressing obligations, it is often difficult, if not outright impossible, for people to attend in-person town hall meetings where input is given, costs and benefits are debated, and decisions get made. 
								Even if one can attend such official gatherings, not everyone feels comfortable standing up before others and voicing their opinion. <img class='inlineImageRightBig' src='../../img/projects/other/cpi2.jpg'>Meetings can be dominated by the loudest voices in the room, not always the most prudent or knowledgeable.
								To lower the barriers for participation we must remove obstacles:
								scheduling conflicts discomfort with public speaking lack of transportation or simple boredom or disenchantment with public processes.


							</p>
						</div>
					</div>
				</div>
				<div class='theGame'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Game</h2>
							<p>
								<img class='inlineImageRightSmall' src='../../img/projects/other/cpi4.png'>
								<span>The Goal-</span> Complete challenge questions and themed missions to earn 'coins' that you can pledge to help win money for local causes while contributing a real-world planning process.
							</p>
							<p>
								<span>Play-</span> A Community PlanIt game takes place over a number of missions, each time-limited to one week. To complete a mission, players must answer all challenges within the mission by answering questions about their experiences and vision of their community. A challenge could be something as simple as dropping a pin on a map in their favorite place, or as complex as reading a series of informative resources, and then making a decision about a specific planned policy - or anything in between.<br><br><img class='inlineImageLeftBig' src='../../img/projects/other/cpi3.jpg'>After every three challenges, players must stop and answer a trivia question about their community, asked by the pesky but well-meaning Crats.
 							</p>
 							<p>
								<span>Support For Local Causes-</span> Each challenge and trivia question players complete earn them virtual coins, which they can pledge to real-world causes. Players can also earn awards, which include a coin bonus, by participating in discussion and deliberation throughout the game. At the end of the game, the three top causes will receive real-world funding to make their project a reality.
							</p>
						</div>
					</div>
				</div>
				<div class='realActions'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Real-World Action/Results</h2>
							<p>
								<span>Community Members</span> - get to have a voice in local planning process and have the opportunity to form networks and relationships with other member of the community who share their concerns or perspectives
							</p>
							<p>
								<span>City Officials</span> - get input from the community and have an opportunity to build trust with the public by giving them a voice in matters that can seem closed-off to anyone but politicians, paid lobbyist and land developers
							</p>
							<p>
								<span>Local Businesses</span> - get the opportunity to sponsor local nonprofits, schools and neighborhood improvement projects, and give back to the community that supports them
							</p>
							<p>
								<span>Community Organizations</span> - get awarded funding to support neighborhood improvement projects, schools, or local nonprofit programs
							</p>
						</div>
					</div>
				</div>
				<div class='implementations'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>Implementations</h2>
							<p style='text-align:center;'><img src='../../img/projects/other/table.jpg'></p>
						</div>
					</div>
				</div>
				<div class='theMedia'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>Media</h2>
							<p>
								<iframe align="center" src="http://www.flickr.com/slideShow/index.gne?set_id=72157629640337246" width="500" height="500" frameBorder="0" scrolling="no"></iframe>
							</p>
						</div>
					</div>
				</div>
				<div class='curriculum extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>Curriculum</h2>
							<p>
								The curriculum is a structured series of activities, ideas, and questions that interested communities can use to develop and implement their own instance of Community PlanIt. The curriculum takes its users through the work of choosing a game topic, researching the issues, developing game content and media, doing outreach and fundraising, and facilitating game play and community deliberation. Curriculum development is funded by the Pearson Foundation's New Learning Institute, which is collaborating with the Engagement Game Lab on this project.
							</p>
							<p> Curriculum site will be available soon...</p>
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
