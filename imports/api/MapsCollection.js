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
  'markers.insert' (lat, lng, imageUrl, city, address, rescue) {
    Markers.insert({
      lat: lat,
      lng: lng,
      userId: '',
      local: city,
      address: address,
      imageUrl: imageUrl,
      icon: '/red-circle.png',
      incidentType: [rescue],
      createdAt: new Date
    });
  },
  'markers.update' (id, lat, lng) {
    Markers.update(
      id, {
        $set: {
          lat: lat,
          lng: lng,
        }});
  },
  'markers.update.icon'(id, icon) {
    Markers.update(
      id, {
        $set: {
          icon: icon
        }});
  },
  'markers.addRescue'(id,unit) {
    Markers.update(id, {
      $addToSet: {
        'incidentType': unit
      }
    });
  },
  'markers.rescue'(id, userId, unit){
    if (unit == 'Hospital') {
      Markers.update(
        id, {
          $addToSet: {
            'Hospital': userId
          }
        }
      );
    } else if(unit == 'Fire Protection'){
      Markers.update(
        id, {
          $addToSet: {
            'Fire': userId
          }
        }
      );
    } else if (unit == 'Police') {
      Markers.update(
        id, {
          $addToSet: {
            'Police': userId
          }
        }
      );
    }

  }
});
