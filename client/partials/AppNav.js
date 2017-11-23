import toastr from 'toastr';

Template.AppNav.events({
  'click .logout': () => {
    Meteor.logout(function (error, result) {
      if (error) {
        toastr.warning('Logout failed.');
      } else {
        toastr.success('User succesfully logout.');
        FlowRouter.go('/');
      }
    });
  }
});
