
Meteor.users.helpers({
  todos: function() {
    return Todos.find({ ownerId: this._id });
  },

  timeslots: function() {
    // get average free time based on last week
    var lastWeek = Timeslots.find({
      ownerId: this._id,
      date: {
        $gte: Date.sevenDaysAgoStart(),
        $lt: Date.todayStart()
      }
    });

    var avgLength;
    if (!lastWeek[0]) {
      avgLength = 4*60*60;
    } else {
      var total = _.reduce(lastWeek, function(sum, item) {
        return sum + item.inputLength;
      });
      avgLength = total / lastWeek.length;
    };

    // get all the todos from today until infinity, sorted by date
    var todos = Todos.find({ ownerId: this._id, dueAt: { $gte: Date.todayStart() } },
                           {
                             sort: [[ 'dueAt', 'asc' ]]
                           });

    // create all the timeslots from today until the furthest due date, sorted by date
    var todaysTimeslot = Timeslots.find({ ownerId: this._id, date: new Date(Date.todayStart()) }).fetch()[0];
    if(!todaysTimeslot) todaysTimeslot = { ownerId: this._id, date: new Date(Date.todayStart()), inputLength: avgLength };
    var timeslots = [ todaysTimeslot ];
    var startDate = new Date(Date.todayStart());
    var endDate = _.last(todos) && _.last(todos).dueAt || new Date(Date.todayStart());
    for(var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      timeslots.push({
        ownerId: this._id,
        date: d,
        inputLength: avgLength
      });
    }

    console.log("Slots: ", timeslots);

    return timeslots;
  }, // end of user.timeslots()

  tasksByDay: function() {
    console.log(userTodos(Meteor.user()));
    // return userTodos(Meteor.user());
    // return userFillDays(Meteor.user());
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
