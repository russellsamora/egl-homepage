(function() {
	$('#blog').rssfeed('http://communityplanit.engagementgamelab.org/?feed=rss2', {
		limit: 10,
		header: false,
		dateformat: 'date',
		snippet: false,
		// media: false,
		errormsg: 'russell made an error.'
	}, function() {
		//replace a tags h4 text
		$('#blog a').each(function() {
			var text = $(this).text(),
				parent = $(this).parent();
			$(this).remove();
			$(parent).text(text);
		});

		//center iframes for videos
		$('#blog iframe').each(function() {
			var parent = $(this).parent();
			$(parent).css('text-align', 'center');
		});
	});
})();