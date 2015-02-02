Template.login.created = function() {
  Session.setDefault('isLogin', true);
};

Template.login.helpers({
  login: function() {
    return Session.get('isLogin');
  },

  signup: function() {
    return Session.get('isSignup');
  },

  passwordReset: function() {
    return Session.get('isPasswordReset');
  }
});

Template.login.events({
  'click a#passwordView' : function() {
    Session.set('isLogin', false);
    Session.set('isSignup', false);
    Session.set('isPasswordReset', true);
  },

  'click a#signupView' : function() {
    Session.set('isSignup', true);
    Session.set('isLogin', false);
    Session.set('isPasswordReset', false);
  },

  'click a#loginView' : function() {
    Session.set('isSignup', false);
    Session.set('isLogin', true);
    Session.set('isPasswordReset', false);
  }
})
