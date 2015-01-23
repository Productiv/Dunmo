Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.redirect('/tasks');
});

Router.route('/tasks', function () {
  Session.set('page', 'tasks');
  this.render('tasks');
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal' });
});

Router.route('/tasks/all', function () {
  Session.set('page', 'tasksAll');
  this.render('tasksAll');
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal' });
});

Router.route('/tasks/new', function () {
  this.render('newTask');
  this.render('newTaskNav', { to: 'navbar' });
});

Router.route('/pomodoro/:id', function () {
  var data = function() {
    return Tasks.findOne(this.params.id);
  };
  this.render('pomodoro', { data: data });
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal', data: data });
});

