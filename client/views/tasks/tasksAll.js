
Template.tasksAll.rendered = function() {
  $('.bootstrap-datetimepicker-widget').remove();
};

Template.tasksAll.helpers({



  tasks: function() {
    var user = Meteor.user();
    if(!user) return [];
    else {
      var list = user.sortedTodos();
      console.log('list: ', list);
      return list;
    }
  }

});

Template.tasksAll.events({

  'click #newTaskBtn': function() {
    location.href = '/tasksAll/new';
  },

  'click .task-row .dialdiv': function(e) {
    $target = $(e.target);
    $task = $target.closest('.task-row');
    Router.go('/pomodoro/' + $task.attr('id'));
  }

});

