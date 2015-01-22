
Template.tasks.rendered = function() {
  $('.bootstrap-datetimepicker-widget').remove();
};

Template.tasks.helpers({

  dayLists: function() {
    var user = Meteor.user();
    if(!user) return [];
    else {
      var lists = user.filledDayLists();
      console.log('user.filledDayLists(): ', user.filledDayLists());
      return lists;
    }
  }

});

Template.tasks.events({

  'click #newTaskBtn': function() {
    location.href = '/tasks/new';
  },

  'click .task-row:not(.glyphicon)': function(e) {
    $target = $(e.target);
    $task = $target.parents('.task-row');
    if($target.hasClass('glyphicon') || $target.hasClass('btn')) return;
    else Router.go('/pomodoro/' + $task.attr('id'));
  }

});

