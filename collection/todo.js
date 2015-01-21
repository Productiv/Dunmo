
/*
 * Todo
 * ====
 * ownerId : String
 * title : String
 * isDone : Bool
 * dueAt : Date
 * importance : Integer<1,2,3>
 * inputLength : Number<seconds>
 * remainingLength : Number<seconds>
 *
 */

Todos = new Mongo.Collection("todos");

Todos.helpers({
  owner: function() {
    return Meteor.users.find(this.ownerId);
  },

  // returns percentage between 0 and 100
  percentageCompleted: function() {
    return Math.floor((this.inputLength - this.remainingLength) / this.inputLength * 100);
  },

  daysUntilDue: function() {
    return this.dueAt.getDay() - Date.now().getDay();
  },

  secondsUntilDue: function() {
    return this.dueAt.getTime() - Date.now().getTime();
  },

  importanceBangs: function() {
    if (this.importance == 1) {
      return "!";
    } else if (this.importance == 2) {
      return "!!";
    } else {
      return "!!!";
    }
  },

  dueDateDisplay: function() {
    var due = this.dueAt;
    var today = new Date();

    return moment(due).from(today);
  },

  remainingLengthDisplay: function() {
    return secToTime(this.remainingLength);
  }
});

insertTodo = function (todo, callback) {
	todo.title = todo.title || "New todo";
	todo.isDone = todo.isDone || false;
	todo.dueAt = todo.dueAt || Date.todayEnd();
	todo.importance = todo.importance || 3;
	todo.inputLength = todo.inputLength || 1800;
	todo.remainingLength = todo.remainingLength || 1800;
  todo.ownerId = Meteor.user()._id;
	return Todos.insert(todo, callback);
};

updateTodo = function(_id, modifier, callback) {
  var keys = _.keys(modifier);
  if(!_.every(keys, isFirstChar('$'))) modifier = { $set: modifier };
  console.log(modifier);
  if(!modifier.$set) modifier.$set = { updatedAt: (new Date()).getTime() };
  else modifier.$set.updatedAt = (new Date()).getTime();
  Todos.update(_id, modifier, callback);
};

removeTodo = function(_id) {
  Todos.remove(_id);
};

findTodo = function(_id) {
  return Todos.findOne(_id);
};

findTodos = function(ids) {
  if(!ids) return;
  return Todos.find({ _id: { $in: ids } });
};

todosByIndex = function(selector) {
  if(!selector) selector = {};
  return Todos.find(selector, { sort: [[ 'index', 'asc' ]] });
};

allTodos = function() {
  return Todos.find();
};

userTodos = function(uid) {
  return Todos.find({ ownerId: uid });
};

userTodosByIndex = function(uid) {
  return Todos.find({ ownerId: uid }, { sort: [[ 'index', 'asc' ]] });
};

userTodosByIndexByNotDone = function(uid) {
  return Todos.find({ ownerId: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['index', 'asc']
    ]
  });
};

userTodosByIndexBy = function(uid, sortBy, sortOrder) {
  return Todos.find({ ownerId: uid }, {
    sort: [
      [sortBy, sortOrder],
      ['index', 'asc']
    ]
  });
};

userFillDays = function (userId) {
  var user = Meteor.users.findOne(userId);
  if (!user) return;
  var userTimeslots = user.timeslots();
  var userTodosSorted = userTodosSort(userId);
  var dayLists = [[]];
  var todoTime, remLength;

  userTimeslots.forEach(function (timeslot, index1) {
    // var timeslots = _.findWhere(userTimeslots, { 'date': new Date(Date.todayStart()) });
    var todayTimeslot = userTimeslots[index1];
    remLength = 0;
    userTodosSorted.forEach(function (todo, index2) {
      if ((todayTimeslot.inputLength -= (remLength = todo.remainingLength)) >= 0) {
        // Push this item to this day
        dayLists[index1].push(todo);
      } else if (todayTimeslot.inputLength < 0) {
        todayTimeslot.inputLength += remLength;
        return false;
      };
    });
  });
  return dayLists;
};

userTodosSort = function (userId) {
  var userTodos = Todos.find({ ownerId: userId }).fetch();

  return _.sortBy(_.sortBy(_.sortBy(userTodos, 'remainingLength'), 'importance'), function (todo) {
    var dueDate = new Date(todo.dueAt);
    dueDate.setHours(0,0,0,0);
    return dueDate;
  });
};

userTodosSort_wGroup = function (userId) {
  var userTodos = Todos.find({ ownerId: userId }).fetch();

  var dateGrouped = _.sortBy(
    _.pairs(
      _.groupBy(userTodos, function (todo) {
        var dueDate = new Date(todo.dueAt);
        dueDate.setHours(0,0,0,0);
        return dueDate;
      })
    ), function (pair) {
      return Date.parse(pair[0]);
    });

  var dateGroupedTimeSorted = _.map(dateGrouped, function(pair) {
    pair[1] = _.sortBy(pair[1], 'remainingLength').reverse();
    return pair;
  });

  var dateGroupedTimeSortedImportanceSorted = _.map(dateGroupedTimeSorted, function(pair) {
    pair[1] = _.sortBy(pair[1], 'importance').reverse();
    return pair;
  });

  return dateGroupedTimeSortedImportanceSorted;
};

userTodosOrdered = function (userId) {
	return Todos.find({ ownerId: userId }, { sort: [[ 'dueAt', 'asc' ], [ 'importance', 'desc' ], [ 'remainingLength', 'asc' ]] });
};

userTodosGroupByDate = function (userId) {
	return Todos.find({ ownerId: userId }, { sort: [[ 'dueAt', 'asc' ]] });
};

userTodosGroupByImportance = function (userId) {
	return userTodosGroupByDate(userId).find({ ownerId: userId }, { sort: [[ 'importance', 'desc' ]] });
};

userTodosGroupByRemainingLength = function (userId) {
	return userTodosGroupByImportance(userId).find({ ownerId: userId }, { sort: [[ 'remainingLength', 'asc' ]] })
};

