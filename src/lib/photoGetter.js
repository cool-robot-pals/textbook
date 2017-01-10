var env = require('env.js');
var apiUrl = 'https://api.shutterstock.com/v2';

function encodeAuthorization() {
	var clientId = env.clientId;
	var clientSecret = env.clientSecret;

	if (!clientId || !clientSecret) {
		throw('Client id and/or client secret are missing in the API key section, with out these you wont be able to contact the API.');
	}
	return 'Basic ' + window.btoa(clientId + ':' + clientSecret);
}

module.exports = function(query,mock) {
	var dfd = jQuery.Deferred();
	if(mock === true) {
		dfd.resolve([
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Gameplay_of_Pokemon_Go.jpg/245px-Gameplay_of_Pokemon_Go.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Reina_restaurant_Istanbul.JPG/1920px-Reina_restaurant_Istanbul.JPG'
		]);
	}
	else {
		$.ajax({
			url: apiUrl + '/images/search',
			dataType: 'json',
			data: {
				query: query,
				image_type: 'photo',
				orientation: 'vertical'
			},
			headers: {
				Authorization: encodeAuthorization()
			}
		}).done(function(response){
			dfd.resolve([
				response.data[Math.floor(Math.random() * response.data.length)].assets.preview.url,
				response.data[Math.floor(Math.random() * response.data.length)].assets.preview.url
			]);
		});
	}
	return dfd.promise();
}
