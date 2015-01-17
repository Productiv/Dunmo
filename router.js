
Router.configure({
  layout: 'layout'
});

Router.route('/', 'tasks');

Router.route('/tasks/new', 'newTask');

