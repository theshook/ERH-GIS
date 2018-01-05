import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';

if (Meteor.isClient) {
  Accounts.onLogin(function() {
    Session.set("MeteorToys_display", true);
  });

  Accounts.onLogout(function() {
    FlowRouter.go('home');
  });
}

FlowRouter.triggers.enter([function(context, redirect){
  if(!Meteor.userId()) {
      if (Roles.userIsInRole(Meteor.userId(), 'Rescue Unit'))
      {
        FlowRouter.go('mapsRescueTeam')
      } else {
        FlowRouter.go('home')
      }
  }
}]);

// Home Page
FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Home"});
    }
});

// dashboard Page
FlowRouter.route('/dashboard', {
    name: 'dashboard',
    action() {
        BlazeLayout.render("AppLayout", {main: "Dashboard"});
    }
});

// Maps Page
FlowRouter.route('/maps', {
    name: 'maps',
    action() {
        BlazeLayout.render("AppLayout", {main: "Maps"});
    }
});

// Maps Page
FlowRouter.route('/incidents/', {
    name: 'incidents',
    action() {
        BlazeLayout.render("AppLayout", {main: "Incidents"});
    }
});

// Maps Page
FlowRouter.route('/maps/rescueTeam', {
    name: 'mapsRescueTeam',
    action() {
        BlazeLayout.render("MainLayout", {main: "RescueMaps"});
    }
});

// Rescue Page
FlowRouter.route('/rescue', {
  name: 'rescue',
  action() {
      BlazeLayout.render("AppLayout", {main: "Rescueindex"});
  }
});

// Admin Users
var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin'
});

FlowRouter.route('/users', {
  name: 'users',
  action() {
      BlazeLayout.render("AppLayout", {main: "Users"});
  }
});
