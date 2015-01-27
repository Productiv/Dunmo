
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

  doneTasks: function() {
    return fetchTasks({ownerId: this._id, isDone: true }, { sort: [[ 'dueAt', 'asc' ]] });
  },

  //task: tasksDoneOn(date), historical
  //task: tasksDueAt(date), based on due date

  lastWeeksDayLists: function() {
    return fetchDayLists({
      ownerId: this._id,
      date: {
        $gte: Date.sevenDaysAgoStart().getTime(),
        $lt: Date.todayStart().getTime()
      }
    });
  },

  // TODO averageTimeSpent
  // output: average free time (Duration object) based on past 7 days
  averageFreetime: function() {
    var lastWeek = this.lastWeeksDayLists();
    var avgLength;
    if (lastWeek.length === 0) {
      avgLength = 4*60*60*1000; // number of milliseconds in 4 hours
    } else {
      var lenths = _.map(_.pluck(lastWeek, 'timeSpent'), function(duration) {
        return duration.toMilliseconds();
      });
      avgLength = _.avg(lengths);
    };

    return new Duration(avgLength);
  },

  todaysFreetime: function() {
  },

  dayList: function(date) {
    var user = this;
    var dayList = findOneDayList({ ownerId: user._id, date: date });

    if(!dayList) {
      var id = DayLists.insert({
        ownerId: user._id,
        date: date,
        timeRemaining: user.averageFreetime(),
        timeSpent: new Duration(0)
      });
      dayList = findOneDayList(id);
    }

    return dayList;
  },

  freetimes: function() {
    var averageFreetime = this.averageFreetime();

    // get all unfinished tasks
    var todos = this.todos();

    // create all the dayLists from today until the furthest due date, sorted by date
    var startDate = Date.todayStart();
    var todaysFreetime = this.dayList(startDate);
    var freetimes = [ todaysFreetime ];
    if (todos.length === 0) return freetimes;
    else var endDate = _.last(todos).dueAt;

    var d = startDate;
    d.setDate(d.getDate() + 1);
    while(d <= endDate) {
      // TODO: grab existing dayLists from db
      freetimes.push({
        ownerId: this._id,
        date: new Date(d),
        timeRemaining: averageFreetime,
        timeSpent: Duration(0)
      });
      d.setDate(d.getDate() + 1);
    }

    return freetimes;
  },

  // returns timeRemaining on date as Duration
  timeRemaining: function(date, milliseconds) {
    if(typeof date === 'number') {
      milliseconds = date;
      date = null;
    }
    if(!date) date = Date.todayStart();
    var dayList = this.dayList(date);
    if(milliseconds) {
      DayLists.update(dayList._id, { $set: { timeRemaining: milliseconds }});
      return new duration(milliseconds);
    } else return dayList.timeRemaining;
  },

  // returns timeSpent on date as Duration
  timeSpent: function(date, milliseconds) {
    if(typeof date === 'number') {
      milliseconds = date;
      date = null;
    }
    if(!date) date = Date.todayStart();
    var dayList = this.dayList(date);
    if(milliseconds) {
      DayLists.update(dayList._id, { $set: { timeSpent: milliseconds }});
      return new duration(milliseconds);
    } else return dayList.timeSpent;
  },

  incrementTimeRemaining: function(date, milliseconds) {
    if(typeof date === 'number') {
      milliseconds = date;
      date = null;
    }
    if(!date) date = Date.todayStart();
    var dayList = this.dayList(date);
    DayLists.update(dayList._id, { $inc: { timeRemaining: milliseconds }});
    var current = dayList.timeRemaining.toMilliseconds();
    return new Duration(current + milliseconds);
  },

  incrementTimeSpent: function(date, milliseconds) {
    if(typeof date === 'number') {
      milliseconds = date;
      date = null;
    }
    if(!date) date = Date.todayStart();
    var dayList = this.dayList(date);
    DayLists.update(dayList._id, { $inc: { timeSpent: milliseconds }});
    var current = dayList.timeSpent.toMilliseconds();
    return new Duration(current + milliseconds);
  },

  spendTime: function(milliseconds) {
    this.incrementTimeSpent(Date.todayStart(), milliseconds);
    this.incrementTimeRemaining(Date.todayStart(), -milliseconds);
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

    console.log('todos: ', todos);

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
      console.log('freetime: ', freetime);
      console.log('todos: ', todos);
      if(todos.length > 0) {
        var ret     = user.generateDayList(freetime, todos);
        var dayList = ret[0];
        todos       = ret[1];
        console.log('dayList: ', dayList);
        return dayList;
      } else {
        return null;
      }
    });

    return lodash.compact(todoList);
  },

  generateDayList: function(freetime, todos) {
    var user      = this;
    var dayList   = R.cloneDeep(freetime);
    var remaining = R.cloneDeep(freetime.timeRemaining);
    dayList.todos = [];

    while(remaining.toSeconds() > 0 && todos.length > 0) { // TODO: remaining.toTaskInterval() > 0 ?
      var ret   = user.appendTodo(dayList, todos, remaining);
      dayList   = ret[0];
      todos     = ret[1];
      remaining = ret[2];
    }

    if(todos.length > 0) {
      var ret = this.appendOverdue(dayList, todos);
      dayList = ret[0];
      todos   = ret[1];
    }

    return [ dayList, todos ];
  },

  appendTodo: function(dayList, todos, remaining) {
    var todo = todos[0];

    console.log('todo.timeRemaining: ', todo.timeRemaining);
    console.log('todo.timeRemaining.toSeconds(): ', todo.timeRemaining.toSeconds());

    // TODO: what about overdue items on the first day?
    // TODO: todo.timeRemaining.toTaskInterval() > remaining.toTaskInterval() ?
    if(todo.timeRemaining.toSeconds() > remaining.toSeconds()) {
      var ret   = todo.split(remaining);
      todo      = ret[0];
      todos[0]  = ret[1];
      dayList.todos.push(todo);
      remaining = new Duration(0);
    } else {
      dayList.todos.push(todo);
      todos.shift();
      remaining = remaining.toMilliseconds() - todo.timeRemaining.toMilliseconds();
      remaining = new Duration(remaining); // TODO: Duration operations
    }

    return [ dayList, todos, remaining ];
  },

  // assume dayList is "full"
  appendOverdue: function(dayList, tasks) {
    var task = tasks[0];

    while(task && (task.dueAt <= dayList.date)) {
      task.overdue = true;
      dayList.tasks.push(task);
      tasks.shift();
      task = tasks[0];
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
  console.log('tasks: ', tasks);
  tasks = _.sortBy(tasks, 'timeRemaining', function(duration) {
    return duration.toSeconds();
  });

  tasks = _.sortBy(tasks, 'importance');

  tasks = _.sortBy(tasks, function(task) {
    var dueDate = new Date(task.dueAt);
    dueDate.setHours(0,0,0,0);
    return dueDate;
  });

  console.log('tasks: ', tasks);

  return tasks;
};

