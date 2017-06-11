console.log('test start');
var myArgs = process.argv.slice(2);

var userID = myArgs[0];
var projectID = myArgs[1];
var amount = myArgs[2];

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

  		var projects = snapshot.child('Projects');
  		if (projects.hasChild(projectID)) {
  			var project = projects.child(projectID);
  			var moneyRaised = project.child("money raised");
  			var moneyRemaining = project.child("money remaining");


			var projectRef = ref.child("Projects").child(projectID);

			projectRef.update({
			  "money raised": Number(JSON.stringify(moneyRaised)) + Number(amount),
			  "money remaining" : Number(JSON.stringify(moneyRemaining)) - Number(amount)
			}
			, function(error) {
			  if (error) {
			    console.log("Data could not be saved." + error);
			  } else {
			    console.log("Data saved successfully.");
			  }
				if (project.hasChild('Donors')) {

					var donorsRef = ref.child("Projects").child(projectID).child("Donors");
					var key1 = donorsRef.push().key;
					var updates = {};
					updates[key1] = {
					      "UserID": userID,
					  	  "Amount": Number(amount)
					    };
					donorsRef.update(updates, function(error) {
					  if (error) {
					    console.log("Data could not be saved." + error);
					  } else {
					    console.log("Data saved successfully.");
					  }
					  process.exit(0)
					});
				}
				else {
					var key1 = projectRef.push().key;
					var updates = {};
					updates[key1] = {
					      "UserID": userID,
					  	  "Amount": Number(amount)
					    };
					projectRef.update({
					  "Donors": updates
					}
					, function(error) {
					  if (error) {
					    console.log("Data could not be saved." + error);
					  } else {
					    console.log("Data saved successfully.");
					  }

	  				  process.exit(0)
					});
				}
			});

			

  		}
  		else {
  			console.log('Error: project DNE');
  		}
  	}
  	else {
  		console.log('Error: no projects');
  	} 

  	//console.log(JSON.stringify(snapshot));

  });



