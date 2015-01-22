
/*
 * DayList
 * =======
 * ownerId       : String
 * date          : Day
 * timeSpent     : Duration
 * timeRemaining : Duration
 *
 */

var durationFields = ['timeSpent', 'timeRemaining']

DayLists = new Mongo.Collection('dayLists');

DayLists.before.insert(function(userId, doc) {
  doc.createdAt = Date.now();

  durationFields.forEach(function(attr) {
    if(typeof doc[attr] === 'object') {
      doc[attr] = doc[attr].lengthInMs();
      console.log(attr + ': ', doc[attr]);
    }
  });

  //TODO: if(typeof doc.date === 'date') doc.date = Day.fromDate(doc.date);

  return doc;
});

DayLists.helpers({
  totalTime: function() {
    return this.timeRemaining + this.timeSpent;
  }
});

fetchDayLists = function(selector, options) {
  var lists = _.clone(DayLists.find(selector, options).fetch(), true);
  lists = _.map(lists, function(doc) {
    durationFields.forEach(function(attr) {
      if(typeof doc[attr] === 'number') {
        doc[attr] = fromSeconds(doc[attr]);
      }
    });
    return doc;
  });
  return lists;
};

findOneDayList = function(id) {
  var doc = _.clone(DayLists.findOne(id), true);
  durationFields.forEach(function(attr) {
    if(typeof doc[attr] === 'number') {
      doc[attr] = fromSeconds(doc[attr]);
    }
  });
  console.log('doc after: ', doc);
  return doc;
};
