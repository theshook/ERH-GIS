import toastr from 'toastr';

Template.Header.events({
  'click .logout': () => {
    Meteor.call('login.info', Meteor.userId(), null, null,false);
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