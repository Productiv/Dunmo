
/*
 * User
 * =========
 * name : String
 * email : String<unique>
 *
 */

Meteor.users.helpers({
  tasks: function() {
    return fetchTasks({ ownerId: this._id }, { sort: [[ 'dueAt', 'asc' ]] });
  },

  todos: function() {
    return fetchTasks({ownerId: this._id, isDone: false }, { sort: [[ 'dueAt', 'asc' ]] });
  },

  done: function() {
    return fetchTasks({ownerId: this._id, isDone: true }, { sort: [[ 'dueAt', 'asc' ]] });
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

  // TODO averageTimeSpent
  // get average free time (Duration object) based on past 7 days
  averageFreetime: function() {
    var lastWeek = this.lastWeeksDayLists();
    var avgLength;
    if (lastWeek.length === 0) {
      avgLength = 4*60*60; // number of seconds in 4 hours
    } else {
      var lenths = _.map(_.pluck(lastWeek, 'timeSpent'), function(dur) {
        console.log('dur: ', dur);
        return dur.toSeconds();
      });
      avgLength = _.avg(lengths);
    };

    avgLength = fromSeconds(avgLength);

    return avgLength;
  },

  todaysFreetime: function() {
    var user = this;
    var todaysFreetime = findOneDayList({ ownerId: user._id, date: Date.todayStart() });
    if(!todaysFreetime) {
      todaysFreetime = { ownerId: user._id, date: Date.todayStart(), timeRemaining: user.averageFreetime(), timeSpent: 0 };
      DayLists.insert(todaysFreetime);
    }
    return todaysFreetime;
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

  freetimes: function() {
    var averageFreetime = this.averageFreetime();

    // get all unfinished tasks
    var tasks = this.todos();

    // create all the dayLists from today until the furthest due date, sorted by date
    var todaysFreetime = this.todaysFreetime();
    var freetimes = [ todaysFreetime ];
    var startDate = Date.todayStart();
    if (tasks.length === 0) return freetimes;
    else var endDate = _.last(tasks).dueAt;

    var d = startDate;
    d.setDate(d.getDate() + 1);
    while(d <= endDate) {
      // task: grab existing dayLists from db
      freetimes.push({
        ownerId: this._id,
        date: new Date(d),
        timeRemaining: averageFreetime,
        timeSpent: 0
      });
      d.setDate(d.getDate() + 1);
    }
    return freetimes;
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

  incrementTimeRemaining: function(milliseconds) {
    var dayList = this.todaysList();
    DayLists.update(dayList._id, { $inc: { timeRemaining: milliseconds }});
    var current = dayList.timeRemaining.toMilliseconds();
    return new Duration(current + milliseconds);
  },

  incrementTimeSpent: function(milliseconds) {
    var dayList = this.todaysList();
    DayLists.update(dayList._id, { $inc: { timeSpent: milliseconds }});
    var current = dayList.timeSpent.toMilliseconds();
    return new Duration(current + milliseconds);
  },

  spendTime: function(milliseconds) {
    this.incrementTimeSpent(milliseconds);
    this.incrementTimeRemaining(- milliseconds);
  },

  sortedTasks: function() {
    return basicSort(this.tasks());
  },

  sortedTodos: function() {
    return basicSort(this.todos());
  },

  todoList: function() {
    var user      = this;
    var freetimes = user.freetimes();
    var todos     = user.sortedTodos();

    dayLists = user.generateTodoList(freetimes, todos, 'greedy');

    return dayLists;
  },

  generateTodoList: function(freetimes, todos, algorithm) {
    if(algorithm !== 'greedy') {
      console.log(algorithm, ' not implemented, use \'greedy\'');
      return [];
    }

    var user = this;

    var todoList  = lodash.map(freetimes, function(freetime) {
      var ret     = user.generateDayList(freetime, todos);
      var dayList = ret[0];
      todos       = ret[1];
      return dayList;
    });

    return todoList;
  },

  generateDayList: function(freetime, todos) {
    var dayList   = R.cloneDeep(freetime);
    var remaining = R.cloneDeep(dayList.timeRemaining);
    dayList.todos = [];

    console.log('remaining: ', remaining);

    while(remaining.toSeconds() > 0 && todos.length > 0) { // TODO: remaining.toTaskInterval() > 0 ?
      var ret   = this.appendTodos(dayList, todos, remaining);
      dayList   = ret[0];
      todos     = ret[1];
      remaining = ret[2];
      console.log('remaining: ', remaining);
    }

    return [ dayList, todos ];
  },

  appendTodos: function(dayList, todos, remaining) {
    if(todos.length === 0) return [ dayList, todos, remaining ];
    var todo = todos[0];
    todo.timeRemaining = new Duration(todo.timeRemaining);

    console.log('todo.timeRemaining: ', todo.timeRemaining);

    console.log('todo.timeRemaining.toSeconds(): ', todo.timeRemaining.toSeconds());

    // TODO: what about overdue items on the first day?
    // TODO: todo.timeRemaining.toTaskInterval() > remaining.toTaskInterval() ?
    if(todo.timeRemaining.toSeconds() > remaining.toSeconds()) {
      var ret   = todo.split(remaining);
      todo      = ret[0];
      dayList.todos.push(todo);
      todos[0]  = ret[1];
      remaining = new Duration(0);
      console.log('remaining: ', remaining);
    } else {
      dayList.todos.push(todo);
      todos.shift();
      remaining = fromSeconds(remaining.toSeconds() - todo.timeRemaining.toSeconds()); // TODO: Duration
    }

    console.log('remaining: ', remaining);

    if(remaining <= 0) {
      var ret = this.appendOverdue(dayList, todos);
      dayList = ret[0];
      todos   = ret[1];
    }

    // remaining = remaining || new Duration(0);

    return [ dayList, todos, remaining ];
  },

  // assume dayList is "full"
  appendOverdue: function(dayList, tasks) {
    var task = tasks[0];

    while(task && task.dueAt <= dayList.date) {
      task.overdue = true;
      dayList.tasks.push(task);
      task = tasks.shift();
    }

    return [ dayList, tasks ]
  }

});

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

