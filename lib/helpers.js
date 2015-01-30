
_ = lodash;

_.sum = function(collection) {
  return _.reduce(collection, function(sum, item) {
    return sum + item;
  });
};

_.avg = function(collection) {
  return _.sum(collection) / collection.length;
};

_.remove = function(array, callback, thisArg) {
  var index = -1,
      length = array ? array.length : 0,
      result = [];

  callback = lodash.createCallback(callback, thisArg, 3);
  while (++index < length) {
    var value = array[index];
    if (callback(value, index, array)) {
      result.push(value);
      array.splice(index--, 1);
      length--;
    }
  }
  return result;
};

// Given `char`, returns a function which takes a string and returns whether
// the first character of that string is `char`.
isFirstChar = function(c) {
  return function(str) {
    return str.charAt(0) === c;
  };
};

// http://www.oct4th.com/2013/03/15/titleize-for-javascript/
String.prototype.titleize = function() {
  var words = this.split(' ')
  var array = []
  for (var i=0; i<words.length; ++i) {
    array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1))
  }
  return array.join(' ')
};

// DATE
Date.prototype.toSeconds = function() {
  return Math.round(this.getTime() / 1000);
};

Date.prototype.isToday = function() {
  return (this.setHours(00, 00, 00, 00) === this.todayStart());
};

Date.dayEnd = function(date) {
  var date = new Date(date) || new Date();
  date.setHours(23, 59, 00, 00);
  return date;
};

Date.todayEnd = function() {
  return Date.dayEnd();
};

Date.todayStart = function() {
  var date = new Date();
  date.setHours(00, 00, 00, 00);
  return date;
};

Date.sevenDaysAgoStart = function() {
  var today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 00, 00, 00, 00);
};

Date.prototype.endOfDay = function() {
  return Date.dayEnd(this);
}

Date.prototype.humanizedRelativeDay = function() {
  var today = new Date();
  moment([this.getFullYear, this.getMonth, this.getDate]).from()
};

// REMOVE THIS ???
secToTime = function(seconds) {
  var minutes = seconds / 60;
  var hours = 0;
  var days = 0;
  var str = "";

  while (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  };

  if (hours < 10) {
    str += Math.floor(hours).toString() + ":";
    if (minutes < 10) { str += "0"; };
    str += Math.floor(minutes).toString();

  } else if (hours > 24) {

    while (hours >= 24) {
      hours -= 24;
      days += 1;
    };

    str += Math.floor(days).toString() + ":";
    if (hours < 10) { str += "0"; };
    str += Math.floor(hours).toString() + ":";
    if (minutes < 10) { str += "0"; };
    str += Math.floor(minutes).toString();

  } else {

    str += Math.floor(hours).toString() + ":";
    if (minutes < 10) { str += "0"; };
    str += Math.floor(minutes).toString();
  };
  return str;
}
