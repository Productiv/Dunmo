
Template.tasks.rendered = function() {
  $('.bootstrap-datetimepicker-widget').remove();
};

Template.tasks.helpers({

  dayLists: function() {
    var user = Meteor.user();
    if(!user) return [];
    else {
      var todos = Tasks.find({ ownerId: Meteor.userId(), isDone: false });
      var dayLists = DayLists.find({ ownerId: Meteor.userId(), date: { $gte: Date.todayStart() } });
      console.log('dayLists: ', dayLists.fetch());
      var list = user.reactiveTodoList(todos, dayLists);
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

