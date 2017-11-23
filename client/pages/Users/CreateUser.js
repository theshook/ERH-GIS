import toastr from 'toastr';

Template.CreateUser.events({
  'submit .create-user-form': function (event) {
    event.preventDefault();

    const target = event.target;
    const email = target.email.value;
    const password = target.password.value;
    const fname = target.fname.value;
    const lname = target.lname.value;
    const local = target.local.value;
    const dept = target.dept.value;
    const userType = target.userType.value;

    if (checkString(email) || checkString(fname) ||
        checkString(lname) || checkString(local) || checkString(password)) {
      return toastr.warning("Kindly fill up all fields.");
    }


      Meteor.call('createNewUser', {email, password, fname, lname, local, dept, userType},
      function (error, result) {
        if (result) {
          toastr.success('User succesfully created.');
          console.log(result);
        } else {
          toastr.warning('There are some error encountered.');
        }
      });
    

  }
});
