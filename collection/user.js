
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
    return lastWeek = DayLists.find({
      ownerId: this._id,
      date: {
        $gte: Date.sevenDaysAgoStart().getTime(),
        $lt: Date.todayStart().getTime()
      }
    }).fetch();
  },

  // get average free time based on past 7 days
  averageFreetime: function() {
    var lastWeek = this.lastWeeksDayLists();
    var avgLength;
    if (lastWeek.length === 0) {
      avgLength = 4*60*60; // number of seconds in 4 hours
    } else {
      var lenths = _.pluck(lastWeek, 'inputLength');
      avgLength = _.avg(lengths);
    };

    return avgLength;
  },

  todaysList: function() {
    var user = this;
    var todaysDayList = DayLists.findOne({ ownerId: user._id, date: Date.todayStart() });
    if(!todaysDayList) {
      todaysDayList = { ownerId: user._id, date: Date.todayStart(), timeRemaining: user.averageFreetime(), timeSpent: 0 };
      DayLists.insert(todaysDayList);
    }
    return todaysDayList;
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
  // returns timeRemaining today
  timeRemaining: function(newTime) {
    var dayList = this.todaysList();
    if(newTime) DayLists.update(dayList._id, { $set: { timeRemaining: newTime }});
    return newTime || dayList.timeRemaining;
  },

  // if newTime is provided, updates, otherwise it doesn't change
  // returns timeSpent today
  timeSpent: function(newTime) {
    var dayList = this.todaysList();
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

    dayLists.forEach(function(dayList) {
      dayList.todos = [];
      timeRemaining = dayList.timeRemaining;
      var t = todos;
      t.forEach(function(todo, index) {
        if(timeRemaining - todo.timeRemaining >= 0) {
          dayList.todos.push(todo);
          _.remove(todos, { '_id': todo._id });
          timeRemaining -= todo.timeRemaining;
        }
      });
    });

    console.log(dayLists);

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

