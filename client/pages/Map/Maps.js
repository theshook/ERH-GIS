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
var markers = {};

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

Template.Maps.onCreated(function () {
  Meteor.subscribe('markers_collection');
  Meteor.subscribe('users-rescue-team_collection');

  GoogleMaps.ready('map', function (map) {
    Legend();
    map.instance.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
    google.maps.event.addListener(map.instance, 'click', function (event) {
      // Meteor.call('markers.insert', event.latLng.lat(), event.latLng.lng(), 'Calasiao');
    });

    // The code shown below goes here

    var infowindow = new google.maps.InfoWindow();

    // START
    Markers.find({ respondent: Meteor.user().profile.local }).observe({
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
          let marky = Markers.findOne({ _id: marker.id });

          let date, local, address, hospital, image, respondent, help, backup;
          date = newDate(marky.createdAt);
          local = marky.local;
          address = marky.address;
          hospital = marky.Hospital ? marky.Hospital.length : 0;
          fire = marky.Fire ? marky.Fire.length : 0;
          police = marky.Police ? marky.Police.length : 0;
          drrm = marky.Drrm ? marky.Drrm.length : 0;
          image = marky.imageUrl;
          respondent = marky.respondent;
          help = marky.help ? marky.help : 'None';
          backup = marky.backup ? marky.backup : 'None';

          Session.set('markerId', marker.id);
          Session.set('imageUrl', image);
          Session.set('address', address);
          let buttons = '';

          let dropdown = '';

          if (help == Meteor.user().profile.local) {
            dropdown =
              '<h5 class="text-info">Select City to request a help or backup</h5>' +
              '<select name="local" class="form-control" id="local">' +
              '<option title="Agno" value="Agno">Agno</option>' +
              '<option title="Aguilar" value="Aguilar">Aguilar</option>' +
              '<option title="Alaminos" value="Alaminos">Alaminos</option>' +
              '<option title="Alcala" value="Alcala">Alcala</option>' +
              '<option title="Anda" value="Anda">Anda</option>' +
              '<option title="Asingan" value="Asingan">Asingan</option>' +
              '<option title="Balungao" value="Balungao">Balungao</option>' +
              '<option title="Bani" value="Bani">Bani</option>' +
              '<option title="Basista" value="Basista">Basista</option>' +
              '<option title="Bayambang" value="Bayambang">Bayambang</option>' +
              '<option title="Binalonan" value="Binalonan">Binalonan</option>' +
              '<option title="Binmaley" value="Binmaley">Binmaley</option>' +
              '<option title="Bolinao" value="Bolinao">Bolinao</option>' +
              '<option title="Bugallon" value="Bugallon">Bugallon</option>' +
              '<option title="Burgos" value="Burgos">Burgos</option>' +
              '<option title="Calasiao" value="Calasiao">Calasiao</option>' +
              '<option title="Dagupan" value="Dagupan">Dagupan</option>' +
              '<option title="Dasol" value="Dasol">Dasol</option>' +
              '<option title="Infanta" value="Infanta">Infanta</option>' +
              '<option title="Labrador" value="Labrador">Labrador</option>' +
              '<option title="Laoac" value="Laoac">Laoac</option>' +
              '<option title="Lingayen" value="Lingayen">Lingayen</option>' +
              '<option title="Mabini" value="Mabini">Mabini</option>' +
              '<option title="Malasiqui" value="Malasiqui">Malasiqui</option>' +
              '<option title="Manaoag" value="Manaoag">Manaoag</option>' +
              '<option title="Mangaldan" value="Mangaldan">Mangaldan</option>' +
              '<option title="Mangatarem" value="Mangatarem">Mangatarem</option>' +
              '<option title="Mapandan" value="Mapandan">Mapandan</option>' +
              '<option title="Natividad" value="Natividad">Natividad</option>' +
              '<option title="Pozorrubio" value="Pozorrubio">Pozorrubio</option>' +
              '<option title="Rosales" value="Rosales">Rosales</option>' +
              '<option title="San Carlos" value="San Carlos">San Carlos</option>' +
              '<option title="San Fabian" value="San Fabian">San Fabian</option>' +
              '<option title="San Jacinto" value="San Jacinto">San Jacinto</option>' +
              '<option title="San Manuel" value="San Manuel">San Manuel</option>' +
              '<option title="San Nicolas" value="San Nicolas">San Nicolas</option>' +
              '<option title="San Quintin" value="San Quintin">San Quintin</option>' +
              '<option title="Santa Barbara" value="Santa Barbara">Santa Barbara</option>' +
              '<option title="Santa Maria" value="Santa Maria">Santa Maria</option>' +
              '<option title="Santa Tomas" value="Santa Tomas">Santa Tomas</option>' +
              '<option title="Sison" value="Sison">Sison</option>' +
              '<option title="Sual" value="Sual">Sual</option>' +
              '<option title="Tayug" value="Tayug">Tayug</option>' +
              '<option title="Umingan" value="Umingan">Umingan</option>' +
              '<option title="Urbiztondo" value="Urbiztondo">Urbiztondo</option>' +
              '<option title="Villasis" value="Villasis">Villasis</option>' +
              '</select>' +
              '<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">' +
              '<div class="btn-group mr-2" role="group" aria-label="First group">' +
              '<button type="button" class="btn btn-outline-dark request">Help</button>' +
              '</div>' +
              '<div class="btn-group mr-2" role="group" aria-label="Second group">' +
              '<button type="button" class="btn btn-outline-dark backup">Backup</button>' +
              '</div>' +
              '</div>';

            buttons =
              '<button class="btn btn-outline-warning rFire">I need Fire    Unit</button><button class="btn btn-outline-info rPolice">I need Police   Unit</button><button class="btn btn-outline-danger rHospital">I need Hospital Unit</button><br><button class="btn float-left btn-outline-primary drrm">I need DRRM</button><br><button class="btn float-left btn-outline-primary responded">This is already responded</button><br>';
          } else if (backup.length != 1) {
            for (var i = 0; i < backup.length; i++) {
              if (backup[i] == Meteor.user().profile.local || help != 'None') {
                buttons = '';
                dropdown = '';
                break;
              } else {
                dropdown =
                  '<h5 class="text-info">Select City to request a help or backup</h5>' +
                  '<select name="local" class="form-control" id="local">' +
                  '<option title="Agno" value="Agno">Agno</option>' +
                  '<option title="Aguilar" value="Aguilar">Aguilar</option>' +
                  '<option title="Alaminos" value="Alaminos">Alaminos</option>' +
                  '<option title="Alcala" value="Alcala">Alcala</option>' +
                  '<option title="Anda" value="Anda">Anda</option>' +
                  '<option title="Asingan" value="Asingan">Asingan</option>' +
                  '<option title="Balungao" value="Balungao">Balungao</option>' +
                  '<option title="Bani" value="Bani">Bani</option>' +
                  '<option title="Basista" value="Basista">Basista</option>' +
                  '<option title="Bayambang" value="Bayambang">Bayambang</option>' +
                  '<option title="Binalonan" value="Binalonan">Binalonan</option>' +
                  '<option title="Binmaley" value="Binmaley">Binmaley</option>' +
                  '<option title="Bolinao" value="Bolinao">Bolinao</option>' +
                  '<option title="Bugallon" value="Bugallon">Bugallon</option>' +
                  '<option title="Burgos" value="Burgos">Burgos</option>' +
                  '<option title="Calasiao" value="Calasiao">Calasiao</option>' +
                  '<option title="Dagupan" value="Dagupan">Dagupan</option>' +
                  '<option title="Dasol" value="Dasol">Dasol</option>' +
                  '<option title="Infanta" value="Infanta">Infanta</option>' +
                  '<option title="Labrador" value="Labrador">Labrador</option>' +
                  '<option title="Laoac" value="Laoac">Laoac</option>' +
                  '<option title="Lingayen" value="Lingayen">Lingayen</option>' +
                  '<option title="Mabini" value="Mabini">Mabini</option>' +
                  '<option title="Malasiqui" value="Malasiqui">Malasiqui</option>' +
                  '<option title="Manaoag" value="Manaoag">Manaoag</option>' +
                  '<option title="Mangaldan" value="Mangaldan">Mangaldan</option>' +
                  '<option title="Mangatarem" value="Mangatarem">Mangatarem</option>' +
                  '<option title="Mapandan" value="Mapandan">Mapandan</option>' +
                  '<option title="Natividad" value="Natividad">Natividad</option>' +
                  '<option title="Pozorrubio" value="Pozorrubio">Pozorrubio</option>' +
                  '<option title="Rosales" value="Rosales">Rosales</option>' +
                  '<option title="San Carlos" value="San Carlos">San Carlos</option>' +
                  '<option title="San Fabian" value="San Fabian">San Fabian</option>' +
                  '<option title="San Jacinto" value="San Jacinto">San Jacinto</option>' +
                  '<option title="San Manuel" value="San Manuel">San Manuel</option>' +
                  '<option title="San Nicolas" value="San Nicolas">San Nicolas</option>' +
                  '<option title="San Quintin" value="San Quintin">San Quintin</option>' +
                  '<option title="Santa Barbara" value="Santa Barbara">Santa Barbara</option>' +
                  '<option title="Santa Maria" value="Santa Maria">Santa Maria</option>' +
                  '<option title="Santa Tomas" value="Santa Tomas">Santa Tomas</option>' +
                  '<option title="Sison" value="Sison">Sison</option>' +
                  '<option title="Sual" value="Sual">Sual</option>' +
                  '<option title="Tayug" value="Tayug">Tayug</option>' +
                  '<option title="Umingan" value="Umingan">Umingan</option>' +
                  '<option title="Urbiztondo" value="Urbiztondo">Urbiztondo</option>' +
                  '<option title="Villasis" value="Villasis">Villasis</option>' +
                  '</select>' +
                  '<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">' +
                  '<div class="btn-group mr-2" role="group" aria-label="First group">' +
                  '<button type="button" class="btn btn-outline-dark request">Help</button>' +
                  '</div>' +
                  '<div class="btn-group mr-2" role="group" aria-label="Second group">' +
                  '<button type="button" class="btn btn-outline-dark backup">Backup</button>' +
                  '</div>' +
                  '</div>';

                buttons =
                  '<button class="btn btn-outline-warning rFire">I need Fire    Unit</button><button class="btn btn-outline-info rPolice">I need Police   Unit</button><button class="btn btn-outline-danger rHospital">I need Hospital Unit</button><br><button class="btn float-left btn-outline-primary drrm">I need DRRM</button><br><button class="btn float-left btn-outline-primary responded">This is already responded</button><br>';
              }
            }
          }

          infowindow.setContent(
            '<div class="container">' +
              '<div class="row">' +
              '<div class="col-md-6">' +
              '<h4 class="text-info">Date: ' +
              date +
              '</h4>' +
              '<h5 class="text-info">Local: ' +
              local +
              '</h5>' +
              '<h5 class="text-info">Address: ' +
              address +
              '</h5>' +
              '<h5 class="text-info">Respondent: ' +
              respondent +
              '</h5>' +
              '<h5>Help Unit: ' +
              help +
              '</h5>' +
              '<h5>Backup Unit: ' +
              backup +
              '</h5>' +
              '<h5 class="text-primary">Rescue Unit will go</h5>' +
              '<h5 class="text-primary">Fire Unit: ' +
              fire +
              ' </h5>' +
              '<h5 class="text-primary">Police Unit: ' +
              police +
              ' </h5>' +
              '<h5 class="text-primary">First Aid Unit: ' +
              hospital +
              ' </h5>' +
              '<h5 class="text-primary text-left">DRRM Unit: ' +
              drrm +
              ' </h5>' +
              buttons +
              '</div>' +
              '<div class="col-md-6">' +
              '<img src="' +
              image +
              '" height="300" width="300"/>' +
              dropdown +
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
        markers[newDocument._id].setPosition({
          lat: newDocument.lat,
          lng: newDocument.lng,
        });
        // Meteor.call('markers.update', newDocument._id, {lat: event.latLng.lat(), lng: event.latLng.lng()});
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
        if (type == 'Hospital') {
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
        });
        markers[document._id] = marker;
      },
      changed: function (newDocument, oldDocument) {
        markers[newDocument._id].setPosition({
          lat: newDocument.lat,
          lng: newDocument.lng,
        });
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
  });
});

Template.Maps.events({
  'click .rFire'() {
    Meteor.call('markers.addRescue', Session.get('markerId'), 'Fire Unit');
    Meteor.call(
      'serverNotification',
      'Fire Unit',
      Session.get('address'),
      Session.get('imageUrl')
    );
    toastr.success('Succesfully send');
    Meteor.call('markers.update.icon', Session.get('markerId'), '/ineedff.png');
  },
  'click .rPolice'() {
    Meteor.call('markers.addRescue', Session.get('markerId'), 'Police Unit');
    Meteor.call(
      'serverNotification',
      'Police Unit',
      Session.get('address'),
      Session.get('imageUrl')
    );
    toastr.success('Succesfully send');
    Meteor.call(
      'markers.update.icon',
      Session.get('markerId'),
      '/ineedpolice.png'
    );
  },
  'click .rHospital'() {
    Meteor.call('markers.addRescue', Session.get('markerId'), 'Hospital Unit');
    Meteor.call(
      'serverNotification',
      'Hospital Unit',
      Session.get('address'),
      Session.get('imageUrl')
    );
    toastr.success('Succesfully send');
    Meteor.call(
      'markers.update.icon',
      Session.get('markerId'),
      '/ineedfirstaid.png'
    );
  },
  'click .drrm'() {
    Meteor.call('markers.addRescue', Session.get('markerId'), 'DRRM Unit');
    Meteor.call(
      'serverNotification',
      'DRRM Unit',
      Session.get('address'),
      Session.get('imageUrl')
    );
    toastr.success('Succesfully send');
    Meteor.call(
      'markers.update.icon',
      Session.get('markerId'),
      '/drrm-marker.png'
    );
  },
  'click .request'() {
    let city = document.getElementById('local').value;
    Meteor.call(
      'markers.sendHelp',
      Session.get('markerId'),
      city,
      'needhelp.svg'
    );
    toastr.success('Succesfully send');
  },
  'click .backup'() {
    let city = document.getElementById('local').value;
    Meteor.call(
      'markers.sendBackup',
      Session.get('markerId'),
      city,
      'needhelp.svg'
    );
    toastr.success('Succesfully send');
  },
  'click .responded'() {
    Meteor.call('markers.responded', Session.get('markerId'));
    Meteor.call(
      'markers.update.icon',
      Session.get('markerId'),
      '/grn-circle.png'
    );
    toastr.success('Success!');
  },
});

Template.Maps.helpers({
  geolocationError: function () {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function () {
    var latLng = Geolocation.latLng();
    // Initialize the map once we have the latLng.
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(15.8949, 120.2863),
        zoom: 10,
      };
    }
  },
});
