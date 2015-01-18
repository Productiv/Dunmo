
Template.tasks.helpers({
  dayTasks: function() {
    var userId = Meteor.userId();
    if (!userId) { return []; };
    var thing = userFillDays(userId);
    console.log(thing);
    return thing;
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
