import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Markers } from '../../../imports/api/MapsCollection.js';
import toastr from 'toastr';
var MAP_ZOOM = 15;

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({ key: 'AIzaSyCAtwKrWurgTFig4deBs9Kr-k1msKsnHAI'});
  });
}

Template.Maps.onCreated(function() {
  Meteor.subscribe('markers_collection');

    GoogleMaps.ready('map', function(map) {
    google.maps.event.addListener(map.instance, 'click', function(event) {
      // Meteor.call('markers.insert', {lat: event.latLng.lat(), lng: event.latLng.lng()});
    });


    // The code shown below goes here

    var infowindow = new google.maps.InfoWindow();
    var markers = {};
    // START
    Markers.find().observe({
        added: function (document) {

         var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
          });
          toastr.warning("New Incident has been added");
          google.maps.event.addListener(marker, 'click', function(event) {
            // Meteor.call('markers.update', marker.id, {lat: event.latLng.lat(), lng: event.latLng.lng()});
            let marky = Markers.find({_id: marker.id}).fetch();
            infowindow.setContent(
            '<div class="container">'+
            '<div class="row">'+
              '<div class="col-md-5 offset-md-5">' +
                '<h3 class="text-danger"> Hi! </h3>'+
              '</div>'+
              '<div class="col-md-5">' +
                '<img src="' + marky[0].imageUrl + '" height="300" width="300"/>'+
              '</div>'+
            '</div>'+
            '</div>');
            infowindow.open(map, marker);
          });

          markers[document._id] = marker;
        },
        changed: function(newDocument, oldDocument) {
          console.log(newDocument);
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
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
    });
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
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: MAP_ZOOM
      };
    }
  }
});
