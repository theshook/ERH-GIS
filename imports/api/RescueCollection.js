import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Rescue_Team = new Mongo.Collection('rescue_team');

if (Meteor.isServer) {
  Meteor.publish('rescue_collection', function rescuePublication() {
    let userIds = Meteor.users.find({"roles": "Rescue Unit"})
      .map(function (users) { return users._id; });

    let checkRole = Meteor.users.find({_id: this.userId}).fetch();

    return Rescue_Team.find({
      $and: [
        {userId: {$in: userIds}},
        {'type': checkRole[0].roles[1]}
      ]
    });
  });
}
