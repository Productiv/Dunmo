var clock;

Template.pomodoro.rendered = function() {
  clock = $('.clock').FlipClock();
  Session.set('pause', false);
  var task = this.data;
  if(!task) return;
  var time = task.timeSpent
  clock.setTime(time);
  $('.clock-wrapper').attr('hidden', false);
};

Template.pomodoro.helpers({
  pause: function() {
    return Session.get('pause');
  }
});

Template.pomodoro.events({
  'click .save': function(e) {
    var time = clock.getTime().time - this.timeSpent;
    this.spendTime(time);
    window.location.href = '/';
  },

  'click .cancel': function(e) {
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

  'click .complete': function (event) {
    $('pomodoro-container').hide();
    var time = clock.getTime().time - this.timeSpent;
    this.spendTime(time);
    this.markDone();
    window.location.href = '/';
  }
});

