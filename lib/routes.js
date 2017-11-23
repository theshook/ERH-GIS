import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

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
    FlowRouter.go('home')
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

// Admin Users
var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin'
});

adminRoutes.route('/users', {
  name: 'users',
  action() {
      BlazeLayout.render("AppLayout", {main: "Users"});
  }
});
