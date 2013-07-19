(function() {
	$('#blog').rssfeed('http://engagementgamelab.wordpress.com/feed/', {
		limit: 10,
		header: false,
		dateformat: 'date',
		snippet: false,
		// media: false,
		errormsg: 'russell made an error.'
	}, function() {
		// //replace a tags h4 text
		$('#blog h4 a').each(function() {
			var text = $(this).text(),
				parent = $(this).parent();
			$(this).remove();
			$(parent).text(text);
		});

		$('#blog .rssRow div').addClass('date');

		//some tidying
		$('#blog ul li').each(function() {
			var p = $(this).find('p');
			$(p).first().remove();
			$(p).last().remove();
			$(this).find('br').remove();
			$(this).find('a').remove();

		});
		// //center iframes for videos
		// $('#blog iframe').each(function() {
		// 	var parent = $(this).parent();
		// 	$(parent).css('text-align', 'center');
		// });
	});
})();