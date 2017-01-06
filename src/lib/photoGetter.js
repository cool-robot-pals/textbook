var env = require('env.js');
var concepts = require('data/concepts.js');
var apiUrl = 'https://www.googleapis.com/customsearch/v1';
var random = require('lib/random.js');

module.exports = function(mock) {
	var dfd = jQuery.Deferred();
	if(mock === true) {
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
				q: concepts[Math.floor(Math.random() * concepts.length)]
				   + (Math.random() > .33 ? '':' person')
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
