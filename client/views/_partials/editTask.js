Template.editTask.rendered = function() {

  $(function () {
    $("#datetimepicker").datetimepicker({
      pick12HourFormat: true
    });
  });

  $(function () {
    var taskHours = $('#task-hours');
    for (var i = 0; i < 101; i++) {
      taskHours.append($("<option/>").val(i).text(i));
    }
    var taskMinutes = $('#task-minutes')
    for (var i = 0; i < 60; i += 5) {
      taskMinutes.append($("<option/>") .val(i) .text(i));
    }
  });

};

confirmEditTask = function(taskId) {
  // event.preventDefault();
  // validation
  var task = {};
  if ($("#title").val() != "") {
    task.title = $('#title').val();
  }
  if (!($("#task-hours").val() == 0 && $("#task-minutes").val() == 0)) {
    task.remainingLength = ($('#task-hours').val() * 60 * 60) + ($('#task-minutes').val() * 60);
  }
  if ($("#datetimepicker input").val() != "") {
    task.dueAt = new Date($('#datetimepicker input').val());
  }
  if ($("div#importance-group label.active").length != 0) {
    task.importance = $("#importance-group label.active").children("input").eq(0).val();
  }

  updateTask(taskId, task, function (err, id) {
    if(err) console.log(err);
    else    console.log('id: ', id);
    $('#editModal').modal('hide');
  });
};
