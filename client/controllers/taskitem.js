Template.taskitem.rendered = function() {
  $(".dial").knob({
    readOnly: true,
    'fgColor': '#42FF23'
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
    "click .complete": function(e) {
        Meteor.user().updateTimeslot(this.remainingLength);
        removeTodo(this._id);
    },
    "click .edit": function(e) {
        $("#editModal").attr("data-todo-id", this._id);
    },
    "hover #due-date": function (event) {
        // body...
    }
});
