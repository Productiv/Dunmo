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
        if (this.importance == "!") {
            return "lowImportance";
        } else if (this.importance == "!!") {
            return "mediumImportance";
        } else {
            return "highImportance";
        }
    }
});
