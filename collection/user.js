
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
  } // end of user.timeslots()
});

