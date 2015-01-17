Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.redirect('/tasks');
});

Router.route('/tasks', function () {
  this.render('tasks');
  this.render('tasksNav', { to: 'navbar' });
});

Router.route('/tasks/new', function () {
  this.render('newTask');
  this.render('newTaskNav', { to: 'navbar' });
});
