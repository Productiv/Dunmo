
Template.tasks.helpers({
  tasks: function() {
    // return Meteor.user().tasks();
    return [
      {
        title: 'task 1',
        dueAt: new Date(),
        isDone: false,
        importance: 2,
        totalLength: 3600
      },
      {
        title: 'task 2',
        dueAt: new Date(),
        isDone: false,
        importance: 3,
        totalLength: 1800
      },
      {
        title: 'task 3',
        dueAt: new Date(),
        isDone: true,
        importance: 1,
        totalLength: 4800
      }
    ];
  }
});

Template.tasks.events({
  'click #newTaskBtn': function() {
    location.href = '/tasks/new';
  }
});

