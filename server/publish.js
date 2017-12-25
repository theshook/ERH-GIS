Meteor.publish('users_collection', function() {
  if (Meteor.userId()) {
    let checkRole = Meteor.users.find({_id: this.userId}).fetch();
    return Meteor.users.find({
      $and: [
        {'profile.local': checkRole[0].profile.local}
      ]
    });
  }
});

Meteor.publish('users-rescue-team_collection', function () {
  if (Meteor.userId()) {
    let checkRole = Meteor.users.find({_id: this.userId}).fetch();

    return Meteor.users.find({
      $and: [
        {'roles': 'Rescue Unit'},
        {'profile.local': checkRole[0].profile.local}
      ]
    });
  }
});

