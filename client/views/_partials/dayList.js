
Template.dayList.rendered = function() {
  Session.set('editing', false);
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
    var remaining = this.timeRemaining;
    console.log('remaining: ', remaining);
    var str = "4h 0m 0s";
    return remaining.toPrettyStr();
  },

  editing: function() {
    return Session.get('editing');
  }
});

Template.dayList.events({
  'click .timeRemaining': function(e) {
    console.log('e.target: ', e.target);
    console.log(Session.set('editing', 'timeRemaining'));
    setTimeout(render.bind(this), 300);
  },

  'click .submit': function(e) {
    console.log('e.target: ', e.target);
    confirm();
    console.log(Session.set('editing', false));
  }
});

function render() {
  var timeRemaining = Meteor.user().timeRemaining();
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
    console.log('hr: ', hr);
    taskHours.val(hr);
  });

  $(function() {
    var taskMinutes = $('select#task-minutes')
    for (var i = 0; i < 60; i += minutesUnit) {
      taskMinutes.append($("<option/>").val(i).text(i));
    }
    console.log('min: ', min);
    taskMinutes.val(min);
  });
};

function confirm() {
  var remaining = ($('#task-hours').val() * 60 * 60) + ($('#task-minutes').val() * 60);
  Meteor.user().timeRemaining(remaining);
};

