console.log('test start');

var firebase = require("firebase-admin");

var serviceAccount = require("./lever-60125-firebase-adminsdk-vk0qx-336375f9a7.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://lever-60125.firebaseio.com/"
});


var ref = firebase.database().ref("Updates");
ref.once("value")
  .then(function(snapshot) {
  	console.log(JSON.stringify(snapshot));
  });




console.log('test end');