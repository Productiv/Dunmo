
/*
 * Task
 * ====
 * ownerId       : String
 * title         : String
 * isDone        : Bool
 * dueAt         : Date
 * importance    : Integer<1,2,3>
 * timeSpent     : Duration
 * timeRemaining : Duration
 *
 */

Tasks = new Mongo.Collection("tasks");

Tasks.helpers({

  owner: function() {
    return Meteor.users.findOne(this.ownerId);
  },

  totalTime: function() {
    return this.timeRemaining + this.timeSpent;
  },

  spendTime: function(time) {
    this.incrementTimeSpent(time);
    this.incrementTimeRemaining(- time);
    this.owner().spendTime(time);
  },

  incrementTimeRemaining: function(seconds) {
    Tasks.update(this._id, { $inc: { timeRemaining: seconds }});
    return this.timeRemaining + seconds;
  },

  incrementTimeSpent: function(seconds) {
    Tasks.update(this._id, { $inc: { timeSpent: seconds }});
    return this.timeSpent + seconds;
  },

  // returns percentage between 0 and 100
  percentageCompleted: function() {
    return Math.floor((this.timeSpent) / this.totalTime() * 100);
  },

  importanceBangs: function() {
    if (this.importance === 1) {
      return "!";
    } else if (this.importance == 2) {
      return "!!";
    } else {
      return "!!!";
    }
  },

  dueAtDisplay: function() {
    var due = this.dueAt;
    var today = new Date();

    return moment(due).from(today);
  },

  timeRemainingStr: function() {
    return fromSeconds(this.timeRemaining).toPrettyStr()
  },

  markDone: function(done) {
    if(done === undefined) done = true;
    Tasks.update(this._id, { $set: { isDone: done } });
  },

  splitTaskBySec: function(remaining) {
    return this.splitTaskByMilliSec(remaining*1000);
  },

  splitTaskByMilliSec: function(remaining) {
    var secsRemaining = remaining/1000;
    var first = _.clone(this, true);
    var second = _.clone(this, true);

    first.timeRemaining = remaining/1000;
    second.timeRemaining -= remaining/1000;

    return [first, second];
  }

});

insertTask = function (task, callback) {
	task.title  = task.title  || "New task";
	task.isDone = task.isDone || false;
	task.dueAt  = task.dueAt  || Date.todayEnd();
	task.importance    = task.importance    || 3;
	task.timeSpent     = task.timeSpent     || 0;
	task.timeRemaining = task.timeRemaining || 1800;
  task.ownerId       = task.ownerId       || Meteor.user()._id;
	return Tasks.insert(task, callback);
};

updateTask = function(_id, modifier, callback) {
  var keys = _.keys(modifier);
  if(!_.some(keys, isFirstChar('$'))) modifier = { $set: modifier };
  if(!modifier.$set) modifier.$set = { updatedAt: (new Date()).getTime() };
  else modifier.$set.updatedAt = (new Date()).getTime();
  Tasks.update(_id, modifier, callback);
};

removeTask = function(_id) {
  Tasks.remove(_id);
};

findTask = function(_id) {
  return Tasks.findOne(_id);
};

findTasks = function(ids) {
  if(!ids) return;
  return Tasks.find({ _id: { $in: ids } });
};

tasksByIndex = function(selector) {
  if(!selector) selector = {};
  return Tasks.find(selector, { sort: [[ 'index', 'asc' ]] });
};

allTasks = function() {
  return Tasks.find();
};
