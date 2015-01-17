
/*
 * Timeslots
 * =========
 * ownerId : String
 * date : Date<nearest day>
 * totalLength : Number<seconds>
 * secondsWorked : Number<seconds>
 *
 */

Timeslots = new Mongo.Collection('timeslots');

Timeslots.helpers({
  secondsRemaining: function() {
    return this.totalLength - this.secondsWorked;
  }
});

