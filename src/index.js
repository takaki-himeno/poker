import $ from 'jquery';
import _ from 'underscore';

import "./style.css";

var allCards = [];
var myCards = [];
var boardCards = [];
var targetList = myCards;
var mode = 'mc';
var ranks = _.range(1, 14);
var suits = ['s', 'd', 'h', 'c'];

var CLASS = {
	SELECTED: 'selected'
};

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

function renderCards() {
	var targetSelector = '.' + mode;
	var targetList = (mode === 'mc') ? myCards : boardCards;
	clearDestributedCards(targetSelector);
	_.each(targetList, function(card, i) {
		$('.' + mode + '-' + (i+1)).attr({
			'data-rank': card.r,
			'data-suit': card.s
		}).text(dispCard(card));
	});
	console.log(myCards, boardCards);
}

// 初期化
function init() {
	myCards.length = 0;
	boardCards.length = 0;
	$('.' + CLASS.SELECTED).removeClass(CLASS.SELECTED);
	mode = 'mc';
	selectCorrectList()
	changeTitleColor();
	clearDestributedCards();
}

// ヘッドライの帯の色を変えてどちらが選択されているのか可視化
function changeTitleColor() {
	$('.hl-cards').removeClass(CLASS.SELECTED);
	$('.hl-cards.' + mode).addClass(CLASS.SELECTED);
}

// 場のカードの表示を初期化
function clearDestributedCards(selector) {
	if(!selector) {
		selector = '.card-l.mc, .card-l.bc'
	} else {
		selector += '.card-l';
	}
	$(selector).removeAttr('data-rank').removeAttr('data-suit').text('blank');
}

// パレットのカードタップされたら
$('.card').click(function(e) {
console.log(mode);
	var limNum = (mode === 'mc') ? 2 : 5;
	var $ct = $(e.currentTarget);
	var isSelected = $ct.hasClass(CLASS.SELECTED);
	var tappedCard = {
		r: $ct.data('rank'),
		s: $ct.data('suit')
	};
	if(targetList.length < limNum && !isSelected) {
		targetList.push(tappedCard);
		$ct.addClass(CLASS.SELECTED + ' ' + mode);
	}
	else if(isSelected) {
		var newMode = $ct.hasClass('mc') ? 'mc' : 'bc';
		changeMode(newMode);
		_.some(targetList, function(targetCard, i) {
			if(isSameCards(targetCard, tappedCard)) {
				targetList.splice(i, 1);
				$ct.removeClass(CLASS.SELECTED).removeClass(mode);
				return true;
			}
		});
	}
	renderCards();

	// モード自動切り替え
	if(mode === 'mc' && myCards.length === 2 && boardCards.length < 5) {
		changeMode('bc');
	}
	else if(mode === 'bc' && boardCards.length === 0 && myCards.length < 2) {
		changeMode('mc');	
	}
});

// モード切替押された
$('.hl-cards, .card-l').click(function() {
	var newMode = $(this).hasClass('mc') ? 'mc' : 'bc';
	changeMode(newMode);
});

// 場のカードタップされた
$('.card-l').click(function() {
	if(!$(this).data('rank')) return;
	var targetMode = $(this).hasClass('mc') ? 'mc' : 'bc';
	changeMode(targetMode);
	console.log($(this).index());
	var targetCard = targetList.splice($(this).index(), 1);
	$('.card[data-rank="' + targetCard[0].r + '"][data-suit="' + targetCard[0].s + '"]').removeClass(CLASS.SELECTED);
	renderCards();
});

function selectCorrectList() {
	targetList = (mode === 'mc') ? myCards : boardCards;
}

function changeMode(newMode) {
	mode = newMode;
	selectCorrectList();
	changeTitleColor();
}

$('#reset').click(function() {
	init();
});