
/*
 * Todo
 * ====
 * ownerId : String
 * title : String
 * isDone : Bool
 * dueAt : Date
 * importance : Integer<1,2,3>
 * totalLength : Number<seconds>
 * completedLength : Number<seconds>
 *
 */

Todos = new Mongo.Collection("todos");

<<<<<<< Updated upstream
Todos.helpers({
  owner: function() {
    return Meteor.users.find(this.ownerId);
  },

  // returns percentage between 0 and 1
  percentageCompleted: function() {
    return this.completedLength / this.totalLength;
  },

  daysUntilDue: function() {
    return this.dueAt.getDay() - Date.now().getDay();
  },

  secondsUntilDue: function() {
    return this.dueAt.getTime() - Date.now().getTime();
  }

});

=======
// Callback takes (err, id) as params
>>>>>>> Stashed changes
insertTodo = function (todo, callback) {
	todo.title = todo.title || "New todo";
	todo.isDone = todo.isDone || false;

	if (!todo.dueAt) {
		var today = new Date();
		todo.dueAt = new Date(today.getFullYear(), today.getMonth(), today.getDay(), 23, 59, 00, 00);
	}

	todo.importance = todo.importance || 3;
	todo.totalLength = todo.totalLength || 1800;
	todo.completedLength = todo.completedLength || 0;
<<<<<<< Updated upstream
};

=======
}

updateTodo = function(_id, modifier, callback) {
  var keys = _.keys(modifier);
  if(!_.every(keys, isFirstChar('$'))) modifier = { $set: modifier };
  if(!modifier.$set) modifier.$set = { updatedAt: (new Date()).getTime() };
  else modifier.$set.updatedAt = (new Date()).getTime();
  Todos.update(_id, modifier, callback);
};

removeTodo = function(_id) {
  Todos.remove(_id);
};

findTodo = function(_id) {
  return Todos.findOne(_id);
};

findTodos = function(ids) {
  if(!ids) return;
  return Todos.find({ _id: { $in: ids } });
};

todosByIndex = function(selector) {
  if(!selector) selector = {};
  return Todos.find(selector, { sort: [[ 'index', 'asc' ]] });
};

allTodos = function() {
  return Todos.find();
};

userTodos = function(uid) {
  return Todos.find({ ownerId: uid });
};

userTodosByIndex = function(uid) {
  return Todos.find({ ownerId: uid }, { sort: [[ 'index', 'asc' ]] });
};

userTodosByIndexByNotDone = function(uid) {
  return Todos.find({ ownerId: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['index', 'asc']
    ]
  });
};

userTodosByIndexBy = function(uid, sortBy, sortOrder) {
  return Todos.find({ ownerId: uid }, {
    sort: [
      [sortBy, sortOrder],
      ['index', 'asc']
    ]
  });
};
>>>>>>> Stashed changes
