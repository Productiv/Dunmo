Template.editModal.rendered = function() {
  // TODO: change data context somehow?
  $('#editModal').on('show.bs.modal', function(e) {
    var $modal = $(e.target);
    console.log('modal: ', $modal);
    var taskId = $modal.attr('data-task-id');
    console.log('open edit modal, taskId: ', taskId);
    var task = findOneTask(taskId);
    console.log('open edit modal, task: ', task);

    // fill fields with data
    $('.edit-task input.title').val(task.title);

    var importance = task.importance;
    if(importance == 1) {
      $('.edit-task label.imp-one').addClass('active');
      $('.edit-task label.imp-two').removeClass('active');
      $('.edit-task label.imp-three').removeClass('active');
    } else if(importance == 2) {
      $('.edit-task label.imp-one').removeClass('active');
      $('.edit-task label.imp-two').addClass('active');
      $('.edit-task label.imp-three').removeClass('active');
    } else {
      $('.edit-task label.imp-one').removeClass('active');
      $('.edit-task label.imp-two').removeClass('active');
      $('.edit-task label.imp-three').addClass('active');
    }

    var timeRemaining = task.timeRemaining; // Duration
    var hr = timeRemaining.hours;
    var min = 5 * Math.round(timeRemaining.minutes / 5);
    if(min > 55) {
      min = 0;
      hr++;
    }
    $('.edit-task .task-hours').val(hr);
    $('.edit-task .task-minutes').val(min);

    var dueAt = task.dueAt;
    $("#datetimepicker").datetimepicker({
      pick12HourFormat: true,
      defaultDate: dueAt
    });
  });
};

Template.editModal.events({
  'click .confirm': function (e) {
    var taskId = $(e.target).closest('.modal').attr('data-task-id');
    console.log('taskId: ', taskId);
    confirmEditTask(taskId);
  }
});
