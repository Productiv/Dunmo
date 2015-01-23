Template.tasksNav.events({
  'click #newTaskBtn': function() {
    location.href = '/tasks/new';
  },
  'click #tasksAllBtn': function() {
    location.href = '/tasks/all';
  },
  'click #tasksBtn': function() {
    location.href = '/tasks';
  }
});

Template.tasksNav.helpers({
	otherViewClass: function() {
		if (Session.get('page') === 'tasksAll') {
			return 'tasks';
		} else {
			return 'tasksAll';
		};
	},
	otherViewText: function() {
		if (Session.get('page') === 'tasksAll') {
			return 'View Days';
		} else {
			return 'View All Tasks';
		};
	}
});