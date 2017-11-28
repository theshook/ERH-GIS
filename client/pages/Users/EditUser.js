import toastr from 'toastr';

Template.EditUser.helpers({
  editMode: function () {
    return Session.get('currentUser');
  },
  rescueUnit: function() {
    return ( Roles.userIsInRole(this._id, 'Rescue Unit'));
  },
  userEmail: function () {
    return this.emails[0].address;
  },
  UserType: function (curUserType) {
    return this.roles[0] == curUserType ? "selected" : null;
  },
  UserDept: function (curUserType) {
    return this.roles[1] == curUserType ? "selected" : null;
  }
});

Template.EditUser.events({
  'submit .edit-user-form': function (event) {
    event.preventDefault();

      const target = event.target;
      const fname = target.fname.value;
      const email = target.email.value;
      const lname = target.lname.value;
      const local = target.local.value;
      const dept = target.dept.value;
      const userType = target.userType.value;

      if (userType == 'Rescue Unit') {
        const plate = target.plate.value;
          if (checkString(plate)) {
            return toastr.warning("Kindly fill up all fields.");
          }
      }

      if (checkString(email) || checkString(fname) || checkString(lname) || checkString(local)) {
        return toastr.warning("Kindly fill up all fields.");
      }

      if (Roles.userIsInRole(Meteor.userId(), 'Admin')) {
        Meteor.call('UpdateUser', this._id, {fname, email, lname, local, dept, userType, plate},
        function (error, result) {
          if (result) {
            toastr.success('User succesfully updated.');
            return Session.set('currentUser', '');
          } else {
            toastr.warning('There are some error encountered.');
          }
        });
      } else {
        return toastr.warning("You don't have credentials to edit users data. Kindly contact administrator.");
      }
    },
});
