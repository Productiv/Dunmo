
/*
 * User
 * =========
 * name : String
 * email : String<unique>
 *
 */

Meteor.users.helpers({
  tasks: function() {
    return Tasks.find({ ownerId: this._id }).fetch();
  },

  todos: function() {
    return Tasks.find({ownerId: this._id, isDone: false }, { sort: [[ 'dueAt', 'asc' ]] }).fetch();
  },

  done: function() {
    return Tasks.find({ownerId: this._id, isDone: true }, { sort: [[ 'dueAt', 'asc' ]] }).fetch();
  },

  //task: tasksDoneOn(date), historical
  //task: tasksDueAt(date), based on due date

  lastWeeksDayLists: function() {
    return lastWeek = fetchDayLists({
      ownerId: this._id,
      date: {
        $gte: Date.sevenDaysAgoStart().getTime(),
        $lt: Date.todayStart().getTime()
      }
    });
  },

  // get average free time based on past 7 days
  averageFreetime: function() {
    var lastWeek = this.lastWeeksDayLists();
    var avgLength;
    if (lastWeek.length === 0) {
      avgLength = 4*60*60; // number of seconds in 4 hours
    } else {
      var lenths = _.map(_.pluck(lastWeek, 'timeSpent'), function(dur) {
        return dur.lengthInMs;
      });
      avgLength = _.avg(lengths);
    };

    avgLength = fromSeconds(avgLength);

    return avgLength;
  },

  todaysList: function() {
    var user = this;
    var todaysDayList = findOneDayList({ ownerId: user._id, date: Date.todayStart() });
    if(!todaysDayList) {
      todaysDayList = { ownerId: user._id, date: Date.todayStart(), timeRemaining: user.averageFreetime(), timeSpent: 0 };
      DayLists.insert(todaysDayList);
    }
    return todaysDayList;
  },

  newDayList: function(date) {
    var id = DayLists.insert({
      ownerId: this._id,
      date: date,
      timeRemaining: this.averageFreetime(),
      timeSpent: 0
    });

    return findOneDayList(id);
  },

  dayList: function(date) {
    var list = findOneDayList({ownerId: this._id, date: date});
    if(!list) list = this.newDayList(date);
    return list;
  },

  dayLists: function() {
    var averageFreetime = this.averageFreetime();

    // get all unfinished tasks
    var tasks = this.todos();

    // create all the dayLists from today until the furthest due date, sorted by date
    var todaysDayList = this.todaysList();
    var dayLists = [ todaysDayList ];
    var startDate = Date.todayStart();
    if (tasks.length === 0) return dayLists;
    else var endDate = _.last(tasks).dueAt;

    var d = startDate;
    d.setDate(d.getDate() + 1);
    while(d <= endDate) {
      // task: grab existing dayLists from db
      dayLists.push({
        ownerId: this._id,
        date: new Date(d),
        timeRemaining: averageFreetime,
        timeSpent: 0
      });
      d.setDate(d.getDate() + 1);
    }
    return dayLists;
  }, // end of user.dayLists()

  // if newTime is provided, updates, otherwise it doesn't change
  // returns timeRemaining today as Duration
  timeRemaining: function(date, newTime) {
    var dayList = this.dayList(date);
    if(newTime) DayLists.update(dayList._id, { $set: { timeRemaining: newTime }});
    return fromMilliseconds(newTime) || dayList.timeRemaining;
  },

  // if newTime is provided, updates, otherwise it doesn't change
  // returns timeSpent today
  timeSpent: function(date, newTime) {
    var dayList = this.dayList(date);
    if(newTime) DayLists.update(dayList._id, { $set: { timeSpent: newTime }});
    return newTime || dayList.timeSpent;
  },

  incrementTimeRemaining: function(seconds) {
    var dayList = this.todaysList();
    DayLists.update(dayList._id, { $inc: { timeRemaining: seconds }});
    return dayList.timeRemaining + seconds;
  },

  incrementTimeSpent: function(seconds) {
    var dayList = this.todaysList();
    DayLists.update(dayList._id, { $inc: { timeSpent: seconds }});
    return dayList.timeSpent + seconds;
  },

  spendTime: function(time) {
    this.incrementTimeSpent(time);
    this.incrementTimeRemaining(- time);
  },

  sortedTasks: function() {
    return basicSort(this.tasks());
  },

  sortedTodos: function() {
    return basicSort(this.todos());
  },

  filledDayLists: function() {
    var user = this;
    var dayLists = user.dayLists();
    var todos = user.sortedTodos();
    var timeRemaining;
    var splitTasks;
    // var t;
    var overdueTasks = {};

    dayLists.forEach(function(dayList) {
      dayList.todos = [];
      timeRemaining = dayList.timeRemaining.lengthInMs / 1000;

      var t = todos;
      t.forEach(function(todo, index) {
        if (todo.dueAt <= dayList.date) {  // if overdue
          if (timeRemaining - todo.timeRemaining >= 0) {
            console.log("I'm inside the if (tR-todo.tR>=0)");
            // normal
            dayList.todos.push(todo);
            _.remove(todos, { '_id': todo._id });
            timeRemaining -= todo.timeRemaining;
          } else if (timeRemaining > 0) {
            console.log("I'm inside the if (tR<0)");
            // fill first chunk, then overdue remainder
            splitTasks = todo.splitTaskBySec(timeRemaining);
            dayList.todos.push(splitTasks[0]);
            timeRemaining -= todo.timeRemaining;
            // push overdue remainder
            todos.splice(index,1);
            splitTasks[1].isOverdue = true;
            if(overdueTasks[splitTasks[1]._id]) {
              overdueTasks[splitTasks[1]._id].timeRemaining += splitTasks[1].timeRemaining;
            } else {
              splitTasks[1].overdueTasks = true;
              overdueTasks[splitTasks[1]._id] = splitTasks[1];
            };
            dayList.todos.push(splitTasks[1]);
          } else {
            console.log("I'm inside the ELSE");
            // overdue all (remaining)
            todos.splice(index,1);
            todo.isOverdue = true;
            if(overdueTasks[todo._id]) {
              overdueTasks[todo._id].timeRemaining += todo.timeRemaining;
            } else {
              todo.overdueTasks = true;
              overdueTasks[todo._id] = todo;
            };
            dayList.todos.push(todo);
          };
        } else {
          console.log("I'm not gonna panic, I swear!");
          if (timeRemaining - todo.timeRemaining >= 0) {
            // normal
            dayList.todos.push(todo);
            _.remove(todos, { '_id': todo._id });
            timeRemaining -= todo.timeRemaining;
          } else if (timeRemaining > 0) {
            // fill first chunk normally
            splitTasks = todo.splitTaskBySec(timeRemaining);
            dayList.todos.push(splitTasks[0]);
            timeRemaining -= todo.timeRemaining;
            todos[index] = splitTasks[1];
          };
        };
      });
    });

    dayLists = _.select(dayLists, function(list) {
      return list.todos && list.todos.length > 0;
    });
    
    dayLists = lodash.compact(dayLists);
    overdueTasks = _.sortBy(_.values(overdueTasks), 'dueAt');

    console.log("overdueTasks: ", overdueTasks);
    console.log("dayLists", dayLists);
    overdueTasks.forEach(function (todo) {
      console.log("todo (in loop): ", todo);
      var dueAt = todo.dueAt;
      console.log("dueAt: ", dueAt);
      dueAt.setHours(0,0,0,0);
      console.log("dueAt: ", dueAt);
      console.log("dayLists: ", dayLists);
      dayLists = dayLists.map(function(list) {
        if(list.date === dueAt) list.todos.push(todo);
        return list;
      });
    });
    console.log("dayLists: ", dayLists);
    console.log("overdueTasks: ", overdueTasks);

    return dayLists;
  }

});


