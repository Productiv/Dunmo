Template.editModal.rendered = function() {
  $('#editModal').on('show.bs.modal', function(e) {
    var $modal = $(e.target);
    console.log('modal: ', $modal);
    var taskId = $modal.attr('data-task-id');
    console.log('open edit modal, taskId: ', taskId);
    var task = findTask(taskId);
    console.log('open edit modal, task: ', task);
    // fill fields with data
  });
};

Template.editModal.events({
  'click .confirm': function (e) {
    var taskId = $(e.target).parents('.modal').attr('data-task-id');
    console.log('taskId: ', taskId);
    console.log('this: ', this);
    var prevRemaining = findTask(taskId).timeRemaining;
    var spent = prevRemaining - $('#task-hours').val() * 60 * 60 + $('#task-minutes').val() * 60;
    console.log('TIME: ' + spent);
    Meteor.user().timeSpent(spent);
    confirmEditTask(taskId);
  }
});
