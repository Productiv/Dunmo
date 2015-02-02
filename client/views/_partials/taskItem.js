
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
  },

  importanceBangs: function() {
    if (this.importance == 1) {
      return "!";
    } else if (this.importance == 2) {
      return "!!";
    } else {
      return "!!!";
    }
  },

  overdueClass: function() {
    if(this.isOverdue) return "overdue";
    else               return "";
  },

  timeRemainingStr: function() {
    var annotation = "remaining";
    return this.timeRemainingStr() + " " + annotation;
  }

});

Template.taskItem.events({

  "click .complete": function(e) {
    this.spendTime(this.timeRemaining.toMilliseconds());
    this.markDone();
  },

  "click .edit": function(e) {
    $("#editModal").attr("data-task-id", this._id);
    // Blaze.render(editTask);
  },

  "hover #due-date": function (event) {
    // body...
  }

});

