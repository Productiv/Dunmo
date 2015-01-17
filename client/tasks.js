
Template.tasks.helpers({
  tasks: function() {
    return Meteor.user().tasks();
  }
});

Template.tasks.events({
  'click #newTask': function() {
    Router.go('/tasks/new');
  }
});

