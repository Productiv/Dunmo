
var convert = {
  // years: ,
  // months,
  // weeks,
  days: 24 * 60 * 60 * 1000,
  hours: 60 * 60 * 1000,
  minutes: 60 * 1000,
  seconds: 1000,
  milliseconds: 1
};

// TODO operators like -, +, ==, etc.
fromSeconds = function(seconds) {
  return fromMilliseconds(seconds * 1000);
};

fromMilliseconds = function (milliseconds) {
  var newD = new Duration();
  newD._lengthInMs = milliseconds;

  if (milliseconds > 999) {
    newD._seconds = Math.floor(milliseconds / 1000);
    milliseconds = milliseconds % 1000;
    if (newD._seconds > 59) {
      newD._minutes = Math.floor(newD._seconds / 60);
      newD._seconds = newD._seconds % 60;
      if (newD._minutes > 59) {
        newD._hours = Math.floor(newD._minutes / 60);
        newD._minutes = newD._minutes % 60;
        if (newD._hours > 23) {
          newD._days = Math.floor(newD._hours / 24);
          newD._hours = newD._hours % 24;
          if (newD._days > 6) {
            var today = new Date();
            var month = today.getMonth();
            var year = today.getFullYear();

            if (newD._days > 364) {
              newD._years = Math.floor(newD._days / 365);
              newD._days = newD._days % 365;
            };

            while (newD._days > 27) {
              if ((month % 2 == 0) && (newD._days > 30)) {  // Even month && >30?
                newD._months += 1;
                newD._days = newD._days - 31;
              } else {
                if (month == 1) {  // Feb?
                  if ((moment.isLeapYear([year])) && (newD._days > 28)) {
                    newD._months += 1;
                    newD._days = newD._days - 29;
                  } else if (newD._days > 27) {
                    newD._months += 1;
                    newD._days = newD._days - 28;
                  };
                } else {
                  if (newD._days > 29) {
                    newD._months += 1;
                    newD._days = newD._days - 30;
                  };
                };
              };
            };

            newD._weeks = Math.floor(newD._days / 7);
            newD._days = newD._days % 7;
          };
        };
      };
    };
  };

  return newD;
};

function toDetailedString() {
  var str = "";

  var that = this;
  this.fields.forEach( function (field, index) {
    field = '_' + field;
    if(that[field] !== undefined && that[field] !== 0) {
      var d = moment.duration(that[field], field);
      var dh = d.humanize();
        str += dh + " ";
    }
  });

  return str;
};

function toAbbrevDetailStr() {
  var str = '';
  if(this.days() > 0)    str += this.days()    + 'd ';
  if(this.hours() > 0)   str += this.hours()   + 'h ';
  if(this.minutes() > 0) str += this.minutes() + 'm ';
  if(this.seconds() > 0) str += this.seconds() + 's';
  return str;
};

function toShortString(argument) {
  // body...
};

function toMilliseconds() {
  return this._lengthInMs;
};

function toSeconds() {
  return Math.round(this._lengthInMs / 1000);
};

Duration = function (init) {
  if     (typeof init === 'number') return fromMilliseconds(init);
  else if(typeof init === 'string') return fromMilliseconds((new Date(init)).getTime());
  else if(typeof init === 'date')   return fromMilliseconds(init.getTime());
  else if(typeof init === 'object') return fromMilliseconds(init._lengthInMs);

  var that = new Object(null);

  that.fields = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

  that.fields.forEach( function (field, index) {
    that['_' + field] = 0;
    that[field] = function() {
      return this['_' + field];
    };
    that['inc' + field.titleize()] = function(amt) {
      return fromMilliseconds(this._lengthInMs + amt * convert[field]);
    };
  });

  that['_lengthInMs'] = 0;
  that['lengthInMs'] = function() {
    return this['_lengthInMs'];
  };

  that['toDetailedString']  = toDetailedString;
  that['toAbbrevDetailStr'] = toAbbrevDetailStr;
  // that['toShortString']     = toShortString;
  that['toMilliseconds']    = toMilliseconds;
  that['toSeconds']         = toSeconds;

  return that;
};

