Template.newTask.rendered = function() {
  $(function () {
    $("#datetimepicker").datetimepicker({
      pick12HourFormat: true
    });
  });
  $(function() {
      var taskHours = $('select#task-hours');
      for (var i = 0; i < 24; i++) {
          taskHours.append($("<option/>") .val(i) .text(i));
      }
  });

  $(function() {
     var taskMinutes = $('select#task-minutes')
     for (var i = 0; i < 60; i += 5) {
         taskMinutes.append($("<option/>") .val(i) .text(i));
     }
     taskMinutes.val(30);
  });
}
