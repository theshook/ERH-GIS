import moment from 'moment';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

// import { Rescue_Team } from '../../../imports/api/RescueCollection.js';



Template.Rescue.helpers({
  selector() {
    return {'profile.local': Session.get('local')}; 
  }
});