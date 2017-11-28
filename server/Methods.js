import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import toastr from 'toastr';

// Publish for rescue team
import { Rescue_Team } from '../imports/api/RescueCollection.js';

Meteor.methods({
  toggleAdmin(id) {
    if (Roles.userIsInRole(id, 'admin')) {
      Roles.removeUsersFromRoles(id, 'admin');
    } else {
      Roles.addUsersToRoles(id, 'admin');
    }
  },
  'createNewUser'(user) {
    try{
      var id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: {
          fname: user.fname,
          lname: user.lname,
          local: user.local,
        }
      });

      if (user.userType == 'Rescue Unit') {
        Rescue_Team.insert({
          userId: id,
          type: user.dept,
          plate: '',
          lat: '',
          long: '',
          createdAt: new Date(),
        });
      }

      Roles.addUsersToRoles(id, [user.userType, user.dept]);
      return 'User succesfully created';
    } catch(e) {
      return 'There are some error encountered.';
    }
  },
  'UpdateUser'(id, user) {
    try{
      const newProfile = {
        fname: user.fname,
        lname: user.lname,
        local: user.local
      }
        Meteor.users.update(id, {
          $set: {
            'emails.0.address': user.email,
            profile: newProfile
        }});

        if (user.userType == 'Rescue Unit') {
          let count = Rescue_Team.find({userId: id}).count();
          if( count == 1) {
            Rescue_Team.update(userId: id, {
              $set: {
              type: user.dept,
              plate: user.plate,
              lat: '',
              long: '',
              createdAt: new Date(),
            }});
          } else {
            Rescue_Team.insert({
              userId: id,
              type: user.dept,
              plate: user.plate,
              lat: '',
              long: '',
              createdAt: new Date(),
            });
          }
        }

      Roles.setUserRoles(id, [user.userType, user.dept]);
      return 'User succesfully updated';
    } catch(e) {
      return e;
    }
  }
});
