import { Meteor } from 'meteor/meteor';
import '../imports/api/RescueCollection.js';
import { Markers } from '../imports/api/MapsCollection.js';

import './Methods.js';
import './publish.js';

Meteor.startup(() => {
  // code to run on server at startup
  // if(Meteor.users.find().count() < 25){
  //   _.each(_.range(25), function(){
  //     var randomEmail = faker.internet.email();
  //     var firstName = faker.name.firstName();
  //     var lastName = faker.name.lastName();
  //     Accounts.createUser({
  //       profile: {
  //         fname: firstName,
  //         lname: lastName,
  //       },
  //       email: randomEmail,
  //       password: 'password'
  //     });
  //   });
  // }

  // if(Markers.find().count() < 25){
  //   _.each(_.range(25), function(){
  //     var lat, lng, city, address, imageUrl;
  //     lat = faker.address.latitude();
  //     lng = faker.address.longitude();
  //     city = faker.address.city();
  //     address = faker.address.secondaryAddress();
  //     imageUrl = faker.image.imageUrl();

  //     Markers.insert({
  //       lat: lat,
  //       lng: lng,
  //       userId: '',
  //       local: city,
  //       address: address,
  //       imageUrl: imageUrl,
  //       icon: '/red-circle.png',
  //       incidentType: '',
  //       injured: '',
  //       died: '',
  //       createdAt: new Date
  //     });

  //   });
  // }
});
