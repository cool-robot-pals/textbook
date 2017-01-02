var photoGetter = require('lib/photoGetter.js');
var makeColors = require('lib/makeColors.js');

var titles = require('data/majors.js');
var names = require('data/names.js');
var wrap = require('data/wrap.js');
var layouts = require('data/layouts.js');

var layoutsTotal = Object.keys(layouts).length;

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

var getAllPossibleVariants = function(variants) {

	var possibles = []
	var possibleItem = [];

	function iterator(possibleItem,level) {
		for(var i = 1;i <= variants[level]; i++) {
			possibleItem = JSON.parse(JSON.stringify(possibleItem));
			possibleItem[level] = i;
			if(variants[level+1]) {
				iterator(possibleItem,level+1);
			}
			else {
				possibles.push(possibleItem);
			}
		}
	}

	iterator([],0);

	console.log(possibles);
	return possibles;

}

var makeCss = function() {

	var css = require('template/textbook.css');
	var colors = makeColors();

	var alignments = ['left','right'];
	var verticalAlignments = ['top','bottom'];

	Object.keys(colors).map(function(k){
		css = css
		.replace(new RegExp('-@color-'+k+'-1-', 'g'),'#'+colors[k][0])
		.replace(new RegExp('-@color-'+k+'-2-', 'g'),'#'+colors[k][1])
		.replace(new RegExp('-@color-'+k+'-3-', 'g'),'#'+colors[k][2])
	});

	var alignment = random(alignments);
	var verticalAlignment = random(verticalAlignments);

	css = css
	.replace(new RegExp('-@align-vertical-alt-', 'g'),verticalAlignment)
	.replace(new RegExp('-@align-vertical-', 'g'),verticalAlignment === verticalAlignments[0]?verticalAlignments[1]:verticalAlignments[0])
	.replace(new RegExp('-@align-alt-', 'g'),alignment)
	.replace(new RegExp('-@align-', 'g'),alignment === alignments[0]?alignments[1]:alignments[0])
	.replace(new RegExp('-@negaposi-alt-', 'g'),random(['-','']))
	.replace(new RegExp('-@negaposi-', 'g'),random(['-','']));

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

	if(!params.layout) params.layout = Math.ceil(Math.random()*layoutsTotal);
	if(!params.variant) {
		params.variant = random(getAllPossibleVariants(layouts[params.layout].variants))
	}

	var title = getTitle();

	var $textbook = $('<textbook></textbook>');

	$textbook.addClass('l'+params.layout);

	for(var variantIndex = 0; variantIndex < params.variant.length; variantIndex++) {
		$textbook.addClass('v-'+(variantIndex+1)+'-'+params.variant[variantIndex]);
	}

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

	lib.layoutsTotal = layoutsTotal;
	lib.layouts = layouts;
	lib.makeBook = makeBook;
	lib.getAllPossibleVariants = getAllPossibleVariants;

	makeCss();

	return lib;
}
