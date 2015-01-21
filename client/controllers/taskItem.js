
Template.taskItem.rendered = function() {

  $(".dial").knob({
    readOnly: true,
    'fgColor': '#68B82B'
  });

  $('.dialdiv').attr('hidden', false);

};

Template.taskItem.helpers({

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

Template.taskItem.events({

  "click .complete": function(e) {
    Meteor.user().incrementTimeRemaining(this.timeRemaining);
    removeTodo(this._id);
  },

  "click .edit": function(e) {
    $("#editModal").attr("data-todo-id", this._id);
  },

  "hover #due-date": function (event) {
    // body...
  }

});

