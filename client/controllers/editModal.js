Template.editModal.rendered = function() {
  $('#editModal').on('show.bs.modal', function(e) {
    var $modal = $(e.target);
    console.log('modal: ', $modal);
    var todoId = $modal.attr('data-todo-id');
    console.log('open edit modal, todoId: ', todoId);
    var todo = findTodo(todoId);
    console.log('open edit modal, todo: ', todo);
    // fill fields with data
  });
};

Template.editModal.events({
  'click .confirm': function (e) {
    var todoId = $(e.target).parents('.modal').attr('data-todo-id');
    console.log('todoId: ', todoId);
    console.log('this: ', this);
    var prevRemaining = findTodo(todoId).remainingLength;
    var timeSpent = prevRemaining - $('#task-hours').val() * 60 * 60 + $('#task-minutes').val() * 60;
    console.log('TIME: ' + timeSpent);
    Meteor.user().updateTimeslot(timeSpent);
    confirmEditTask(todoId);
  }
});
