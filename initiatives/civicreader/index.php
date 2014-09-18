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
								<img src='../../img/projects/logos/cmr.png'>
							</div>
						</div>
						<div class='container projectPage'>
							<p>
								<span>The Civic Media Project</span> brings together leading scholars and practitioners in the area of civic media to define emerging approaches to activism and civic engagement and share case studies of successful projects. The Civic Media Project will include over 100 online case studies as well as an edited book, The Civic Media Reader, published by MIT Press in 2015.
							</p>
						</div>
					</div>
					<div class='row'>
						<div class='span6 projectContext'>
							<h2 class='funTitle'>
								Context
							</h2>
							<p>	
								How are digital technologies being used to foster connections between citizens and formal and informal public institutions? What does citizenship look like in a networked age? Can technologies alter public processes, change the way people interact with government, and deepen engagement with public life? Can they threaten democracy by providing more efficient mechanisms of monitoring and control of citizens?
							</p>
							<p>
								The Red Cross has begun to offer courses in Uganda to train drives in first aid and reinforce important safety habits such as resting, maintaining motor bikes, and driving safely. Riders who pass the course are awarded special jackets that they can wear on their routes, signifying they are trained and certified. The intent of this credentialing system is to let potential passengers know who has received training and who has not, but the system breaks down if boda boda riders share their jackets.
							</p>
							<p>
								The Boda Boda game was designed to reinforce the basic tenets of the course and to teach in an experiential way the dangers of sharing jackets with riders who have not been certified through the Red Cross class.
							</p>
						</div>
						<div class='span6 videoContainer'>
							<img class='inlineImageRightBig'src='../../img/projects/other/bodatall.png'>
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
								<strong>The Goal:</strong> Players compete to earn fares by safely moving passengers from one station to the next. To do this, they must balance balls on their boards without dropping them. 
									
								<!-- <img class='inlineImageRightSmall' src='../../img/projects/other/civic_seed_statue.png'> -->
								<img class='inlineImageRightBig' src='../../img/projects/other/bodasmall.png'
							</p>
							<p>
								<strong>The Setup:</strong> Boda Boda is played in groups of 12. A facilitator splits the group into pairs, and issues each pair a &ldquo;motorcycle&rdquo; represented by a flat board and a wallet represented by a lanyard that will hold beans (money). Tennis balls are placed around a playing field at six stations, along with the fares the players will compete over.
							</p>
							<p>
								<strong>Playing the Game:</strong> While one member of the pair attempts to do gather as many fares as possible, the other becomes an &ldquo;unsafe driver&rdquo; by walking around the playing field blindfolded. Players must avoid one another, and their blindfolded teammates, in order to safely deliver the balls to the stations.
							</p>
							<p>
								From round to round, teams can choose to spend their beans to maintain their bikes and rest. Failure to do so adds extra restrictions on movement, making it harder to safely transport passengers.
							</p>
							<P>						
							<strong>The Jacket:</strong> When the inevitable crashes happen, players can help each other by giving first aid, and eventually earning Red Cross jackets which have a variety of benefits that will result in increased fares and fewer accidents. Players are allowed to share jackets, but if a player crashes while wearing a borrowed jacket, all players lose the benefits.
							</p>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Real-World Action/Results</h2>

							<p>
								<img class='inlineImageRightSmall' src='../../img/projects/other/bodacircle.png'>
								Players who complete the game as part of the course are certified by the Red Cross and receive jackets that they can wear in real life to signify their credentials. Like all games created by the Engagement Lab, Boda Boda is also part of an ongoing research project. By comparing riders who play the game and riders who take a course without gameplay, we hope to better understand how the power of play can be used to achieve real world goals and change people&rsquo;s behavior for the better long after the game is over.
								
							</p>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id='push'></div>
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
