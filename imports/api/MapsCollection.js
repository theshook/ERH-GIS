import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Markers = new Mongo.Collection('incident');

if (Meteor.isServer) {
  Meteor.publish('markers_collection', function mapsPublication() {
    return Markers.find({});
  });
}

Meteor.methods({
  'markers.insert' (lat, lng, imageUrl) {
    Markers.insert({
      lat: lat,
      lng: lng,
      userId: '',
      address: '',
      imageUrl: imageUrl,
      incidentType: '',
      injured: '',
      died: '',
    });
  },
  'markers.update' (id, lat, lng) {
    Markers.update(
      id, {
        $set: {
          lat: lat,
          lng: lng,
        }});
  }
});
