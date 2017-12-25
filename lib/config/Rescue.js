import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
// import { Rescue_Team } from '/imports/api/RescueCollection.js';

new Tabular.Table({
  name: "RescueUnit",
  collection: Meteor.users,
  selector: function () {
    return {'roles.0': 'Rescue Unit'};
  },
  columns: [
    {data: "emails[0].address", title: "Email"},
    {data: "profile.fname", title: "First Name"},
    {data: "profile.lname", title: "Last Name"},
    // {data: "profile.plate", title: "Plate Number"},
    {data: 'roles.1', title: "Department"},
    {data: "profile.local", title: "Locality"},
    {
      data: "createdAt",
      title: "Created At",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).calendar();
        } else {
          return "Never";
        }
      }
    }
    // ,
    // {
    //   tmpl: Meteor.isClient && Template.RescueActionBtns
    // }
  ],
  responsive: true,
  autoWidth: false,
});