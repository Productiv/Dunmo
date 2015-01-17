
Meteor.users.helpers({
  todos: function() {
    return Todos.find({ ownerId: this._id });
  },

  timeslots: function() {
    var lastWeek = Timeslots.find({
      ownerId: this._id,
      date: {
        $gte: Date.sevenDaysAgoStart(),
        $lt: Date.todayStart()
      }
    });

    var total = _.reduce(lastWeek, function(sum, item) {
      return sum + item.totalLength;
    });
    var avgLength = total / lastWeek.length;

    var slots = Timeslots.find({
      ownerId: this._id,
      date: { $gte: Date.todayStart() }
    }).fetch();

    var slotsObj = _.object(_.map(slots, function(slot) {
      return [ slot.date, slot ];
    }));

    var minDate = _.min(slots, 'date');
    var maxDate = _.max(slots, 'date');
    var currentDate = minDate;
    var ret = [ currentDate ];

    while(currentDate < maxDate) {
      currentDate.setDate(currentDate.getDate() + 1)
      ret.push(currentDate);
    }

    ret = _.map(ret, function(date) {
      return slotsObj[date] || {
        ownerId: this._id,
        date: avgDate,
        totalLength: avgLength
      };
    });

    return ret;
  }, // end of user.timeslots()

  tasksByDay: function() {
    return [
      [
        new Date(), [
          {
            title: 'task 1',
            dueAt: new Date(),
            isDone: false,
            importance: 2,
            completedLength: 100,
            totalLength: 3600,
            // percentDone: Math.round((100/3600)*100)
          },
          {
            title: 'task 2',
            dueAt: new Date(),
            isDone: false,
            importance: 3,
            completedLength: 1000,
            totalLength: 1800,
            // percentDone: Math.round((1000/1800)*100)
          },
          {
            title: 'task 3',
            dueAt: new Date(),
            isDone: true,
            importance: 1,
            completedLength: 0,
            totalLength: 4800,
            // percentDone: Math.round((0/4800)*100)
          }
        ],
        3
      ]
    ];
  }
});

