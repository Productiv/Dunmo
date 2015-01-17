
Template.tasks.helpers({
  tasks: function() {
    // return Meteor.user().tasks();
    return [
      {
        title: 'task 1',
        dueAt: new Date(),
        isDone: false,
        importance: 2,
        completedLength: 100,
        totalLength: 3600,
        // percentDone: Math.round((100/3600)*100)
      },
      {
        title: 'task 2',
        dueAt: new Date(),
        isDone: false,
        importance: 3,
        completedLength: 1000,
        totalLength: 1800,
        // percentDone: Math.round((1000/1800)*100)
      },
      {
        title: 'task 3',
        dueAt: new Date(),
        isDone: true,
        importance: 1,
        completedLength: 0,
        totalLength: 4800,
        // percentDone: Math.round((0/4800)*100)
      }
    ];
  }
});

Template.tasks.events({
  'click #newTaskBtn': function() {
    location.href = '/tasks/new';
  }
});
