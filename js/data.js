var player = {
	id: 'player',
	class: 'character',
	x: 550,
	y: 200,
	w: 80,
	h: 160,
	offset: {
		x: 40,
		y: 80
	},
	messages: ['I am you, you are me....woah.','What?! I am inside a computer?','I am so tired of walking...','Stop clicking on me, it tickles!']
};

var background = [{
	id: 'tree1',
	class: 'tree',
	x: 400,
	y: 150,
	w: 180,
	h: 400,
	messages: ['I am tree!']
}, {
	id: 'rusellDesk',
	class: 'desk',
	x: 200,
	y: 700,
	w: 75,
	h: 60,
	messages: ['I am such a wee desk...']
}, {
	id: 'jesseDesk',
	class: 'desk',
	x: 700,
	y: 100,
	w: 75,
	h: 60,
	messages: ['I am jesse\'s desk...']
}];

var foreground = [{
	id: 'tree1f',
	class: 'tree',
	x: 400,
	y: 150,
	w: 180,
	h: 300
}];

var invisibleOverlays = [{
	id: 'tree1_hit',
	x: 440,
	y: 450,
	w: 100,
	h: 100
}];
