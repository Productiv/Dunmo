Template.newTask.rendered = function() {
  $(function () {
    $("#datetimepicker").datetimepicker({
      pick12HourFormat: true
    });
  });
  $(function() {
    var taskHours = $('select#task-hours');
    for (var i = 0; i < 101; i++) {
      taskHours.append($("<option/>").val(i).text(i));
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
    "click .confirm-new-task": function (event) {
        confirm();
    }

})

Template.newTask.events({

  "click .confirm-new-task": function (event) {
      confirm();
  }
});

confirm = function() {
    event.preventDefault();
    // validation
    var itemsInvalid = false;
    $("div.form-group").removeClass("has-error");
    if ($("input#title").val() == "") {
        $("div#title-group").addClass("has-error");
        itemsInvalid = true;
    }
    if ($("select#task-hours").val() == 0 && $("select#task-minutes").val() == 0) {
        $("div#length-group").addClass("has-error");
        itemsInvalid = true;
    }
    if ($("#datetimepicker input").val() == "") {
        $("div#date-group").addClass("has-error");
        itemsInvalid = true;
    }
    if ($("div#importance-group label.active").length == 0) {
        $("div#importance-group").addClass("has-error");
        itemsInvalid = true;
    }
    // check if any items were invalid
    if (itemsInvalid) return false;

    // add todo
    var todo = {};
    todo.title = $('#title').val();
    todo.dueAt = new Date($('#datetimepicker input').val());
    todo.inputLength = $('#task-hours').val() * 60 * 60 + $('#task-minutes').val() * 60;
    todo.importance = $("div#importance-group label.active").children("input").eq(0).val()
    insertTodo(todo, function (err, id) {
      if(err) console.log(err);
      else console.log('id: ', id);
      Router.go('/tasks');
      return false;
    });
}
