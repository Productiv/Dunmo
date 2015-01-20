Template.tasks.rendered = function() {
  $('.bootstrap-datetimepicker-widget').remove();
};

Template.tasks.helpers({
  dayTasks: function() {
    var userId = Meteor.userId();
    if (!userId) return [];
    else         return userFillDays(userId);
  }
});

Template.tasks.events({

  'click #newTaskBtn': function() {
    location.href = '/tasks/new';
  },

  'click .task-row:not(.glyphicon)': function(e) {
    $target = $(e.target);
    $todo = $target.parents('.task-row');
    if($target.hasClass('glyphicon') || $target.hasClass('btn')) return;
    else Router.go('/pomodoro/' + $todo.attr('id'));
  }

});

