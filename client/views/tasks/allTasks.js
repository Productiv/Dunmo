
Template.allTasks.rendered = function() {
  $('.bootstrap-datetimepicker-widget').remove();
};

Template.allTasks.helpers({

  tasks: function() {
    var user = Meteor.user();
    if(!user) return [];
    else {
      var list = user.sortedTodos();
      return list;
    }
  }

});

Template.allTasks.events({

  'click #newTaskBtn': function() {
    location.href = '/allTasks/new';
  },

  'click .task-row .dialdiv': function(e) {
    $target = $(e.target);
    $task = $target.closest('.task-row');
    Router.go('/pomodoro/' + $task.attr('id'));
  }

});

