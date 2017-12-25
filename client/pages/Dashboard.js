import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

Template.Dashboard.helpers({
  police: function() {
    return Roles.userIsInRole(Meteor.userId(), 'Police');
  },
  hospital: function() {
    return Roles.userIsInRole(Meteor.userId(), 'Hospital');
  },
  fire: function() {
    return Roles.userIsInRole(Meteor.userId(), 'Fire Protection');
  },
});

// Template.Dashboard.onRendered(function() {
//   Session.set('local', Meteor.user().profile.local)
// });
