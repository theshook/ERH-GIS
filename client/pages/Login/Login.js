import toastr from 'toastr';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Login.events({
  'submit .login-form': function (event) {
    event.preventDefault();
    const target = event.target;
    const email = target.email.value;
    const password = target.password.value;

    Meteor.loginWithPassword(email, password, function (error, result) {
      if (error) {
        toastr.warning('Login failed.');
      } else {
        toastr.success('User succesfully login.');
        if (Roles.userIsInRole(Meteor.userId(), 'Rescue Unit'))
        {
          FlowRouter.go('mapsRescueTeam')
        } else {
          FlowRouter.go('dashboard');
        }
      }
    });
  }
});
