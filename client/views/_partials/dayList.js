
Template.dayList.rendered = function() {
  Session.set('editing#' + this._id, false);
};

Template.dayList.helpers({
  date: function() {
    return moment(this.date).calendar(true);
  },

  tasks: function() {
    return this.todos;
  },

  hasTasks: function() {
    return this.todos.length > 0;
  },

  timeRemainingStr: function() {
    return this.timeRemaining.toPrettyStr();
  },

  editing: function() {
    return Session.get('editing#' + this._id);
  }
});

Template.dayList.events({
  'click .timeRemaining': function(e) {
    Session.set('editing#' + this._id, 'timeRemaining');
    setTimeout(render.bind(this), 300);
  },

  'click .submit': function(e) {
    confirm.call(this);
    Session.set('editing#' + this._id, false);
  }
});

function render() {
  var timeRemaining = fromMilliseconds(Meteor.user().timeRemaining(this.date));
  var minutesUnit = 5;
  var hr = timeRemaining.hours;
  var min = Math.ceil(timeRemaining.minutes / minutesUnit) * minutesUnit;

  $(function () {
    $("#datetimepicker").datetimepicker({
      pick12HourFormat: true
    });
  });

  $(function() {
    var taskHours = $('select#task-hours');
    for (var i = 0; i < 24; i++) {
      taskHours.append($("<option/>").val(i).text(i));
    }
    taskHours.val(hr);
  });

  $(function() {
    var taskMinutes = $('select#task-minutes')
    for (var i = 0; i < 60; i += minutesUnit) {
      taskMinutes.append($("<option/>").val(i).text(i));
    }
    taskMinutes.val(min);
  });
};

function confirm() {
  var hr = $('#task-hours').val();
  var min = $('#task-minutes').val();
  console.log('hr, min: ', hr, min);
  var remaining = ((hr * 60 * 60) + (min * 60)) * 1000;
  console.log('remaining: ', remaining);
  var user = Meteor.user();
  var date = this.date;
  console.log('user, date: ', user, date);
  user.timeRemaining(date, remaining);
};
