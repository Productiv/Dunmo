
/*
 * User
 * =========
 * name : String
 * email : String<unique>
 *
 */

Meteor.users.helpers({
  todos: function() {
    return Todos.find({ ownerId: this._id });
  },

  //TODO: todosDoneOn(date), historical
  //TODO: todosDueAt(date), based on due date

  // get average free time based on past 7 days
  averageFreetime: function() {
    var lastWeek = Timeslots.find({
      ownerId: this._id,
      date: {
        $gte: Date.sevenDaysAgoStart().getTime(),
        $lt: Date.todayStart().getTime()
      }
    });

    var avgLength;
    if (lastWeek.length === 0) {
      avgLength = 4*60*60; // number of seconds in 4 hours
    } else {
      var lenths = _.pluck(lastWeek, 'inputLength');
      avgLength = _.avg(lengths);
    };

    return avgLength;
  },

  timeslots: function() {
    var user = this;
    var avgFreetime = user.averageFreetime();

    // get all the todos from today until infinity, sorted by date
    // var todos = Todos.find({ ownerId: user._id, dueAt: { $gte: Date.todayStart().getTime() } },
    //                        {
    //                          sort: [[ 'dueAt', 'asc' ]]
    //                        }).fetch();

    // get all unfinished todos
    var todos = Todos.find({ ownerId: user._id, isDone: false }, { sort: [[ 'dueAt', 'asc' ]] }).fetch();

    // create all the timeslots from today until the furthest due date, sorted by date
    var todaysTimeslot = Timeslots.findOne({ ownerId: user._id, date: Date.todayStart() });
    if(!todaysTimeslot) {
      todaysTimeslot = { ownerId: user._id, date: Date.todayStart(), timeRemaining: avgFreetime, timeSpent: 0 };
      Timeslots.insert(todaysTimeslot);
    }
    var timeslots = [ todaysTimeslot ];
    var startDate = Date.todayStart();
    if (todos.length === 0) return timeslots;
    else var endDate = _.last(todos).dueAt;

    for(var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      timeslots.push({
        ownerId: user._id,
        date: d,
        timeRemaining: avgFreetime,
        timeSpent: 0
      });
    }

    return timeslots;
  }, // end of user.timeslots()

  todaysTimeslot: function() {
    return Timeslots.findOne({ ownerId: this._id, date: Date.todayStart() });
  },

  // if newTime is provided, updates, otherwise it doesn't change
  // returns timeRemaining today
  timeRemaining: function(newTime) {
    var slot = this.todaysTimeslot();
    if(newTime) Timeslots.update(slot._id, { $set: { timeRemaining: newTime }});
    return newTime || slot.timeRemaining;
  },

  // if newTime is provided, updates, otherwise it doesn't change
  // returns timeSpent today
  timeSpent: function(newTime) {
    var slot = this.todaysTimeslot();
    if(newTime) Timeslots.update(slot._id, { $set: { timeSpent: newTime }});
    return newTime || slot.timeSpent;
  },

  incrementTimeRemaining: function(seconds) {
    var slot = this.todaysTimeslot();
    Timeslots.update(slot._id, { $inc: { timeRemaining: seconds }});
    return slot.timeRemaining + seconds;
  },

  incrementTimeSpent: function(seconds) {
    var slot = this.todaysTimeslot();
    Timeslots.update(slot._id, { $inc: { timeSpent: seconds }});
    return slot.timeSpent + seconds;
  },

  tasksByDay: function() {
    return [
      [
        new Date(), [
          {
            title: 'task 1',
            dueAt: new Date(),
            isDone: false,
            importance: "!!",
            completedLength: 100,
            inputLength: 3600,
            // percentDone: Math.round((100/3600)*100)
          },
          {
            title: 'task 2',
            dueAt: new Date(),
            isDone: false,
            importance: "!!!",
            completedLength: 1000,
            inputLength: 1800,
            // percentDone: Math.round((1000/1800)*100)
          },
          {
            title: 'task 3',
            dueAt: new Date(),
            isDone: true,
            importance: "!",
            completedLength: 0,
            inputLength: 4800,
            // percentDone: Math.round((0/4800)*100)
          }
        ],
        3
      ]
    ];
  }
});

