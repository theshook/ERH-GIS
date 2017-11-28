import moment from 'moment';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

// import { Rescue_Team } from '../../../imports/api/RescueCollection.js';

Template.UserList.onCreated(function() {
  this.state = new ReactiveDict;
    Meteor.subscribe('users_collection');
    // Meteor.subscribe('rescue_collection');
});

Template.UserList.helpers({
  userEmail: function () {
    return this.emails[0].address;
  },
  dateFormat: function () {
    return moment(this.createdAt).format('MMM D YYYY');
  },
  currentEdit: function () {
    let user = Session.get('currentUser');
    if (user == null) {
      return false;
    }
    return user._id == this._id;
  },
  editMode: function () {
    return Session.get('currentUser') ? 'edit-mode' : ''
  },
  ////////////////////////////////////////
  // EasySearch
  ///////////////////////////////////////
  inputAttributes: function () {
    return { 'class': 'form-control', 'placeholder': 'Search by Email, First Name, Last Name or Local' };
  },
  index: function () {
    return UsersIndex;
  },
  resultsCount: function() {
    return UsersIndex.getComponentDict().get('count');
  },
  showMore: function() {
      return false;
  },

  renderTmpl: () => Template.rederTemplate
});

Template.UserList.events({
  'click .user_id': function () {
    Session.set('currentUser', this);
  },
  'click .close-edit-mode': function () {
      Session.set('currentUser', null);
  },
});
