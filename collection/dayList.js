
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
  doc = fieldsToMilliseconds(doc);
  //TODO: if(typeof doc.date === 'date') doc.date = Day.fromDate(doc.date);
  return doc;
});

DayLists.helpers({
  owner: function() {
    return Meteor.users.findOne(this.ownerId);
  },

  totalTime: function() {
    return this.timeRemaining.toMilliseconds() + this.timeSpent.toMilliseconds();
  },

  setTimeRemaining: function(milliseconds) {
    Tasks.update(this._id, { $set: { timeRemaining: milliseconds }});
  },

  setTimeSpent: function(milliseconds) {
    Tasks.update(this._id, { $set: { timeSpent: milliseconds }});
  },

  fetchTodos: function() {
    var user = this.owner();
    var date = this.date;
    return user.todoList(date);
  }
});

fetchDayLists = function(selector, options) {
  var ary = DayLists.find(selector, options).fetch();
  return lodash.map(ary, fieldsToDuration);
};

findOneDayList = function(selector) {
  var doc  = DayLists.findOne(selector);
  doc      = fieldsToDuration(doc);
  return doc;
};
