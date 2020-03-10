import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

Template.Rescue.onCreated(function() {
  this.state = new ReactiveDict();
  Meteor.subscribe('users-rescue-team_collection', {
    onReady: function() {
      Session.set('local', Meteor.user().profile.local);
    },
    onStop: function() {
      console.warn('onError');
    }
  });
});
