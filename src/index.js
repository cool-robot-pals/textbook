var photoGetter = require('lib/photoGetter.js');
var makeColors = require('lib/makeColors.js');

var titles = require('data/majors.js');
var names = require('data/names.js');
var wrap = require('data/wrap.js');


var bookCreated = new Event('bookCreated',{bubbles:true});

var random = function(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

var getAuthor = function(type) {
	if(type == 0) {
		return random(names)+' '+random(names).charAt(0).toUpperCase()+' '+random(names);
	}
	if(type == 1) {
		return random(names).charAt(0).toUpperCase()+'. '+random(names);
	}
	else {
		return random(names)+' '+random(names);
	}
}

var getTitle = function() {
	var title = titles[Math.floor(Math.random() * titles.length)];
	var titleSeed = Math.random();
	if(titleSeed > .25) title = random(wrap).replace('$1',title);
	return title;
}

var makeCss = function() {

	var css = require('template/textbook.css');
	var colors = makeColors();

	Object.keys(colors).map(function(k){
		css = css
		.replace(new RegExp('-color-'+k+'-1-', 'g'),'#'+colors[k][0])
		.replace(new RegExp('-color-'+k+'-2-', 'g'),'#'+colors[k][1])
		.replace(new RegExp('-color-'+k+'-3-', 'g'),'#'+colors[k][2])
	});

	$('head').append(
		$('<style></style>').text(css)
	);
}

var makeBook = function(params) {

	if(!params) params = {};
	if(!params.debug) params.debug = false;

	var getPhotos = new photoGetter(params.debug);

	var authorsTotal = Math.ceil(Math.random()*4);
	var authorsType = Math.floor(Math.random()*3);

	if(!params.layout) params.layout = Math.ceil(Math.random()*6);

	var title = getTitle();

	var $textbook = $('<textbook></textbook>');

	$textbook.addClass('l'+params.layout);

	$textbook.append(
		$('<title></title>').append('<span>'+title+'</span>')
	);
	$textbook.append(
		$('<author></author>')
	);
	for(var i = 0; i < authorsTotal; i++) {
		$textbook.find('author').append('<span>'+getAuthor(authorsType)+'</span>');
	}

	getPhotos.done(function(photos){
		$textbook.append(
			$('<bg></bg>').css({'background-image':'url('+photos[0]+')'})
		);
		$textbook.append(
			$('<bg2></bg2>').css({'background-image':'url('+photos[1]+')'})
		);
	});

	$('body').append($textbook);

	$textbook[0].dispatchEvent(bookCreated);

}

module.exports = function(){

	var lib = {};
	lib.makeBook = makeBook;

	makeCss();
	lib.makeBook();
	
	/*
	lib.makeBook({
		debug: true,
		layout: 1
	});
	lib.makeBook({
		debug: true,
		layout: 2
	});
	lib.makeBook({
		debug: true,
		layout: 3
	});
	lib.makeBook({
		debug: true,
		layout: 4
	});
	lib.makeBook({
		debug: true,
		layout: 5
	});
	lib.makeBook({
		debug: true,
		layout: 6
	});
	lib.makeBook({
		debug: true,
		layout: 7
	});
	*/

	return lib;
}
