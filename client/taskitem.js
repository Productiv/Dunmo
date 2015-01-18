Template.taskitem.rendered = function() {
  $(function() {
    $(".dial").knob({
      readOnly: true,
      'fgColor': '#42FF23'
    });
  });
}

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
    "click button#complete-task": function (event) {
        Meteor.user().updateTimeslot(this.remainingLength);
        removeTodo(this._id);
    },
    "click button#edit-task": function(event) {

    }
});
