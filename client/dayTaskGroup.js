
Template.dayTaskGroup.rendered = function() {
  Session.set('editing-today-freetime', false);
};

Template.dayTaskGroup.helpers({
  date: function() {
    console.log(this);
    return "Today";
  },

  tasks: function() {
    return this;
  },

  timeslot: function() {
    return Meteor.user().freeTime();
  },

  editing: function() {
    return Session.get('editing-today-freetime');
  }
});

Template.dayTaskGroup.events({
  'click .timeslot': function(e) {
    console.log('e.target: ', e.target);
    console.log(Session.set('editing-today-freetime', true));
    setTimeout(render.bind(this), 300);
  },

  'click .free-time-submit': function(e) {
    console.log('e.target: ', e.target);
    confirm();
  }
});

function render() {
  var freetime = Meteor.user().freeTime();
  console.log('free: ', freetime);
  var hr = parseInt(freetime.substr(0, freetime.indexOf(':')));
  var minstr = freetime.substr(freetime.indexOf(':')+1, freetime.length);
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
    for (var i = 0; i < 101; i++) {
      taskHours.append($("<option/>").val(i).text(i));
    }
    taskHours.val(hr);
  });

  $(function() {
    var taskMinutes = $('select#task-minutes')
    for (var i = 0; i < 60; i += 5) {
      taskMinutes.append($("<option/>") .val(i) .text(i));
    }
    taskMinutes.val(min);
  });
};

function confirm() {
  event.preventDefault();
  // validation
  var itemsInvalid = false;
  $("div.form-group").removeClass("has-error");
  if ($("select#task-hours").val() == 0 && $("select#task-minutes").val() == 0) {
    $("div#length-group").addClass("has-error");
    itemsInvalid = true;
  }
  // check if any items were invalid
  if (itemsInvalid) return false;

  // add todo
  var inputLength = ($('#task-hours').val() * 60 * 60) + ($('#task-minutes').val() * 60);
  Meteor.user().changeFreeTime(inputLength);
}
