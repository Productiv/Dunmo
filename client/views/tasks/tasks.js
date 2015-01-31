
Template.tasks.rendered = function() {
  $('.bootstrap-datetimepicker-widget').remove();
};

Template.tasks.helpers({



  dayLists: function() {
    var user = Meteor.user();
    if(!user) return [];
    else {
      var list = user.todoList();
      return list;
    }
  }

});

Template.tasks.events({

  'click .task-row .dialdiv': function(e) {
    $target = $(e.target);
    $task = $target.closest('.task-row');
    Router.go('/pomodoro/' + $task.attr('id'));
  }

});

