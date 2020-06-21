import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Markers } from '../../../imports/api/MapsCollection.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import moment from 'moment';
import toastr from 'toastr';
import Legend from './Legend.js';
import { Session } from 'meteor/session';

var MAP_ZOOM = 10;
var directionsService;
var directionsDisplay;
var directions = {};
var infowindow;
let markerId1;

if (Meteor.isClient) {
  Meteor.startup(function () {
    GoogleMaps.load({ key: 'AIzaSyCAtwKrWurgTFig4deBs9Kr-k1msKsnHAI' });
  });
}

newDate = function (val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return 'Never';
  }
};

var rad = function (x) {
  return (x * Math.PI) / 180;
};

var getDistance = function (p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) *
      Math.cos(rad(p2.lat())) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

Template.RescueMaps.onCreated(function () {
  var self = this;
  Meteor.subscribe('markers_collection');
  Meteor.subscribe('users-rescue-team_collection');

  // let user = Meteor.users.find({_id: Meteor.userId()}).fetch();

  GoogleMaps.ready('map', function (map) {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
    directionsDisplay.setMap(map.instance);
    // Get users location
    // Create and move the marker when latLng changes.
    self.autorun(function () {
      var latLng = Geolocation.latLng();
      if (latLng) {
        Meteor.call(
          'login.info',
          Meteor.userId(),
          latLng.lat,
          latLng.lng,
          true
        );
      }
    });

    // Legend();
    // map.instance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

    google.maps.event.addListener(map.instance, 'click', function (event) {
      // Meteor.call('markers.insert', {lat: event.latLng.lat(), lng: event.latLng.lng()});
    });

    // The code shown below goes here
    infowindow = new google.maps.InfoWindow({ maxWidth: 300 });
    var markers = {};
    let type = Meteor.user().roles[1] + ' Unit';

    // START
    Markers.find({
      $and: [
        { incidentType: type },
        { respondent: Meteor.user().profile.local },
      ],
    }).observe({
      added: function (document) {
        var marker = new google.maps.Marker({
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          icon: document.icon,
          id: document._id,
        });

        // toastr.warning("New Incident has been added");
        google.maps.event.addListener(marker, 'click', function (event) {
          // Meteor.call('markers.update', marker.id, {lat: event.latLng.lat(), lng: event.latLng.lng()});
          let userDept = Meteor.user().roles[1];
          let userId = Meteor.userId();

          let marky = Markers.findOne({ _id: marker.id });

          let date, local, address, hospital, image, help, backup;
          date = newDate(marky.createdAt);
          local = marky.local;
          address = marky.address;
          hospital = marky.Hospital ? marky.Hospital.length : 0;
          fire = marky.Fire ? marky.Fire.length : 0;
          police = marky.Police ? marky.Police.length : 0;
          image = marky.imageUrl;

          help = marky.help ? marky.help : 'None';
          backup = marky.backup ? marky.backup : 'None';

          Session.set('lat', marky.lat);
          Session.set('lng', marky.lng);
          Session.set('markerId', marker.id);
          Session.set('imageUrl', image);
          Session.set('address', address);
          Session.set('icon', marky.icon);

          let response = '';
          let rescueUnit = '';

          if (help == Meteor.user().profile.local) {
            response =
              '<button class="btn float-left btn-outline-primary response">Go to this incident</button><br>';
            rescueUnit =
              '<button class="btn float-left btn-outline-warning rFire">I need Fire Unit</button><br><button class="btn float-left btn-outline-info rPolice">I need Police Unit</button><br><button class="btn float-left btn-outline-danger rHospital">I need Hospital Unit</button><br>button><br><button class="btn float-left btn-outline-primary drrm">I need DRRM</button><br>';
          } else if (backup.length >= 1) {
            for (var i = 0; i < backup.length; i++) {
              if (backup[i] == Meteor.user().profile.local || help != 'None') {
                response =
                  '<button class="btn float-left btn-outline-primary response">Go to this incident</button><br>';
                rescueUnit = '';
                break;
              } else {
                response =
                  '<button class="btn float-left btn-outline-primary response">Go to this incident</button><br>';
                rescueUnit =
                  '<button class="btn float-left btn-outline-warning rFire">I need Fire Unit</button><br><button class="btn float-left btn-outline-info rPolice">I need Police Unit</button><br><button class="btn float-left btn-outline-danger rHospital">I need Hospital Unit</button><br><button class="btn float-left btn-outline-primary drrm">I need DRRM</button><br>';
              }
            }
          }

          infowindow.setContent(
            '<div class="container">' +
              '<div class="row align-items-start">' +
              '<div class="col-md-12">' +
              '<h4 class="text-info">Date: ' +
              date +
              '</h4>' +
              '<h6 class="text-info text-justify text-left">Local: ' +
              local +
              '</h6>' +
              '<h6 class="text-info text-left">Address: ' +
              address +
              '</h6>' +
              '<h6 class="text-left">Help Unit: ' +
              help +
              '</h5>' +
              '<h6 class="text-left">Backup Unit: ' +
              backup +
              '</h5>' +
              '<h6 class="text-primary text-left">Rescue Unit will go</h6>' +
              '<h6 class="text-primary text-left">Fire Unit: ' +
              fire +
              ' </h6>' +
              '<h6 class="text-primary text-left">Police Unit: ' +
              police +
              ' </h6>' +
              '<h6 class="text-primary text-left">First Aid Unit: ' +
              hospital +
              ' </h6>' +
              '</div>' +
              '<div class="col-md-12">' +
              response +
              rescueUnit +
              '</div>' +
              '<div class="col-md-12">' +
              '<img src="' +
              image +
              '" class="float-left" height="250" width="250"/>' +
              '</div>' +
              '</div>' +
              '</div>'
          );

          infowindow.open(map, marker);
        });
        markers[document._id] = marker;
      },
      changed: function (newDocument, oldDocument) {
        markers[newDocument._id].setIcon(newDocument.icon);
      },
      removed: function (oldDocument) {
        // Remove the marker from the map
        markers[oldDocument._id].setMap(null);

        // Clear the event listener
        google.maps.event.clearInstanceListeners(markers[oldDocument._id]);

        // Remove the reference to this marker instance
        delete markers[oldDocument._id];
      },
    });
    // END

    Meteor.users.find({ status: true }).observe({
      added: function (document) {
        let icon;
        let type = document.roles[1];
        if (Meteor.userId() == document._id) {
          icon = '/my-location.png';
        } else if (type == 'Hospital') {
          icon = '/firstaid.png';
        } else if (type == 'Police') {
          icon = '/police.png';
        } else if (type == 'Fire') {
          icon = '/firemen.png';
        } else if (type == 'DRRM') {
          icon = '/drrm.png';
        }
        var marker = new google.maps.Marker({
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          icon: icon,
          id: document._id,
        });

        if (Meteor.userId() === document._id) {
          let from = new google.maps.LatLng(Geolocation.latLng());
          let to = new google.maps.LatLng(
            document.directions.destination.lat,
            document.directions.destination.lng
          );
          var request = {
            origin: from,
            destination: to,
            travelMode: 'DRIVING',
          };

          directionsService.route(request, function (response, status) {
            if (status == 'OK') {
              directionsDisplay.setDirections(response);
              infowindow.close();
              directions[document._id] = request;
            }
          });
        }

        // toastr.warning("New Incident has been added");
        google.maps.event.addListener(marker, 'click', function (event) {
          // Meteor.call('login.info', marker.id, event.latLng.lat(), event.latLng.lng(), true);
          let marky = Meteor.users.find({ _id: marker.id }).fetch();
          infowindow.setContent(
            '<h3 class="text-info">' +
              marky[0].profile.lname +
              ', ' +
              marky[0].profile.fname +
              '</h3>' +
              '<h3>' +
              marky[0].profile.local +
              '</h3>' +
              '<h3>' +
              marky[0].roles[1] +
              ' Unit</h3>'
          );
          infowindow.open(map, marker);
          // console.log(marker.id)
        });

        google.maps.event.addListener(marker, 'dragend', function (event) {
          Meteor.call(
            'users.location',
            marker.id,
            event.latLng.lat(),
            event.latLng.lng()
          );
        });

        markers[document._id] = marker;
      },
      changed: function (newDocument, oldDocument) {
        markers[newDocument._id].setPosition({
          lat: newDocument.lat,
          lng: newDocument.lng,
        });
        if (Meteor.userId() === newDocument._id) {
          let from = new google.maps.LatLng(newDocument.lat, newDocument.lng);
          let to = new google.maps.LatLng(
            newDocument.directions.destination.lat,
            newDocument.directions.destination.lng
          );
          var request = {
            origin: from,
            destination: to,
            travelMode: 'DRIVING',
          };

          directionsService.route(request, function (response, status) {
            if (status == 'OK') {
              let distance = response.routes[0].legs[0].distance.value;
              directionsDisplay.setDirections(response);
              infowindow.close();
              directions[newDocument._id] = request;
              Meteor.call('directionsList', Meteor.userId(), {
                lt: Meteor.user().lat,
                lg: Meteor.user().lng,
                lat: newDocument.directions.destination.lat,
                lng: newDocument.directions.destination.lng,
              });
              if (distance <= 30) {
                // console.log('Okay!')
                Meteor.call(
                  'markers.arrive',
                  markerId1,
                  Meteor.userId(),
                  Meteor.user().roles[1],
                  '/grn-circle.png'
                );
              }
            }
          });
        }
      },
      removed: function (oldDocument) {
        // Remove the marker from the map
        markers[oldDocument._id].setMap(null);

        // Clear the event listener
        google.maps.event.clearInstanceListeners(markers[oldDocument._id]);

        // Remove the reference to this marker instance
        delete markers[oldDocument._id];
      },
    });

    // Location & Directions button
    function CenterControl(controlDiv, map) {
      // We set up a variable for this since we're adding event listeners
      // later.
      var control = this;

      // Set CSS for the control border
      var goCenterUI = document.createElement('div');
      goCenterUI.id = 'goCenterUI';
      goCenterUI.title = 'Click to get my location';
      controlDiv.appendChild(goCenterUI);

      // Set CSS for the control interior
      var goCenterText = document.createElement('div');
      goCenterText.id = 'goCenterText';
      goCenterText.innerHTML = 'Get My Location';
      goCenterUI.appendChild(goCenterText);

      // Set CSS for the setCenter control border
      var setCenterUI = document.createElement('div');
      setCenterUI.id = 'setCenterUI';
      setCenterUI.title = 'Click to clear directions';
      controlDiv.appendChild(setCenterUI);

      // Set CSS for the control interior
      var setCenterText = document.createElement('div');
      setCenterText.id = 'setCenterText';
      setCenterText.innerHTML = 'Clear Directions';
      setCenterUI.appendChild(setCenterText);

      // Set up the click event listener for 'Center Map': Set the center of
      // the map
      // to the current center of the control.
      goCenterUI.addEventListener('click', function () {
        map.instance.setCenter(Geolocation.latLng());
      });

      // Set up the click event listener for 'Set Center': Set the center of
      // the control to the current center of the map.
      setCenterUI.addEventListener('click', function () {
        directionsDisplay.setDirections({ routes: [] });
        Meteor.call('directionsList', Meteor.userId(), {});
      });
    }

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    centerControlDiv.style['padding-top'] = '10px';
    map.instance.controls[google.maps.ControlPosition.TOP_CENTER].push(
      centerControlDiv
    );
  });
});

