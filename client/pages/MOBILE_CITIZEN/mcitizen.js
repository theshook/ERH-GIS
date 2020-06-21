import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';

import moment from 'moment';

import { Markers } from '../../../imports/api/MapsCollection.js';

newDate = function(val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return 'Never';
  }
};

let phoneId;

Template.mcitizen.onCreated(function() {
  this.state = new ReactiveDict();
  phoneId = FlowRouter.getParam('phoneId');
  this.subscribe('markers_collection');
});

Template.mcitizen.helpers({
  markers: function() {
    return Markers.find({ userId: phoneId }, { sort: { createdAt: -1 } });
  },
  date: function() {
    return newDate(this.createdAt);
  },
  response: function() {
    let Hospital = this.Hospital ? this.Hospital : 0;
    let Police = this.Police ? this.Police : 0;
    let Fire = this.Fire ? this.Fire : 0;
    let status = this.status ? this.status : 'No Response Yet.';
    let stats;

    if (status == 'Responded') {
      return 'This incident is already responded.';
    }

    if (Hospital == 0 && Police == 0 && Fire == 0) {
      return 'No response Yet.';
    }

    if (Hospital.length != 0 || Police.length != 0 || Fire.length != 0) {
      for (var i = 0; i < Hospital.length; i++) {
        if (Hospital[i].status == 'Arrived') {
          stats = 'Rescue unit has arrived.';
          break;
        } else {
          stats = 'Rescue unit are responding';
        }
      }

      for (var i = 0; i < Police.length; i++) {
        if (Police[i].status == 'Arrived') {
          stats = 'Rescue unit has arrived.';
          break;
        } else {
          stats = 'Rescue unit are responding';
        }
      }

      for (var i = 0; i < Fire.length; i++) {
        if (Fire[i].status == 'Arrived') {
          stats = 'Rescue unit has arrived.';
          break;
        } else {
          stats = 'Rescue unit are responding';
        }
      }

      return stats;
    }
  },
  interlocal: function() {
    return this.respondent ? this.respondent : 'Not Available';
  }
});
