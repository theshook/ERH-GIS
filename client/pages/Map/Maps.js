import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Markers } from '../../../imports/api/MapsCollection.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import moment from 'moment';
import toastr from 'toastr';
import Legend from './Legend.js';

var MAP_ZOOM = 15;
var markers = {};

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

Template.Maps.onCreated(function() {
  Meteor.subscribe('markers_collection');
  Meteor.subscribe('users-rescue-team_collection');

    GoogleMaps.ready('map', function(map) {
    Legend();
    map.instance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    google.maps.event.addListener(map.instance, 'click', function(event) {
      // Meteor.call('markers.insert', event.latLng.lat(), event.latLng.lng(), 'Calasiao');
    });

    // The code shown below goes here

    var infowindow = new google.maps.InfoWindow();
    

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
            let marky = Markers.findOne({_id: marker.id});

            let date, local, address, hospital, image;
            date = newDate(marky.createdAt);
            local = marky.local
            address = marky.address
            hospital = ((marky.Hospital) ? marky.Hospital.length : 0)
            fire = ((marky.Fire) ? marky.Fire.length : 0)
            police = ((marky.Police) ? marky.Police.length : 0)
            image = marky.imageUrl

            Session.set('imageUrl', image);
            Session.set('address', address);

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
                '<button class="btn btn-outline-warning rFire">I need Fire Unit</button>'+
                '<button class="btn btn-outline-info rPolice">I need Police Unit</button>'+
                '<button class="btn btn-outline-danger rHospital">I need Hospital Unit</button>'+
                // '<button class="btn btn-outline-primary response">Go to this incident</button>'+
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
          if (type == 'Hospital') {
            icon = '/firstaid.png';
          } else if (type == 'Police') {
            icon = '/police.png';
          } else if (type == 'Fire Protection') {
            icon = '/firemen.png';
          }
           var marker = new google.maps.Marker({
            draggable: false,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(document.lat, document.lng),
              map: map.instance,
              icon: icon,
              id: document._id
            });
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
    });
  });

Template.Maps.events({
  'click .backup'() {
    markers['rMYEfn3N6ncz3bNde'].icon = '/grn-circle.png'
    Meteor.call('markers.update.icon', 'rMYEfn3N6ncz3bNde', '/grn-circle.png')
  },
  'click .rFire'() {
    Meteor.call('serverNotification', 'Fire Unit', Session.get('address'), Session.get('imageUrl'))
    toastr.success('Succesfully send');
  },
  'click .rPolice'() {
    Meteor.call('serverNotification', 'Police Unit', Session.get('address'), Session.get('imageUrl'))
    toastr.success('Succesfully send');
  },
  'click .rHospital'() {
    Meteor.call('serverNotification', 'Hospital Unit', Session.get('address'), Session.get('imageUrl'))
    toastr.success('Succesfully send');
  },
});

Template.Maps.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function() {
    var latLng = Geolocation.latLng();
    // Initialize the map once we have the latLng.
    if (GoogleMaps.loaded() && latLng) {

      return {
        center: new google.maps.LatLng(15.8949, 120.2863),
        zoom: 10
      };
    }
  }
});
