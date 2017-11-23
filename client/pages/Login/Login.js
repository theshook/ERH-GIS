import toastr from 'toastr';

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
        FlowRouter.go('dashboard');
      }
    });
  }
});
