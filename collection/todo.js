
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

  remainingLengthDisplay: function() {
    var minutes = this.remainingLength / 60;
    var hours = 0;
    var days = 0;
    var str = "";

    while (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    };

    if (hours < 10) {
      str += "0"+hours.toString() + ":";
      if (minutes < 10) { str += "0"; };
      str += minutes.toString();

    } else if (hours > 24) {

      while (hours >= 24) {
        hours -= 24;
        days += 1;
      };

      str += days.toString() + ":";
      if (hours < 10) { str += "0"; };
      str += hours.toString() + ":";
      if (minutes < 10) { str += "0"; };
      str += minutes.toString();

    } else {

      str += hours.toString() + ":";
      if (minutes < 10) { str += "0"; };
      str += minutes.toString();
    };
    return str;
  }

});

insertTodo = function (todo, callback) {
	console.log(todo);
	todo.title = todo.title || "New todo";
	todo.isDone = todo.isDone || false;
	todo.dueAt = todo.dueAt || Date.todayEnd();
	todo.importance = todo.importance || 3;
	todo.inputLength = todo.inputLength || 1800;
	todo.remainingLength = todo.remainingLength || 1800;
    todo.ownerId = Meteor.user()._id;
	console.log(todo);
	return Todos.insert(todo, callback);
};

updateTodo = function(_id, modifier, callback) {
  var keys = _.keys(modifier);
  if(!_.every(keys, isFirstChar('$'))) modifier = { $set: modifier };
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
  console.log(userTimeslots);
  console.log(userTodosSorted);
  var dayLists = [[]];
  var todoTime, remLength;

  userTimeslots.forEach(function (timeslot, index1) {
    console.log("index1: ",index1);
    // var timeslots = _.findWhere(userTimeslots, { 'date': new Date(Date.todayStart()) });
    var todayTimeslot = userTimeslots[index1];
    console.log("RAWR",todayTimeslot);
    remLength = 0;
    userTodosSorted.forEach(function (todo, index2) {
      console.log("index2: ",index2);
      console.log("todo: ",todo,"todo.remainingLength: ",todo.remainingLength);
      if ((todayTimeslot.inputLength -= (remLength = todo.remainingLength)) >= 0) {
        // Push this item to this day
        dayLists[index1].push(todo);
        console.log(dayLists);
      } else if (todayTimeslot.inputLength < 0) {
        todayTimeslot.inputLength += remLength;
        return false;
      };
    });
  });
  console.log("I'm drunk!!!!!!! :D",dayLists);
  return dayLists;
}

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
	console.log(userTodos(userId).fetch());
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
