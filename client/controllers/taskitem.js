Template.taskitem.rendered = function() {
  $(".dial").knob({
    readOnly: true,
    'fgColor': '#68B82B'
  });
  $('.dialdiv').attr('hidden', false);
};

Template.taskitem.helpers({
  importanceClass: function() {
    if (this.importance == 1) {
      return "lowImportance";
    } else if (this.importance == 2) {
      return "mediumImportance";
    } else {
      return "highImportance";
    }
  }
});

Template.taskitem.events({
<<<<<<< Updated upstream
  "click .complete": function(e) {
    Meteor.user().updateTimeslot(this.remainingLength);
    removeTodo(this._id);
  },
  "click .edit": function(e) {
    $("#editModal").attr("data-todo-id", this._id);
  }
=======
    "click button#complete-task": function (event) {
        Meteor.user().updateTimeslot(this.remainingLength);
        removeTodo(this._id);
    },
    "click button#edit-task": function (event) {
        $("div#edit-modal button.confirm-edit-task").attr("id", this._id);
    },
    "hover #due-date": function (event) {
        // body...
    }
>>>>>>> Stashed changes
});
