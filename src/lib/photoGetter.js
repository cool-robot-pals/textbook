var env = require('env.js');
var random = require('lib/random.js');

var apiUrl = 'https://www.googleapis.com/customsearch/v1';

module.exports = function(query,params) {

	if(!params) var params = {};
	if(!params.debug) params.debug = false;

	var dfd = jQuery.Deferred();
	if(params.debug === true) {
		dfd.resolve([
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Gameplay_of_Pokemon_Go.jpg/245px-Gameplay_of_Pokemon_Go.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Reina_restaurant_Istanbul.JPG/1920px-Reina_restaurant_Istanbul.JPG'
		]);
	}
	else {
		$.ajax({
			url: apiUrl,
			dataType: 'json',
			data: {
				q: query
				   + ' stock -quote -whisper -ecards -meme -screenshot',
				safe: 'medium',
				searchType: 'image',
				imgSize: 'xlarge',
				imgType: random(['photo','face','clipart']),
				cx: env.googleSearchCx,
				key: env.googleSearchKey,
			}
		}).done(function(response){
			dfd.resolve([
				response.items[Math.floor(Math.random() * response.items.length)].link,
				response.items[Math.floor(Math.random() * response.items.length)].link
			]);
		});
	}
	return dfd.promise();
}
