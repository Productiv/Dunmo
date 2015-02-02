Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.redirect('/tasks');
});

Router.route('/tasks', function () {
  this.render('tasks');
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal' });
});

Router.route('/tasks/new', function () {
  this.render('newTask');
  this.render('newTaskNav', { to: 'navbar' });
});

Router.route('/tasks/all', function () {
  this.render('showTasks', {
    data: function() {
      var user  = Meteor.user();
      var todos = user ? user.sortedTodos() : null;
      if(todos && todos.length === 0) todos = null;
      return {
        title: "All Todos",
        tasks: todos
      };
    }
  });
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal' });
  this.render('taskItem', { to: 'taskItem' });
  this.render('noTasks', { to: 'noTasks' });
});

Router.route('/tasks/done', function () {
  this.render('showTasks', {
    data: function() {
      var user  = Meteor.user();
      var tasks = user ? user.doneTasks() : null;
      if(tasks.length === 0) tasks = null;
      return {
        title: "Done Tasks",
        tasks: tasks
      };
    }
  });
  this.render('tasksNav', { to: 'navbar' });
  this.render('editModal', { to: 'modal' });
  this.render('doneItem', { to: 'taskItem' });
  this.render('noDoneTasks', { to: 'noTasks' });
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

