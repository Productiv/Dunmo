
/*
 * Todo
 * ====
 * title : String
 * isDone : Bool
 * dueAt : Date
 * importance : Integer<1,2,3>
 * totalLength : Number<seconds>
 * completedLength : Number<seconds>
 *
 */

Todos = new Mongo.Collection("todos");

insertTodo = function (todo, callback) {
	todo.title = todo.title || "New todo";
	todo.isDone = todo.isDone || false;

	if (!todo.dueAt) {
		var today = new Date();
		var todo.dueAt = new Date(today.getFullYear(), today.getMonth(), today.getDay(), 23, 59, 00, 00);
	}

	todo.importance = todo.importance || 3;
	todo.totalLength = todo.totalLength || 1800;
	todo.completedLength = todo.completedLength || 0;
}
