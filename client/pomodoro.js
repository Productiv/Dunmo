var clock;

Template.pomodoro.rendered = function() {
  clock = $('.clock').FlipClock();
  Session.set('pause', false);
  var data = this.data;
  if(!data) return;
  var time = data.inputLength - data.remainingLength;
  clock.setTime(time);
  $('.clock-wrapper').attr('hidden', false);
};

Template.pomodoro.helpers({
  pause: function() {
    return Session.get('pause');
  }
});

Template.pomodoro.events({
  'click .back': function(e) {
    var time = clock.getTime();
    var remaining = this.inputLength - time;
    Meteor.user().updateTimeslot(remaining - this.remainingLength);
    Todos.update(this._id, { $set: { remainingLength: remaining } });
    window.location.href = '/';
  },

  'click .play-pause': function(e) {
    var pause = Session.get('pause');
    if(pause) {
      clock.start();
      Session.set('pause', false);
    } else {
      clock.stop();
      Session.set('pause', true);
    }
  },

  'click .complete-task': function (event) {
    $('pomodoro-container').hide();
    var time = clock.getTime();
    var remaining = this.inputLength - time;
    Meteor.user().updateTimeslot(this.remainingLength);
    removeTodo(this._id);
    window.location.href = '/';
  }
});

