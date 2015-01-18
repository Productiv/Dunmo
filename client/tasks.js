
Template.tasks.helpers({
  dayTasks: function() {
    var user = Meteor.user();
    user && user.timeslots();
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

Template.loginButtons.rendered = function() {
  $('.login-link-text').html('<i class="glyphicon glyphicon-user"></i>');
  $('.navbar .login').show();
};
