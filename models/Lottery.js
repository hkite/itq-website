var keystone = require('keystone'), 
    moment   = require('moment'),
	_        = require('underscore'),
	Types    = keystone.Field.Types;

var Lottery = new keystone.List('Lottery', {
	map: { name: 'title'},
	track: true,
	autokey: {path: 'slug', from: 'title', unique: true}
});

Lottery.add({
	title: { type: String, required: true},
	limit: { type: Number, required: true, default: '1'},
	state: { type: Types.Select, options: 'active, past', default: 'active', index: true}, 
	startDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 6:00pm' },
	endDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 9:00pm' },
	image: { type: Types.CloudinaryImage },
	description: { type: Types.Markdown, height:400 },

	enrolled: { type: Types.TextArray },
	winners: {type: Types.TextArray}
});


Lottery.schema.pre('save', function(next) {
	var shuffle = function(array) {
		var m = array.length, t, i;

	  	// While there remain elements to shuffle…
	 	while (m) {

		    // Pick a remaining element…
		    i = Math.floor(Math.random() * m--);

		    // And swap it with the current element.
		    t = array[m];
		    array[m] = array[i];
		    array[i] = t;
		}

	  return array;
	}

	if(moment().isAfter(this.endDate)) {
		shuffled = shuffle(this.enrolled);
		this.winners = _.first(shuffled, this.limit);
	} else {
		this.winners = [];
	}

	next();
});

Lottery.defaultSort = '-startDate';
Lottery.defaultColumns = 'title, state|10%, startDate|15%, endDate|15%';
Lottery.register();
