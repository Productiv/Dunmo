
/*
 * DayList
 * =======
 * ownerId       : String
 * date          : Day
 * timeSpent     : Duration
 * timeRemaining : Duration
 *
 */

DayLists = new Mongo.Collection('dayLists');

DayLists.before.insert(function(userId, doc) {
  doc.createdAt = Date.now();

  var durationFields = ['timeSpent', 'timeRemaining']
  durationFields.forEach(function(attr) {
    if(typeof doc[attr] === 'number') {
      doc[attr] = Duration.fromSeconds(doc[attr]);
    }
  });

  if(typeof doc.date === 'date') doc.date = Day.fromDate(doc.date);

});

DayLists.helpers({

  totalTime: function() {
    return this.timeRemaining + this.timeSpent;
  },

});

