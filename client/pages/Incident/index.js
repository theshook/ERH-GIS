import { Markers } from '../../../imports/api/MapsCollection.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';
import moment from 'moment';
import toastr from 'toastr';

newDate = function (val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return "Never";
  }
}

Template.Incidents.onRendered( function() {
  $('input[name="from"]').datepicker({});
  $('input[name="to"]').datepicker({});
});

Template.Incidents.onCreated(function() {
  this.state = new ReactiveDict;
  this.state.set( 'from', null );
  this.state.set( 'to', null );
  this.subscribe('markers_collection');
});

Template.Incidents.helpers({
  markers: function () {
    let from = Template.instance().state.get( 'from' );
    let to = Template.instance().state.get( 'to' );
    if(from == null || to == null || from == '' || to == '') {
      return Markers.find({respondent: Meteor.user().profile.local}, {sort: {createdAt: -1}});
    } else {
      return Markers.find({$and: [
          {respondent: Meteor.user().profile.local}, 
          {'createdAt': {'$gte': new Date(from),'$lte': new Date(to)}}
        ]
      }, {sort: {createdAt: -1}});
    }
  },
  hospital: function () {
    return ((this.Hospital) ? this.Hospital : 0)
  },
  police: function () {
    return ((this.Police) ? this.Police : 0)
  },
  fire: function () {
    return ((this.Fire) ? this.Fire : 0)
  },
  date: function() {
    return newDate(this.createdAt);
  }
});

Template.Incidents.events({
  'submit .getDate': function (event, template ) {
    event.preventDefault();

    const target = event.target;
    const from = target.from.value;
    const to = target.to.value;

    template.state.set( 'from', from );
    template.state.set( 'to', to );
    

  },
  'click .clear': function (event, template) {
    
    template.state.set( 'from', null );
    template.state.set( 'to', null );
  },
  'click .print': function() {
    let from = Template.instance().state.get( 'from' );
    let to = Template.instance().state.get( 'to' );
    let all;
    
    if(from == null || to == null || from == '' || to == '') {
      all = "Print All";
    } else {
      all = "From: " + from + "  To: " + to;
    }

    let append = "<p>******************************************* NOTHING FOLLOWS *******************************************</p><h5>Prepare By:<br />";

    $("#myElementId").print({
      globalStyles: true,
      mediaPrint: true,
      stylesheet: './index.css',
      noPrintSelector: ".no-print",
      iframe: false,
      append: append + "" + Meteor.user().profile.lname + ", " + Meteor.user().profile.fname + "</h5>",
      prepend: "<h3>Locale: " + Meteor.user().profile.local + "<br>" + "Department: " + Meteor.user().roles[1] + " <br /></h3>",
      manuallyCopyFormValues: true,
      deferred: $.Deferred(),
      title: all,
      doctype: '<!doctype html>'
    });
  }
});