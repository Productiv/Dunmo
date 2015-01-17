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

Template.newTaskNav.events({
    "click a#confirm-new-task": function (event) {

        // validation
        $("div.form-group").removeClass("has-error");
        if ($("input#title").val() == "") {
            $("div#title-group").addClass("has-error");
        }
        if ($("select#task-hours").val() == 0 && $("select#task-minutes").val() == 0) {
            $("div#length-group").addClass("has-error");
        }
        if ($("#datetimepicker input").val() == "") {
            $("div#date-group").addClass("has-error");
        }
        if ($("div#importance-group label.active").length == 0) {
            $("div#importance-group").addClass("has-error");
        }

        // if ($("div.form-group.has-error").length == 0) {
        //
        // }

        // $("div#importance-group label.active").children("input").eq(0).val()
        return false;
    }
});
