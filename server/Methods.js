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
  rstPassword(id, password) {
    Accounts.setPassword(id, password);
  },
  createNewUser(user) {
    try {
      var id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: {
          fname: user.fname,
          lname: user.lname,
          local: user.local
        }
      });

      if (user.userType == 'Rescue Unit') {
        Rescue_Team.insert({
          userId: id,
          type: user.dept,
          plate: '',
          lat: '',
          long: '',
          createdAt: new Date()
        });
      }

      Roles.addUsersToRoles(id, [user.userType, user.dept]);
      return 'User succesfully created';
    } catch (e) {
      return 'There are some error encountered.';
    }
  },
  UpdateUser(id, user) {
    try {
      const newProfile = {
        fname: user.fname,
        lname: user.lname,
        local: user.local
      };
      Meteor.users.update(id, {
        $set: {
          'emails.0.address': user.email,
          profile: newProfile
        }
      });

      if (user.userType == 'Rescue Unit') {
        const newProfile = {
          fname: user.fname,
          lname: user.lname,
          local: user.local,
          plate: user.plate
        };
        Meteor.users.update(id, {
          $set: {
            profile: newProfile
          }
        });
      }

      Roles.setUserRoles(id, [user.userType, user.dept]);
      return 'User succesfully updated';
    } catch (e) {
      return e;
    }
  },
  'login.info'(id, lt, lg, stats) {
    let status = stats;
    let lat = lt;
    let lng = lg;
    try {
      Meteor.users.update(id, {
        $set: {
          status: status,
          lat,
          lng
        }
      });
    } catch (e) {
      console.warn(e);
    }
  },
  'user.status'(id, stats) {
    let status = stats;
    Meteor.users.update(id, {
      $set: {
        status: status
      }
    });
  },
  going(id, status) {
    try {
      Meteor.users.update(id, {
        $set: {
          going: status
        }
      });
    } catch (e) {
      console.warn(e);
    }
  },
  directionsList(id, directions) {
    try {
      Meteor.users.update(id, {
        $set: {
          directions: {
            origin: { lat: directions.lt, lng: directions.lg },
            destination: { lat: directions.lat, lng: directions.lng }
          }
        }
      });
    } catch (e) {
      console.warn(e);
    }
  },
  'users.location'(id, lat, lng) {
    Meteor.users.update(id, {
      $set: {
        lat,
        lng
      }
    });
  }
});
