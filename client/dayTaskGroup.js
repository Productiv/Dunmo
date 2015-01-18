Template.dayTaskGroup.rendered = function() {
}

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
    setTimeout(render, 300);
  },

  'click .free-time-submit': function(e) {
    console.log('e.target: ', e.target);
    confirm();
    console.log(Session.set('editing-today-freetime', false));
  }
});

function render() {
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
  });

  $(function() {
    var taskMinutes = $('select#task-minutes')
    for (var i = 0; i < 60; i += 5) {
      taskMinutes.append($("<option/>") .val(i) .text(i));
    }
    taskMinutes.val(30);
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
