Template.tasks.rendered = function() {
  $('.bootstrap-datetimepicker-widget').remove();
};

Template.tasks.helpers({
  dayTasks: function() {
    var userId = Meteor.userId();
    if (!userId) { return []; };
    var thing = userFillDays(userId);
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
    if($target.hasClass('glyphicon') || $target.hasClass('btn')) return;
    else Router.go('/pomodoro/' + $todo.attr('id'));
  },

});

