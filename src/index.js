import $ from 'jquery';
import _ from 'underscore';

import "./style.css";


// Util
// todo: 将来独立ファイルにする
function combination(m, n) {
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

function permutation(m, n) {
	var _m = m;
	var _n = n;
	var ans = 1;
	_.times(_n, function() {
		ans *= (_m--);
	});
	return ans;
}

console.log(permutation(5,2));