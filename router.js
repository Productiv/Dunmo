Router.configure({
  layout: 'layout'
});

Router.route('/tasks', function () {
  this.render('tasks');
});

Router.route('/tasks/new', function () {
  this.render('newTask');
});
