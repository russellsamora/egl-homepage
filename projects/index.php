<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include '../head.php' ?>
	</head>
	<body>
		<div id='wrap'>
			<?php include '../nav.php' ?>
			<div class='container'>
				<div class='row'>
					<div class='span12'>
						<h2> Projects </h2>
					</div>
				</div>
				<div id='projects'>
					<div class='row'>
						<div class='span4'>
							<h3> Community PlanIt </h3>
						</div>
						<div class='span4'>
							<h3> Civic Seed </h3>
						</div>
						<div class='span4'>
							<h3> Participatory Chinatown </h3>
						</div>
					</div>
					<div class='row'>
						<div class='span4'>
							<h3> Hub2 </h3>
						</div>
						<div class='span4'>
							<h3> Nyami Nyami </h3>
						</div>
						<div class='span4'>
							<h3> Student Projects </h3>
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
