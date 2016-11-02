var env = require('env.js');
var apiUrl = 'https://api.shutterstock.com/v2';

var concepts = require('data/concepts.js');
var titles = require('data/majors.js');
var names = require('data/names.js');

var bookCreated = new Event('bookCreated',{bubbles:true});


function encodeAuthorization() {
	var clientId = env.clientId;
	var clientSecret = env.clientSecret;

	if (!clientId || !clientSecret) {
		throw('Client id and/or client secret are missing in the API key section, with out these you wont be able to contact the API.');
	}
	return 'Basic ' + window.btoa(clientId + ':' + clientSecret);
}

module.exports = function(){

	var rq = $.ajax({
		url: apiUrl + '/images/search',
		dataType: 'json',
		data: {
			query: concepts[Math.floor(Math.random() * concepts.length)],
			image_type: 'photo',
			orientation: 'vertical'
		},
		headers: {
			Authorization: encodeAuthorization()
		}
	});

	var random = function(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	var getAuthor = function() {
		return random(names)+' '+random(names);
	}

	rq.done(function(response){
		var url = response.data[Math.floor(Math.random() * response.data.length)].assets.preview.url;
		var url2 = response.data[Math.floor(Math.random() * response.data.length)].assets.preview.url;

		var authors = Math.ceil(Math.random()*4);
		var layout = Math.ceil(Math.random()*6);

		var title = titles[Math.floor(Math.random() * titles.length)];
		var titleSeed = Math.random();
		if(titleSeed > .75) title = 'Intro to '+title;
		else if (titleSeed < .25) title = title + ' 101';
		else if (titleSeed < .5) title = 'Updated '+title;

		$('textbook').addClass('l'+layout);

		$('textbook bg').css({'background-image':'url('+url+')'});
		$('textbook bg2').css({'background-image':'url('+url2+')'});
		$('textbook title').text(title);

		for(var i = 0; i < authors; i++) {
			$('textbook author').append('<span>'+getAuthor()+'</span>');
		}

		$('textbook')[0].dispatchEvent(bookCreated);

	});

}
