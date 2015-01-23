
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

DayLists.before.insert(function(userId, doc) {
  doc.createdAt = Date.now();
  doc = fieldsToMilliseconds(doc);
  //TODO: if(typeof doc.date === 'date') doc.date = Day.fromDate(doc.date);
  return doc;
});

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

  dueAtDisplay: function() {
    var due = this.dueAt;
    var today = new Date();

    return moment(due).from(today);
  },

  timeRemainingStr: function() {
    return fromSeconds(this.timeRemaining).toAbbrevDetailStr()
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
    var first = lodash.cloneDeep(this);
    var second = lodash.cloneDeep(this);

    first.timeRemaining = remaining/1000;
    second.timeRemaining -= remaining/1000;

    return [first, second];
  },

  // input: duration of first task in output
  split: function(dur) {
    var first = lodash.clone(this);
    first.timeRemaining = dur;

    var second = lodash.clone(this);
    second.timeRemaining = fromSeconds(this.timeRemaining.toSeconds() - dur.toSeconds()); // TODO duration.diff

    return [ first, second ];
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

fetchTasks = function(selector, options) {
  var ary = Tasks.find(selector, options).fetch();
  return lodash.map(ary, fieldsToDuration);
};

findOneTask = function(selector) {
  var item = Tasks.findOne(selector);
  doc      = fieldsToDuration(doc);
  return doc;
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
