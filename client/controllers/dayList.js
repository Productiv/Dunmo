
Template.dayList.rendered = function() {
  Session.set('editing', false);
};

Template.dayList.helpers({
  date: function() {
    console.log('date: ', this.timeslot && this.timeslot.date);
    return "Today";
  },

  tasks: function() {
    return this.tasks;
  },

  timeRemaining: function() {
    return secToTime(Meteor.user().timeRemaining());
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
  var timeRemaining = secToTime(Meteor.user().timeRemaining());
  console.log('free: ', timeRemaining);
  var hr = parseInt(timeRemaining.substr(0, timeRemaining.indexOf(':')));
  var minstr = timeRemaining.substr(timeRemaining.indexOf(':')+1, timeRemaining.length);
  console.log('minstr: ', minstr);
  var min = parseInt(minstr);
  console.log('min: ', min);

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
    for (var i = 0; i < 60; i += 5) {
      taskMinutes.append($("<option/>").val(i).text(i));
    }
    taskMinutes.val(min);
  });
};

function confirm() {
  var remaining = ($('#task-hours').val() * 60 * 60) + ($('#task-minutes').val() * 60);
  Meteor.user().timeRemaining(remaining);
};

