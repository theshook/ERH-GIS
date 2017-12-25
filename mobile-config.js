App.info({
  name: 'ERH',
  description: 'An Android app built with Meteor',
  version: '0.0.1'
});

App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
App.accessRule('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css');
App.accessRule('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css');
App.accessRule('https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css');
App.accessRule('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js');
App.accessRule('https://code.jquery.com/jquery-3.2.1.slim.min.js');
App.accessRule('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js');
App.accessRule('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js');
