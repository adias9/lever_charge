console.log('test start');

var firebase = require("firebase-admin");

var serviceAccount = require("./lever-60125-firebase-adminsdk-vk0qx-336375f9a7.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://lever-60125.firebaseio.com/"
});

console.log('Major test: ' + testglobarvar);

var ref = firebase.database().ref();
ref.once("value")
  .then(function(snapshot) {
  	if (snapshot.hasChild("Users")) {
  		console.log('has users')
  		var users = snapshot.child('Users');
  	}
  	else {
  		console.log('Error: no users');
  	}

  	if (snapshot.hasChild("Projects")) {
  		console.log('has projects');
  		var projects = snapshot.child('Projects');
  		if (projects.hasChild('-KiqLms_JdnTo8d_fNZS')) {
  			var title = projects.child('-KiqLms_JdnTo8d_fNZS').child('title');
  			console.log('Title: ' + title.val());
  		}
  		else {
  			console.log('Error: project DNE');
  		}
  	}
  	else {
  		console.log('Error: no projects');
  	} 

  	//console.log(JSON.stringify(snapshot));

  	process.exit(0)
  });


console.log('test end');