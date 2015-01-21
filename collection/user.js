
/*
 * User
 * =========
 * name : String
 * email : String<unique>
 *
 */

Meteor.users.helpers({
  tasks: function() {
    return Tasks.find({ ownerId: this._id });
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
    var todaysDaylist = DayLists.findOne({ ownerId: this._id, date: Date.todayStart() });
    if(!todaysDayList) {
      todaysDayList = { ownerId: user._id, date: Date.todayStart(), timeRemaining: this.averageFreetime(), timeSpent: 0 };
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

    for(var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      // task: grab existing dayLists from db
      dayLists.push({
        ownerId: this._id,
        date: d,
        timeRemaining: averageFreetime,
        timeSpent: 0
      });
    }

    return dayLists;
  }, // end of user.dayLists()

  // if newTime is provided, updates, otherwise it doesn't change
  // returns timeRemaining today
  timeRemaining: function(newTime) {
    var dayList = this.todaysList();
    if(newTime) Daylists.update(dayList._id, { $set: { timeRemaining: newTime }});
    return newTime || dayList.timeRemaining;
  },

  // if newTime is provided, updates, otherwise it doesn't change
  // returns timeSpent today
  timeSpent: function(newTime) {
    var dayList = this.todaysList();
    if(newTime) Daylists.update(dayList._id, { $set: { timeSpent: newTime }});
    return newTime || dayList.timeSpent;
  },

  incrementTimeRemaining: function(seconds) {
    var dayList = this.todaysList();
    Daylists.update(dayList._id, { $inc: { timeRemaining: seconds }});
    return dayList.timeRemaining + seconds;
  },

  incrementTimeSpent: function(seconds) {
    var dayList = this.todaysList();
    Daylists.update(dayList._id, { $inc: { timeSpent: seconds }});
    return dayList.timeSpent + seconds;
  },

  sortedTasks: function() {
    return _.sortBy(_.sortBy(_.sortBy(this.tasks(), 'timeRemaining'), 'importance'), function(task) {
      var dueDate = new Date(task.dueAt);
      dueDate.setHours(0,0,0,0);
      return dueDate;
    });
  },

  fillDays: function() {
    var user = this;
    var userTimeslots = user.dayLists();
    var userTasksSorted = user.sortedTasks();
    var dayLists = [[]];
    var taskTime, remLength;

    userTimeslots.forEach(function (timeslot, index1) {
      // var timeslots = _.findWhere(userTimeslots, { 'date': new Date(Date.todayStart()) });
      var todayTimeslot = userTimeslots[index1];
      remLength = 0;
      userTasksSorted.forEach(function (task, index2) {
        if ((todayTimeslot.timeSpent -= (remLength = task.timeRemaining)) >= 0) {
          // Push this item to this day
          dayLists[index1].push(task);
        } else if (todayTimeslot.timeSpent < 0) {
          todayTimeslot.timeSpent += remLength;
          return false;
        };
      });
    });
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

