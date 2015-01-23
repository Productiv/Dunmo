
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

  // returns totalTime in seconds
  totalTime: function() {
    var remaining = this.timeRemaining;
    var spent     = this.timeSpent;
    return new Duration(remaining.toSeconds() + spent.toSeconds());
  },

  spendTime: function(milliseconds) {
    this.incrementTimeSpent(milliseconds);
    this.incrementTimeRemaining(- milliseconds);
    this.owner().spendTime(milliseconds);
  },

  incrementTimeRemaining: function(milliseconds) {
    Tasks.update(this._id, { $inc: { timeRemaining: milliseconds }});
    var current = this.timeRemaining.toMilliseconds();
    return new Duration(current + milliseconds);
  },

  incrementTimeSpent: function(milliseconds) {
    Tasks.update(this._id, { $inc: { timeSpent: milliseconds }});
    var current = this.timeSpent.toMilliseconds();
    return new Duration(current + milliseconds);
  },

  // returns percentage between 0 and 100
  percentageCompleted: function() {
    var spent = this.timeSpent;
    spent     = spent.toMilliseconds();
    var total = this.totalTime().toMilliseconds();
    console.log('spent: ', spent);
    console.log('total: ', total);
    return Math.floor(spent / total * 100);
  },

  dueAtDisplay: function() {
    var due = this.dueAt;
    var today = new Date();

    return moment(due).from(today);
  },

  timeRemainingStr: function() {
    var remaining = new Duration(this.timeRemaining);
    console.log('this.timeRemaining: ', this.timeRemaining);
    return remaining.toAbbrevDetailStr()
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
    var first = R.cloneDeep(this);
    var second = R.cloneDeep(this);

    first.timeRemaining = remaining/1000;
    second.timeRemaining -= remaining/1000;

    return [first, second];
  },

  // input: duration of first task in output
  split: function(dur) {
    var first = R.cloneDeep(this);
    first.timeRemaining = dur;

    var second = R.cloneDeep(this);
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
	task.timeRemaining = task.timeRemaining || fromSeconds(30 * 60);
  task.ownerId       = task.ownerId       || Meteor.user()._id;
  task = fieldsToMilliseconds(task);
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
  console.log('item: ', item);
  item     = fieldsToDuration(item);
  return item;
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
