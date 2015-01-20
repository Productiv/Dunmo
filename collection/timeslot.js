
/*
 * Timeslots
 * =========
 * ownerId       : String
 * date          : Date<year, month, day>
 * timeSpent     : Number<seconds>
 * timeRemaining : Number<seconds>
 *
 */

Timeslots = new Mongo.Collection('timeslots');

Timeslots.helpers({
  totalTime: function() {
    return this.timeRemaining + this.timeSpent;
  }
});

