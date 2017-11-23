import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Rescue_Team = new Mongo.Collection('rescue_team');

if (Meteor.isServer) {
  Meteor.publish('rescue_collection', function rescuePublication() {
    return Rescue_Team.find({});
  });
}
