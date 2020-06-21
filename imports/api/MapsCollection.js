import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Markers = new Mongo.Collection('incident');

if (Meteor.isServer) {
  Meteor.publish('markers_collection', function mapsPublication() {
    return Markers.find({});
  });

  Meteor.publish('users-rescue_collection', function () {
    return Meteor.users.find({});
  });
}

Meteor.methods({
  'markers.insert'(userId, lat, lng, imageUrl, city, address, rescue) {
    Markers.insert({
      lat: lat,
      lng: lng,
      userId: userId,
      local: city,
      respondent: [city],
      address: address,
      imageUrl: imageUrl,
      icon: '/red-circle.png',
      incidentType: [rescue],
      createdAt: new Date(),
    });
  },
  'markers.sendHelp'(id, local, icon) {
    Markers.update(id, {
      $set: { icon: icon, help: local },
      $addToSet: {
        respondent: local,
      },
    });
  },
  'markers.sendBackup'(id, local, icon) {
    Markers.update(id, {
      $set: { icon: icon },
      $addToSet: {
        respondent: local,
        backup: local,
      },
    });
  },
  'markers.update'(id, lat, lng) {
    Markers.update(id, {
      $set: {
        lat: lat,
        lng: lng,
      },
    });
  },
  'markers.update.icon'(id, icon) {
    Markers.update(id, {
      $set: {
        icon: icon,
      },
    });
  },
  'markers.addRescue'(id, unit) {
    Markers.update(id, {
      $addToSet: {
        incidentType: unit,
      },
    });
  },
  'markers.responded'(id) {
    Markers.update(id, { $set: { status: 'Responded' } });
  },
  'markers.arrive'(id, userId, unit, icon) {
    if (unit == 'Hospital') {
      Markers.update(
        { _id: id, 'Hospital.userId': userId },
        { $set: { 'Hospital.$.status': 'Arrived', icon: icon } }
      );
    } else if (unit == 'Fire') {
      Markers.update(
        { _id: id, 'Fire.userId': userId },
        { $set: { 'Fire.$.status': 'Arrived', icon: icon } }
      );
    } else if (unit == 'Police') {
      Markers.update(
        { _id: id, 'Police.userId': userId },
        { $set: { 'Police.$.status': 'Arrived', icon: icon } }
      );
    }
  },
  'markers.rescue'(id, userId, name, local, unit, icon) {
    if (unit == 'Hospital') {
      let a = Markers.findOne({
        $and: [{ _id: id }, { Hospital: { $exists: true } }],
      });

      if (a == undefined) {
        Markers.update(id, {
          $set: { icon: icon },
          $addToSet: {
            Hospital: { userId, name, local, status: 'Going' },
          },
        });
      }
    } else if (unit == 'Fire') {
      let a = Markers.findOne({
        $and: [{ _id: id }, { Fire: { $exists: true } }],
      });

      if (a == undefined) {
        Markers.update(id, {
          $set: { icon: icon },
          $addToSet: {
            Fire: { userId, name, local, status: 'Going' },
          },
        });
      }
    } else if (unit == 'Police') {
      let a = Markers.findOne({
        $and: [{ _id: id }, { Police: { $exists: true } }],
      });

      if (a == undefined) {
        Markers.update(id, {
          $set: { icon: icon },
          $addToSet: {
            Police: { userId, name, local, status: 'Going' },
          },
        });
      }
    } else if (unit == 'DRRM') {
      let a = Markers.findOne({
        $and: [{ _id: id }, { Drrm: { $exists: true } }],
      });

      if (a == undefined) {
        Markers.update(id, {
          $set: { icon: icon },
          $addToSet: {
            Drrm: { userId, name, local, status: 'Going' },
          },
        });
      }
    }
  },
  'markers.remove.rescue'(id, userId, unit) {
    if (unit == 'Hospital') {
      Markers.update(id, {
        $pull: {
          Hospital: userId,
        },
      });
    } else if (unit == 'Fire Protection') {
      Markers.update(id, {
        $pull: {
          Fire: userId,
        },
      });
    } else if (unit == 'Police') {
      Markers.update(id, {
        $pull: {
          Police: userId,
        },
      });
    }
  },
});
