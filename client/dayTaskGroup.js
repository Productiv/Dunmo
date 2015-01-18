
Template.dayTaskGroup.helpers({
  date: function() {
    console.log(this);
    return "Today";
  },

  tasks: function() {
    return this;
  },

  timeslot: function() {
    return (Meteor.user().timeslots()[0]).inputLength / 3600;
  }
});

Template.dayTaskGroup.events({
  'click .day-title': function(e) {
    // var 
  }
});
