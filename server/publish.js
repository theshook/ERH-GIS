Meteor.publish('users_collection', function() {
  if (Meteor.userId()) {
    let checkRole = Meteor.users.find({_id: this.userId}).fetch();
    return Meteor.users.find({'roles': checkRole[0].roles[1]});
  }
});
