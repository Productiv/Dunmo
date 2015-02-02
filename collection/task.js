
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

Tasks.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
  doc = fieldsToMilliseconds(doc);
  //TODO: if(typeof doc.date === 'date') doc.date = Day.fromDate(doc.date);
  return doc;
});

Tasks.helpers({

  owner: function() {
    return Meteor.users.findOne(this.ownerId);
  },

  // returns totalTime
  totalTime: function() {
    var remaining = this.timeRemaining.toMilliseconds();
    var spent     = this.timeSpent.toMilliseconds();
    return new Duration(remaining + spent);
  },

  spendTime: function(milliseconds) {
    this.incrementTimeSpent(milliseconds);
    this.incrementTimeRemaining(- milliseconds);
    this.owner().spendTime(milliseconds);
  },

  incrementTimeRemaining: function(milliseconds) {
    var current = this.timeRemaining.toMilliseconds();
    console.log("this.timeRemaining.toMilliseconds(): ", current);
    if (current + milliseconds <= 0) {
      this.setTimeRemaining(0);
      this.markDone(true);
      return new Duration(0);
    } else {
      Tasks.update(this._id, { $inc: { timeRemaining: milliseconds }});
      return new Duration(current + milliseconds);
    }
  },

  incrementTimeSpent: function(milliseconds) {
    var current = this.timeSpent.toMilliseconds();
    if (current + milliseconds <= 0) {
      this.setTimeSpent(0);
      return new Duration(0);
    }
    Tasks.update(this._id, { $inc: { timeSpent: milliseconds }});
    return new Duration(current + milliseconds);
  },

  setTimeRemaining: function(milliseconds, callback) {
    Tasks.update(this._id, { $set: { timeRemaining: milliseconds }}, callback);
  },

  setTimeSpent: function(milliseconds) {
    Tasks.update(this._id, { $set: { timeSpent: milliseconds }});
  },

  // returns percentage between 0 and 100
  percentageCompleted: function() {
    var spent = this.timeSpent.toMilliseconds();;
    var total = this.totalTime().toMilliseconds();
    return Math.floor(spent / total * 100);
  },

  dueAtDisplay: function() {
    var today = Date.now();
    return moment(this.dueAt).from(today);
  },

  timeRemainingStr: function() {
    return this.timeRemaining.toAbbrevDetailStr();
  },

  markDone: function(done, callback) {
    if(done === undefined) done = true;
    Tasks.update(this._id, { $set: { isDone: done } }, callback);
  },

  // input:  duration of first task in output
  // output: pair of tasks
  split: function(duration) {
    if(duration.toMilliseconds() > this.timeRemaining.toMilliseconds()) {
      return [ null, R.cloneDeep(this) ];
    }

    var firstTask = R.cloneDeep(this);
    firstTask.timeRemaining = new Duration(duration);
    // firstTask.id = this._id;
    // firstTask._id = new Mongo.ObjectID();

    var secondTask = R.cloneDeep(this);
    var remaining  = this.timeRemaining.toMilliseconds() - duration.toMilliseconds();
    secondTask.timeRemaining =  new Duration(remaining);
    // secondTask.id = this._id;
    // secondTask._id = new Mongo.ObjectID();

    // TODO: set timeSpent also

    return [ firstTask, secondTask ];
  }

});

Tasks._findOne = Tasks.findOne;

Tasks.findOne = function(selector, options) {
  var item = Tasks._findOne(selector, options);
  item     = fieldsToDuration(item);
  return item;
};

insertTask = function (task, callback) {
  task.createdAt     = new Date();
	task.title         = task.title         || "New task";
	task.isDone        = task.isDone        || false;
	task.dueAt         = task.dueAt         || Date.todayEnd();
	task.importance    = task.importance    || 3;
	task.timeSpent     = task.timeSpent     || new Duration(0);
	task.timeRemaining = task.timeRemaining || fromSeconds(30 * 60);
  task.ownerId       = task.ownerId       || Meteor.userId();
  return Tasks.insert(task, callback);
};

updateTask = function(_id, modifier, callback) {
  var keys = _.keys(modifier);

  if(!_.some(keys, isFirstChar('$'))) {
    modifier = fieldsToMilliseconds(modifier);
    modifier = { $set: modifier };
  }
  if(!modifier.$set) modifier.$set = { updatedAt: new Date() };
  else modifier.$set.updatedAt = new Date();
  Tasks.update(_id, modifier, callback);
};

fetchTasks = function(selector, options) {
  var ary = Tasks.find(selector, options).fetch();
  return lodash.map(ary, fieldsToDuration);
};

findTask = function(id) {
  return Tasks.findOne({ _id: id});
}

findTasks = function(ids) {
  if(!ids) return;
  return Tasks.find({ _id: { $in: ids } });
};

tasksByIndex = function(selector) {
  if(!selector) selector = {};
  return Tasks.find(selector, { sort: [[ 'index', 'asc' ]] });
};

// input: collection of tasks
// return: input collection, sorted by due, importance, and length, in that order
basicSort = function(tasks) {
  tasks = _.sortBy(tasks, 'timeRemaining', function(duration) {
    return duration.toSeconds();
  });

  tasks = _.sortBy(tasks, 'importance');

  tasks = _.sortBy(tasks, function(task) {
    var dueDate = new Date(task.dueAt);
    dueDate.setHours(0,0,0,0);
    return dueDate;
  });

  return tasks;
};
