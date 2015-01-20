// Given `char`, returns a function which takes a string and returns whether
// the first character of that string is `char`.
isFirstChar = function(c) {
  return function(str) {
    return str.charAt(0) === c;
  };
};

secondsToDurationObj = function (seconds) {
  var duration = {
    seconds: seconds,
    minutes: 0,
    hours: 0,
    days: 0,
    weeks: 0,
    months: 0,
    years: 0
  };

  if (seconds > 59) {
    duration.minutes = Math.floor(seconds / 60);
    duration.seconds = seconds % 60;
    if (duration.minutes > 59) {
      duration.hours = Math.floor(duration.minutes / 60);
      duration.minutes = duration.minutes % 60;
      if (duration.hours > 23) {
        duration.days = Math.floor(duration.hours / 24);
        duration.hours = duration.hours % 24;
        if (duration.days > 6) {
          var today = new Date();
          var month = today.getMonth();
          var year = today.getFullYear();

          if (duration.days > 364) {
            duration.years = Math.floor(duration.days / 365);
            duration.days = duration.days % 365;
          };

          while (duration.days > 27) {
            if ((month % 2 == 0) && (duration.days > 30)) {  // Even month && >30?
              duration.months += 1;
              duration.days = duration.days % 31;
            } else {
              if (month == 1) {  // Feb?
                if ((moment.isLeapYear([year])) && (duration.days > 28)) {
                  duration.months += 1;
                  duration.days = duration.days % 29;
                } else if (duration.days > 27) {
                  duration.months += 1;
                  duration.days = duration.days % 28;
                };
              } else {
                if (duration.days > 29) {
                  duration.months += 1;
                  duration.days = duration.days % 30;
                };
              };
            };
          };

          duration.weeks = Math.floor(duration.days / 7);
          duration.days = duration.days % 7;
        }
      }
    }
  };
  console.log("duration obj: ", duration);
  return duration;
};

durationObjDisplay = function (obj) {
  var str = "";
  var s = " ";

  if (obj.years) {
    str += moment.duration(obj.years, 'years').humanize() + s;
  }
  if (obj.months) {
    str += moment.duration(obj.months, 'months').humanize() + s;
  }
  if (obj.weeks) {
    str += moment.duration(obj.weeks, 'weeks').humanize() + s;
  }
  if (obj.days) {
    str += moment.duration(obj.days, 'days').humanize() + s;
  }
  if (obj.hours) {
    str += moment.duration(obj.hours, 'hours').humanize() + s;
  }
  if (obj.minutes) {
    str += moment.duration(obj.minutes, 'minutes').humanize() + s;
  }
  if (obj.seconds) {
    str += moment.duration(obj.seconds, 'seconds').humanize();
  }
  return str;
}

Date.prototype.toSeconds = function() {
  return Math.round(this.getTime() / 1000);
};

Date.todayEnd = function() {
  var date = new Date()
  date.setHours(23, 59, 00, 00);
  return date;
};

Date.todayStart = function() {
  var date = new Date()
  date.setHours(00, 00, 00, 00);
  return date;
};

Date.sevenDaysAgoStart = function() {
  var today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 00, 00, 00, 00);
};

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

