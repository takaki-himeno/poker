import $ from 'jquery';
import _ from 'underscore';

import "./style.css";

var allCards = [];
var myCards = [];
var tableCards = [];
var mode;
var ranks = _.range(1, 14);
var suits = ['s', 'd', 'h', 'c'];


// Util
// todo: 将来独立ファイルにする
// mCn
function c(m, n) {
	var _m = m;
	var _n = n;
	var ans = 1;
	_.times(_n, function() {
		ans *= (_m--);
	});
	_.times(_n, function() {
		ans /= (_n--);
	});
	return ans;
}

// mPn
function p(m, n) {
	var _m = m;
	var _n = n;
	var ans = 1;
	_.times(_n, function() {
		ans *= (_m--);
	});
	return ans;
}

// カードを作る
function makeCards() {
	// var shuffledCards = [];
	_.each(ranks, function(r) {
		_.each(suits, function(s) {
			allCards.push({
				r: r,
				s: s
			});
		});  
	});
}
makeCards();


// パレット描画
function makePalette() {
	for(var rank of ranks) {
		$('#palette').append('<tr class="rank' + rank + '" data-rank="' + rank + '"></tr>');
	}
	for(var rank of ranks) {
		for(var suit of suits) {
			$('.rank' + rank).append('<td class="card c' + rank + suit + '" data-rank="' + rank + '" data-suit="' + suit + '">' + dispCard({r: rank,s: suit}) + '</td>');
		}
	}
}
makePalette();


function dispCard(card) {
	var dispRankPalette = {
	  2 :  2,
	  3 :  3,
	  4 :  4,
	  5 :  5,
	  6 :  6,
	  7 :  7,
	  8 :  8,
	  9 :  9,
	  10: 'T',
	  11: 'J',
	  12: 'Q',
	  13: 'K',
	  1 : 'A'
	};

	var dispSuitPalette = {
	  s: '♠',
	  h: '♥',
	  d: '♦️',
	  c: '♣'
	};
	var rank = dispRankPalette[card.r];
	var suit = dispSuitPalette[card.s];
	return rank + suit;
}



function isSameCards(cardA, cardB) {
	return cardA.r === cardB.r && cardA.s === cardB.s;
}

function contains(list, card) {
	return _.some(list, function(_card) {
		return isSameCards(_card, card);
	});
}

$('.card').on('click', function(e) {
	var $ct = $(e.currentTarget);
	var tappedCard = {
		r: $ct.data('rank'),
		s: $ct.data('suit')
	};
	if(myCards.length < 2 && !contains(myCards, tappedCard)) {
		myCards.push(tappedCard);
		$ct.addClass('selected');
	}
	else if(contains(myCards, tappedCard)) {
		_.some(myCards, function(myCard, i) {
			if(isSameCards(myCard, tappedCard)) {
				myCards.splice(i, 1);
				$ct.removeClass('selected');
				return true;
			}
		});
	} 
	renderMyCards();
});

function renderMyCards() {
	$('.mc').empty();
	_.each(myCards, function(card, i) {
		$('.my-card-' + (i+1)).text(dispCard(card));
	});
}
