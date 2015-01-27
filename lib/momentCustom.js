(function(){
  var oldcal = {
    lastDay : '[Yesterday at] LT',
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    lastWeek : '[last] dddd [at] LT',
    nextWeek : 'dddd [at] LT',
    sameElse : 'L'
  };

  var newcal = {
    sameDay : '[Today]',
    nextDay : '[Tomorrow]',
    nextWeek : 'dddd',
    lastDay : '[Yesterday]',
    lastWeek : '[last] dddd',
    sameElse : 'L'
  };

  moment.fn.oldcalendar = moment.fn.calendar;

  moment.fn.calendar = function(withoutTime) {
    if (withoutTime) {
      moment.locale('en', { calendar : newcal });
      var result = this.oldcalendar();
      moment.locale('en', { calendar : oldcal });
      return result;
    } else {
      moment.calendar = oldcal;
      return this.oldcalendar();
    }
  }
})();