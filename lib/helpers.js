
Date.prototype.toSeconds = function() {
  return Math.round(this.getTime() / 1000);
};

Date.getMidnight = function() {
	var today = new Date();
	return (new Date(today.getFullYear(), today.getMonth(), today.getDay(), 23, 59, 00, 00));
};
