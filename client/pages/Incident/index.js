import { Markers } from '../../../imports/api/MapsCollection.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import moment from 'moment';
import toastr from 'toastr';

Template.myList.onCreated(function () {
  this.pagination = new Meteor.Pagination(Markers, {
      sort: {
          _id: -1
      }
  });
});

Template.myList.helpers({
  isReady: function () {
      return Template.instance().pagination.ready();
  },
  templatePagination: function () {
      return Template.instance().pagination;
  },
  documents: function () {
      return Template.instance().pagination.getPage();
  },
  // optional helper used to return a callback that should be executed before changing the page
  clickEvent: function() {
      return function(e, templateInstance, clickedPage) {
          e.preventDefault();
          console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
      };
  }
});


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
  Meteor.subscribe('markers_collection')
});

Template.Incidents.helpers({
  markers: function () {
    let from = Template.instance().state.get( 'from' );
    let to = Template.instance().state.get( 'to' );
    if(from == null || to == null || from == '' || to == '') {
      return Markers.find({});
    } else {
      return Markers.find({'createdAt': {
        '$gte': new Date(from),
        '$lte': new Date(to)
      }
      });
    }
  },
  hospital: function () {
    return ((this.Hospital) ? this.Hospital.length : 0)
  },
  police: function () {
    return ((this.Police) ? this.Police.length : 0)
  },
  fire: function () {
    return ((this.Fire) ? this.Fire.length : 0)
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
    target.to.value='';
    target.from.value='';

  },
  'click .clear': function (event, template) {

    template.state.set( 'from', null );
    template.state.set( 'to', null );
  }
});
