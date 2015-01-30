
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
    return this.timeRemaining.toAbbrevDetailStr();
  },

  editing: function() {
    return Session.get('editing#' + this._id);
  },

  dayListIsToday: function() {
    return this.date.isToday();
  }
});

Template.dayList.events({
  'click .timeRemaining': function(e) {
    console.log('this._id: ', this._id);
    Session.set('editing#' + this._id, 'timeRemaining');
    console.log('e.target: ', e.target);
    $parent = $(e.target).parents('.day-tasks-container');
    setTimeout(render.bind(this, $parent), 300);
  },

  'click .submit': function(e) {
    $parent = $(e.target).parents('.day-tasks-container');
    confirm.call(this, $parent);
    Session.set('editing#' + this._id, false);
  }
});

function render($parent) {
  console.log('$parent: ', $parent);
  var timeRemaining = this.timeRemaining; // duration
  var minutesUnit = 5;
  var hr = Math.floor(timeRemaining.toSeconds() / 60 / 60);
  var min = Math.ceil(timeRemaining.minutes() / minutesUnit) * minutesUnit;

  var taskHours = $parent.find('select#task-hours');
  console.log('taskHours: ', taskHours);
  for (var i = 0; i < 24; i++) {
    taskHours.append($("<option/>").val(i).text(i));
  }
  taskHours.val(hr);

  var taskMinutes = $parent.find('select#task-minutes')
  for (var i = 0; i < 60; i += minutesUnit) {
    taskMinutes.append($("<option/>").val(i).text(i));
  }
  taskMinutes.val(min);
};

function confirm($parent) {
  var hr = $parent.find('#task-hours').val();
  var min = $parent.find('#task-minutes').val();
  var remaining = ((hr * 60 * 60) + (min * 60)) * 1000;
  var user = Meteor.user();
  var date = this.date;
  user.timeRemaining(date, remaining);
  // var todoList = user.todoList(this.date);
  // console.log('todoList: ', todoList);
  // todoList.forEach(function (dayList) {
  //   updateDayListView(dayList);
  // });
};

// function updateDayListView(dayList) {
//   console.log('dayList: ', dayList);
//   var id = dayList._id;
//   var $dayList = $('#' + id);
//   console.log('$dayList: ', $dayList);
//   var dl_elem = $dayList.get()[0];
//   console.log('dl_elem: ', dl_elem);
//   var data = Blaze.getData(dl_elem);
//   console.log('data: ', data);
//   data.todos = dayList.todos;
// }
