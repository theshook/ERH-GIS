Push.debug = true;
Push.Configure({
  gcm: {
    apiKey: 'AAAAscwLYuw:APA91bGekL06xrwTHEDnBpN1eT6dO8IDQCG32DJBmzARfzUKMI1S6B_Dmt5j60-yLIvVoXL-lONUPe99gH3mr0BNUjA8Ga7QRqe51dJX8uLJxAJYkJDsxW7Kjz2XBWbm3AhixeKq1T4D',  // GCM/FCM server key
    projectNumber: 763632509676
  },
  production: false,
});

Push.allow({
  send: (userId, notification) => {
    // allow all users to send notifications
    return true;
  }
});

Meteor.methods({
  'serverNotification'(title, text, imageUrl) {
    Push.send({
      title,
      text,
      from: 'Concern Citizen',
      gcm: {
        style: 'picture',
        picture: imageUrl,
        summaryText: text
      },
      query: {
        // userId: 'ETA9dLf63hzXkvcZb'
      }
    });
  }
});