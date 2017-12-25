import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Markers } from '../../../imports/api/MapsCollection.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import moment from 'moment';
import toastr from 'toastr';
import Legend from './Legend.js';
import { Session } from 'meteor/session';

var MAP_ZOOM = 15;
var directionsService;
var directionsDisplay;
var directions = {};
var infowindow;

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({ key: 'AIzaSyCAtwKrWurgTFig4deBs9Kr-k1msKsnHAI'});
  });
}

newDate = function (val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return "Never";
  }
}


Template.RescueMaps.onCreated(function() {
  var self = this;

  Meteor.subscribe('markers_collection');
  Meteor.subscribe('users-rescue-team_collection');

  // let user = Meteor.users.find({_id: Meteor.userId()}).fetch();
  
    GoogleMaps.ready('map', function(map) {
      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
      directionsDisplay.setMap(map.instance);
      // Get users location
      // Create and move the marker when latLng changes.
    self.autorun(function() {
      var latLng = Geolocation.latLng();
      if (Meteor.status().status === "connected"){
        if (latLng) {
          Meteor.call('login.info', Meteor.userId(), latLng.lat, latLng.lng, true);
        }
      }else {
        Meteor.call('user.status', Meteor.userId(), true);
      }
      
    });
      

    
    // Legend();
    // map.instance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

    google.maps.event.addListener(map.instance, 'click', function(event) {
      // Meteor.call('markers.insert', {lat: event.latLng.lat(), lng: event.latLng.lng()});
    });

    // The code shown below goes here

    infowindow = new google.maps.InfoWindow();
    var markers = {};

    // START
    Markers.find().observe({
        added: function (document) {

         var marker = new google.maps.Marker({
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            icon: document.icon,
            id: document._id
          });

          // toastr.warning("New Incident has been added");
          google.maps.event.addListener(marker, 'click', function(event) {
            // Meteor.call('markers.update', marker.id, {lat: event.latLng.lat(), lng: event.latLng.lng()});
            let userDept = Meteor.user().roles[1];
            let userId = Meteor.userId();

            let marky = Markers.findOne({_id: marker.id});

            console.log(marky)
            let date, local, address, hospital, image;
            date = newDate(marky.createdAt);
            local = marky.local
            address = marky.address
            hospital = ((marky.Hospital) ? marky.Hospital.length : 0)
            fire = ((marky.Fire) ? marky.Fire.length : 0)
            police = ((marky.Police) ? marky.Police.length : 0)
            image = marky.imageUrl

            Session.set('lat', marky.lat);
            Session.set('lng', marky.lng);
            Session.set('markerId', marker.id);

            infowindow.setContent(
            '<div class="container">'+
            '<div class="row">'+
              '<div class="col-md-6">' +
                '<h3 class="text-info">Date: '+ date +'</h3>'+
                '<h5 class="text-info">Local: '+ local +'</h5>'+
                '<h5 class="text-info">Address: '+ address +'</h5>'+
                '<h5 class="text-primary">Rescue Unit will go</h5>'+
                '<h5 class="text-primary">Fire Unit: '+ fire +' </h5>'+
                '<h5 class="text-primary">Police Unit: '+ police +' </h5>'+
                '<h5 class="text-primary">First Aid Unit: '+ hospital +' </h5>'+
                '<button class="btn btn-outline-primary response">Go to this incident</button>'+
              '</div>'+
              '<div class="col-md-6">' +
                '<img src="' + image + '" height="300" width="300"/>'+
                
              '</div>'+
            '</div>'+
            '</div>');
            infowindow.open(map, marker);
          });

          markers[document._id] = marker;
        },
        changed: function(newDocument, oldDocument) {
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng, icon: '/blue-dot.png' });
        },
        removed: function(oldDocument) {
          // Remove the marker from the map
          markers[oldDocument._id].setMap(null);

          // Clear the event listener
          google.maps.event.clearInstanceListeners(
            markers[oldDocument._id]);

          // Remove the reference to this marker instance
          delete markers[oldDocument._id];
        }
    });
      // END      

    Meteor.users.find({status: true}).observe({
        added: function (document) {
          let icon;
          let type = document.roles[1];
          if (Meteor.userId() == document._id) {
            icon = '/my-location.png';
          } else if (type == 'Hospital') {
            icon = '/firstaid.png';
          } else if (type == 'Police') {
            icon = '/police.png';
          } else if (type == 'Fire Protection') {
            icon = '/firemen.png';
          }
           var marker = new google.maps.Marker({
            draggable: true,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(document.lat, document.lng),
              map: map.instance,
              icon: icon,
              id: document._id
            });

            if (Meteor.userId() === document._id) {
            let from = new google.maps.LatLng(Geolocation.latLng());
            let to = new google.maps.LatLng(document.directions.destination.lat, document.directions.destination.lng);
            var request = {
              origin: from,
              destination: to,
              travelMode: "DRIVING",
            };

            directionsService.route(request, function(response, status) {
              if (status == 'OK') {
                directionsDisplay.setDirections(response);
                infowindow.close();
                directions[document._id] = request;
              }
            });
            }

            // toastr.warning("New Incident has been added");
            google.maps.event.addListener(marker, 'click', function(event) {
              // Meteor.call('login.info', marker.id, event.latLng.lat(), event.latLng.lng(), true);
              let marky = Meteor.users.find({_id: marker.id}).fetch();
              infowindow.setContent(
              '<div class="container">'+
              '<div class="row">'+
                '<div class="col-md-12">' +
                  '<h3 class="text-info">'+ marky[0].profile.lname +', ' + marky[0].profile.fname +'</h3>'+
                '</div>'+
                '<div class="col-md-5">' +
                  '<h3>'+ marky[0].roles[1] +'</h3>'+
                '</div>'+
              '</div>'+
              '</div>');
              infowindow.open(map, marker);
            });
  
            markers[document._id] = marker;
          },
          changed: function(newDocument, oldDocument) {
            markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng});
          },
          removed: function(oldDocument) {
            // Remove the marker from the map
            markers[oldDocument._id].setMap(null);
  
            // Clear the event listener
            google.maps.event.clearInstanceListeners(
              markers[oldDocument._id]);
  
            // Remove the reference to this marker instance
            delete markers[oldDocument._id];
          }
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
      goCenterUI.addEventListener('click', function() {
        map.instance.setCenter(Geolocation.latLng());
      });

      // Set up the click event listener for 'Set Center': Set the center of
      // the control to the current center of the map.
      setCenterUI.addEventListener('click', function() {
        directionsDisplay.setDirections({routes: []});
        Meteor.call('directionsList', Meteor.userId(), {});
      });
    }


    // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        centerControlDiv.style['padding-top'] = '10px';
        map.instance.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);



  });
});

Template.RescueMaps.events({
  'click .response'() {
    Meteor.call('markers.rescue', Session.get('markerId'), Meteor.userId(), Meteor.user().roles[1])

    let from = new google.maps.LatLng(Geolocation.latLng());
    let to = new google.maps.LatLng(Session.get('lat'), Session.get('lng'));
    var request = {
      origin: from,
      destination: to,
      travelMode: "DRIVING",
    };

    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
        infowindow.close();
        Meteor.call('directionsList', Meteor.userId(), {lt:Meteor.user().lat, lg:Meteor.user().lng, lat: Session.get('lat'), lng:Session.get('lng')});
      }
    });

    infowindow.close();
  }
});

Template.RescueMaps.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function() {
    var latLng = Geolocation.latLng();
    // Initialize the map once we have the latLng.
    if (GoogleMaps.loaded() && latLng) {

      return {
        center: new google.maps.LatLng(latLng),
        zoom: MAP_ZOOM
      };
    }
  }
});