userTasksSort_wGroup = function (userId) {
  var userTasks = Tasks.find({ ownerId: userId }).fetch();

  var dateGrouped = _.sortBy(
    _.pairs(
      _.groupBy(userTasks, function (task) {
        var dueDate = new Date(task.dueAt);
        dueDate.setHours(0,0,0,0);
        return dueDate;
      })
    ), function (pair) {
      return Date.parse(pair[0]);
    });

  var dateGroupedTimeSorted = _.map(dateGrouped, function(pair) {
    pair[1] = _.sortBy(pair[1], 'timeRemaining').reverse();
    return pair;
  });

  var dateGroupedTimeSortedImportanceSorted = _.map(dateGroupedTimeSorted, function(pair) {
    pair[1] = _.sortBy(pair[1], 'importance').reverse();
    return pair;
  });

  return dateGroupedTimeSortedImportanceSorted;
};

userTasksOrdered = function (userId) {
	return Tasks.find({ ownerId: userId }, { sort: [[ 'dueAt', 'asc' ], [ 'importance', 'desc' ], [ 'timeRemaining', 'asc' ]] });
};

userTasksGroupByDate = function (userId) {
	return Tasks.find({ ownerId: userId }, { sort: [[ 'dueAt', 'asc' ]] });
};

userTasksGroupByImportance = function (userId) {
	return userTasksGroupByDate(userId).find({ ownerId: userId }, { sort: [[ 'importance', 'desc' ]] });
};

userTasksGroupByRemainingLength = function (userId) {
	return userTasksGroupByImportance(userId).find({ ownerId: userId }, { sort: [[ 'timeRemaining', 'asc' ]] })
};

userTasks = function(uid) {
  return Tasks.find({ ownerId: uid });
};

userTasksByIndex = function(uid) {
  return tasksByIndex({ ownerId: uid });
};

userTasksByIndexByNotDone = function(uid) {
  return Tasks.find({ ownerId: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['index', 'asc']
    ]
  });
};

userTasksByIndexBy = function(uid, sortBy, sortOrder) {
  return Tasks.find({ ownerId: uid }, {
    sort: [
      [sortBy, sortOrder],
      ['index', 'asc']
    ]
  });
};

// input: collection of tasks
// return: input collection, sorted by due, importance, and length, in that order
basicSort = function(tasks) {
  return _.sortBy(_.sortBy(_.sortBy(tasks, 'timeRemaining'), 'importance'), function(task) {
    var dueDate = new Date(task.dueAt);
    dueDate.setHours(0,0,0,0);
    return dueDate;
  });
};

