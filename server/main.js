import { Meteor } from 'meteor/meteor';
import '../imports/api/RescueCollection.js';
import '../imports/api/MapsCollection.js';

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
});
