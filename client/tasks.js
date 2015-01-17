
Template.tasks.helpers({
  dayTasks: function() {
    var user = Meteor.user();
    return user && user.tasksByDay();
  }
});

Template.tasks.events({
  'click #newTaskBtn': function() {
    location.href = '/tasks/new';
  }
});

Template.tasksNav.events({
  'click #newTaskBtn': function() {
    location.href = '/tasks/new';
  }
});

Template.newTaskNav.events({
  'click #tasks': function() {
    location.href = '/tasks';
  }
});
