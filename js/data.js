var player = {
	id: 'player',
	class: 'character',
	x: 550,
	y: 250,
	w: 80,
	h: 160,
	offset: {
		x: 40,
		y: 80
	},
	messages: ['I am you, you are me....woah.','What?! I am inside a computer?','I am so tired of walking...','Stop clicking on me, it tickles!']
};

var items = [{
	class: 'tree',
	x: 200,
	y: 150,
	messages: ['I am tree!']
}, {
	class: 'desk',
	x: 800,
	y: 250,
	messages: ['wahoo desk! wicked exciting.']
}, {
	class: 'whiteboard',
	x: 500,
	y: 50,
	action: function() {
		whiteboard();
	}
}];
