console.log('test start');
var myArgs = process.argv.slice(2);

var userID = myArgs[0];
var projectID = myArgs[1];

console.log('Project ID is: ' + projectID);
console.log('User ID is: ' + userID);

var firebase = require("firebase-admin");

var serviceAccount = require("./lever-60125-firebase-adminsdk-vk0qx-336375f9a7.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://lever-60125.firebaseio.com/"
});



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
  		if (projects.hasChild(projectID)) {
  			var title = projects.child(projectID).child('title');
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