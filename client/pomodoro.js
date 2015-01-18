var clock;

Template.pomodoro.rendered = function() {
  clock = $('.clock').FlipClock();
  $('.clock-wrapper').attr('hidden', false);
};

Template.pomodoro.helpers({
  pause: function() {
    return Session.get('pause');
  }
});

Template.pomodoro.events({
  'click .play-pause': function(e) {
    clock.pause();
    Session.set('pause', !Session.get('pause'));
  }
});