Template.RescueMaps.events({
  'click .response'() {
    let from = new google.maps.LatLng(Geolocation.latLng());
    let to = new google.maps.LatLng(Session.get('lat'), Session.get('lng'));
    var request = {
      origin: from,
      destination: to,
      travelMode: 'DRIVING',
    };

    directionsService.route(request, function (response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
        infowindow.close();
        Meteor.call('directionsList', Meteor.userId(), {
          lt: Meteor.user().lat,
          lg: Meteor.user().lng,
          lat: Session.get('lat'),
          lng: Session.get('lng'),
        });
        Meteor.call(
          'markers.rescue',
          Session.get('markerId'),
          Meteor.userId(),
          Meteor.user().profile.lname + ', ' + Meteor.user().profile.fname,
          Meteor.user().profile.local,
          Meteor.user().roles[1],
          '/backup.png'
        );
        markerId1 = Session.get('markerId');
      }
    });

    infowindow.close();
  },
  'click .unresponse'() {
    directionsDisplay.setDirections({ routes: [] });
    Meteor.call('directionsList', Meteor.userId(), {});
    Meteor.call(
      'markers.remove.rescue',
      Session.get('markerId'),
      Meteor.userId(),
      Meteor.user().roles[1]
    );
    infowindow.close();
  },
  'click .rFire'() {
    Meteor.call('markers.addRescue', Session.get('markerId'), 'Fire Unit');
    Meteor.call('markers.update.icon', Session.get('markerId'), '/ineedff.png');
    //Meteor.call('serverNotification', 'Fire Unit', Session.get('address'), Session.get('imageUrl'))
    toastr.success('Succesfully send');
  },
  'click .rPolice'() {
    Meteor.call('markers.addRescue', Session.get('markerId'), 'Police Unit');
    Meteor.call(
      'markers.update.icon',
      Session.get('markerId'),
      '/ineedpolice.png'
    );
    // Meteor.call('serverNotification', 'Police Unit', Session.get('address'), Session.get('imageUrl'))
    toastr.success('Succesfully send');
  },
  'click .drrm'() {
    Meteor.call('markers.addRescue', Session.get('markerId'), 'DRRM Unit');
    Meteor.call(
      'markers.update.icon',
      Session.get('markerId'),
      '/drrm-marker.png'
    );
    //Meteor.call('serverNotification', 'Hospital Unit', Session.get('address'), Session.get('imageUrl'))
    toastr.success('Succesfully send');
  },
  'click .rHospital'() {
    Meteor.call('markers.addRescue', Session.get('markerId'), 'Hospital Unit');
    Meteor.call(
      'markers.update.icon',
      Session.get('markerId'),
      '/ineedfirstaid.png'
    );
    //Meteor.call('serverNotification', 'Hospital Unit', Session.get('address'), Session.get('imageUrl'))
    toastr.success('Succesfully send');
  },
});

Template.RescueMaps.helpers({
  geolocationError: function () {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function () {
    var latLng = Geolocation.latLng();
    // Initialize the map once we have the latLng.
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng),
        zoom: MAP_ZOOM,
      };
    }
  },
});
