
Meteor.users.helpers({
  todos: function() {
    return Todos.find({ ownerId: this._id });
  }
});
