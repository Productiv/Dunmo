function Duration () {

  this.fields = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
  
  this.fields.forEach( function (field, index) {
  	this[field] = 0;
  });

  this.fromMilliseconds = fromMilliseconds;
  this.toDetailedString = toDetailedString;
  this.toAbbrevDetailStr = toAbbrevDetailStr;
  this.toShortString = toShortString;
}

fromMilliseconds = function (milliseconds) {
	var newD = new Duration();

	if (milliseconds > 999) {
		newD.milliseconds = Math.floor(milliseconds / 1000);
		newD.milliseconds = milliseconds % 1000;
	  if (seconds > 59) {
	    newD.minutes = Math.floor(newD.seconds / 60);
	    newD.seconds = newD.seconds % 60;
	    if (newD.minutes > 59) {
	      newD.hours = Math.floor(newD.minutes / 60);
	      newD.minutes = newD.minutes % 60;
	      if (newD.hours > 23) {
	        newD.days = Math.floor(newD.hours / 24);
	        newD.hours = newD.hours % 24;
	        if (newD.days > 6) {
	          var today = new Date();
	          var month = today.getMonth();
	          var year = today.getFullYear();

	          if (newD.days > 364) {
	            newD.years = Math.floor(newD.days / 365);
	            newD.days = newD.days % 365;
	          };

	          while (newD.days > 27) {
	            if ((month % 2 == 0) && (newD.days > 30)) {  // Even month && >30?
	              newD.months += 1;
	              newD.days = newD.days - 31;
	            } else {
	              if (month == 1) {  // Feb?
	                if ((moment.isLeapYear([year])) && (newD.days > 28)) {
	                  newD.months += 1;
	                  newD.days = newD.days - 29;
	                } else if (newD.days > 27) {
	                  newD.months += 1;
	                  newD.days = newD.days - 28;
	                };
	              } else {
	                if (newD.days > 29) {
	                  newD.months += 1;
	                  newD.days = newD.days - 30;
	                };
	              };
	            };
	          };

	          newD.weeks = Math.floor(newD.days / 7);
	          newD.days = newD.days % 7;
	        };
	      };
	    };
	  };
	};
  console.log("newD obj: ", newD);
  return newD;
};

toDetailedString = function () {
  var str = "";

  this.fields.forEach( function (field, index) {
  	if (this[field]) {
	    str += moment.duration(this[field], field).humanize() + " ";
	  }
  });

  return str;
};

toAbbrevDetailStr = function () {
	var str = this.toDetailedString;

	str = str.replace('years', 'y');
	str = str.replace('months', 'm');
	str = str.replace('weeks', 'w');
	str = str.replace('days', 'd');
	str = str.replace('hours', 'h');
	str = str.replace('minutes', 'm');
	str = str.replace('seconds', 's');
	str = str.replace('milliseconds', 'ms');

	str = str.replace('year', 'y');
	str = str.replace('month', 'm');
	str = str.replace('week', 'w');
	str = str.replace('day', 'd');
	str = str.replace('hour', 'h');
	str = str.replace('minute', 'm');
	str = str.replace('second', 's');
	str = str.replace('millisecond', 'ms');

	return str;
};

toShortString = function (argument) {
	// body...
};
