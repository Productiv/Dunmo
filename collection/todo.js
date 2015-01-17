
/*
 * Todo
 * ====
 * ownerId : String
 * title : String
 * dueAt : Date
 * importance : Integer<1,2,3>
 * totalLength : Number<seconds>
 * completedLength : Number<seconds>
 *
 */

Todos = new Mongo.Collection("todos");

Todos.helpers({
  owner: function() {
    return Meteor.users.find(this.ownerId);
  },

  // returns percentage between 0 and 1
  percentageCompleted: function() {
    return this.completedLength / this.totalLength;
  },

  daysUntilDue: function() {
    return this.dueAt.getDay() - Date.now().getDay();
  },

  secondsUntilDue: function() {
    return this.dueAt.getTime() - Date.now().getTime();
  }

});

