
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
