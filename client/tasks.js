
Template.tasks.helpers({
  tasks: function() {
    // return Meteor.user().tasks();
    return [];
  }
});

Template.tasks.events({
  'click #newTaskBtn': function() {
    location.href = '/tasks/new';
  }
});

