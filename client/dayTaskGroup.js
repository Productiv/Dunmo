
Template.dayTaskGroup.helpers({
  date: function() {
    console.log(this);
    return "Today";
  },

  tasks: function() {
    return this[1];
  },

  timeslot: function() {
    return this[2];
  }
});

Template.dayTaskGroup.events({
  'click .day-title': function(e) {
    // var 
  }
});
