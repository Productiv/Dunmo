
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

DayLists.helpers({
  totalTime: function() {
    return this.timeRemaining + this.timeSpent;
  }
});

