
/*
 * Timeslots
 * =========
 * ownerId : String
 * date : Date<year, month, day>
 * inputLength : Number<seconds>
 * actualLength : Number<seconds>
 *
 */

Timeslots = new Mongo.Collection('timeslots');

Timeslots.helpers({
  secondsRemaining: function() {
    return this.inputLength - this.actualLength;
  }
});

