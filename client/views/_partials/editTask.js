Template.editTask.rendered = function() {

};

confirmEditTask = function(taskId) {
  // event.preventDefault();
  // validation
  var task = {};
  if ($(".title").val() != "") {
    task.title = $('.title').val();
  }
  if (!($(".task-hours").val() == 0 && $(".task-minutes").val() == 0)) {
    task.timeRemaining = fromSeconds(($('.task-hours').val() * 60 * 60) + ($('.task-minutes').val() * 60));
  }
  if ($("#datetimepicker input").val() != "") {
    task.dueAt = new Date($('#datetimepicker input').val());
  }
  if ($("#importance-group label.active").length != 0) {
    task.importance = $("#importance-group label.active").children("input").eq(0).val();
  }

  updateTask(taskId, task, function (err, id) {
    $('#editModal').modal('hide');
    location.reload();
  });
};
