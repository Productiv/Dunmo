Template.newTask.rendered = function() {
  $(function () {
    $("#datetimepicker").datetimepicker({
      pick12HourFormat: true,
      defaultDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    });
  });
  $(function() {
    var taskHours = $('#task-hours');
    for (var i = 0; i < 101; i++) {
      taskHours.append($("<option/>").val(i).text(i));
    }
  });

  $(function() {
    var taskMinutes = $('#task-minutes')
    for (var i = 0; i < 60; i += 5) {
      taskMinutes.append($("<option/>") .val(i) .text(i));
    }
    taskMinutes.val(30);
  });
}

Template.newTaskNav.events({
  "click .confirm": function (event) {
    confirm();
  }
});

Template.newTask.events({
  "click .confirm": function (event) {
    confirm();
  }
});

function confirm() {
  event.preventDefault();
  // validation
  var itemsInvalid = false;
  $(".form-group").removeClass("has-error");
  if ($("#title").val() == "") {
    $("#title-group").addClass("has-error");
    itemsInvalid = true;
  }
  if ($("#task-hours").val() == 0 && $("#task-minutes").val() == 0) {
    $("#length-group").addClass("has-error");
    itemsInvalid = true;
  }
  if ($("#datetimepicker input").val() == "") {
    $("#date-group").addClass("has-error");
    itemsInvalid = true;
  }
  if ($("#importance-group label.active").length == 0) {
    $("#importance-group").addClass("has-error");
    itemsInvalid = true;
  }
  // check if any items were invalid
  if (itemsInvalid) return false;

  // add todo
  var todo = {};
  todo.title = $('#title').val();
  todo.dueAt = new Date($('#datetimepicker input').val());
  todo.inputLength = ($('#task-hours').val() * 60 * 60) + ($('#task-minutes').val() * 60);
  todo.remainingLength = todo.inputLength;
  todo.importance = $("#importance-group label.active").children("input").eq(0).val()
  insertTodo(todo, function (err, id) {
    if(err) console.log(err);
    else    console.log('id: ', id);
    return false;
  });
}
