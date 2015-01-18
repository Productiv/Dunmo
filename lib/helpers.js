// Given `char`, returns a function which takes a string and returns whether
// the first character of that string is `char`.
isFirstChar = function(c) {
  return function(str) {
    return str.charAt(0) === c;
  };
};

Date.prototype.toSeconds = function() {
  return Math.round(this.getTime() / 1000);
};

Date.todayEnd = function() {
	return ((new Date()).setHours(23, 59, 00, 00));
};

Date.todayStart = function() {
	return ((new Date()).setHours(00, 00, 00, 00));
};

Date.sevenDaysAgoStart = function() {
	var today = new Date();
	return (new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 00, 00, 00, 00));
};
