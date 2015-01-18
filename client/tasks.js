
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
  },

  'click .task-row:not(.glyphicon)': function(e) {
    $target = $(e.target);
    console.log('target: ', $target);
    $todo = $target.parents('.task-row');
    console.log($todo.attr('id'));
    if($target.hasClass('glyphicon') || $target.hasClass('btn')) return false;
    else Router.go('/pomodoro/' + $todo.attr('id'));
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
