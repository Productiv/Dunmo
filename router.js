Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.redirect('/tasks');
});

Router.route('/tasks', function () {
  this.render('tasks');
  Session.set('page', 'tasks');
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal' });
});

Router.route('/tasks/new', function () {
  this.render('newTask');
  this.render('newTaskNav', { to: 'navbar' });
});

Router.route('/tasks/all', function () {
  Session.set('page', 'allTasks');
  this.render('allTasks');
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal' });
});

Router.route('/pomodoro/:id', function () {
  var data = function() {
    var task = findOneTask(this.params.id);
    return task;
  };
  this.render('pomodoro', { data: data });
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal', data: data });
});

