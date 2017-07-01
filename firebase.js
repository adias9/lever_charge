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
		} else {
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
					"money remaining": Number(JSON.stringify(moneyRemaining)) - Number(amount)
				}, function(error) {
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

							var title = project.child("title").val();
							var imageURL = project.child("image").val();
							var description = " contributed to " + title;
							var likes = [];
							var users = snapshot.child('Users');
							if (users.hasChild(userID)) {
								var user = users.child(userID);
								description = user.child("name").val() + description
							} else {
								description = "A user" + description
							}
							createUpdate(ref, Number(amount), description, userID, projectID, title, imageURL, likes, snapshot, function() {
								console.log('Successfully posted update');
								process.exit(0)
							});
						});
					} else {
						var key1 = projectRef.push().key;
						var updates = {};
						updates[key1] = {
							"UserID": userID,
							"Amount": Number(amount)
						};
						projectRef.update({
							"Donors": updates
						}, function(error) {
							if (error) {
								console.log("Data could not be saved." + error);
							} else {
								console.log("Data saved successfully.");
							}

							var title = project.child("title").val();
							var imageURL = project.child("image").val();
							var description = " contributed to " + title;
							var likes = [];
							var users = snapshot.child('Users');
							if (users.hasChild(userID)) {
								var user = users.child(userID);
								description = user.child("name").val() + description
							} else {
								description = "A user" + description
							}
							createUpdate(ref, Number(amount), description, userID, projectID, title, imageURL, likes, snapshot, function() {
								console.log('Successfully posted update');
								process.exit(0)
							});
						});
					}
				});
			} else {
				console.log('Error: project DNE');
			}
		} else {
			console.log('Error: no projects');
		}

		//console.log(JSON.stringify(snapshot));

	});



function createUpdate(ref, donation, description, userID, projectID, title, imageURL, likes, snapshot, completion) {
	var today = new Date();

	var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes();
	var timestamp = date + ' ' + time;

	console.log(String(timestamp));

	var updateRef = ref.child("Updates");



	var key1 = updateRef.push().key;
	var contents = {
		"imageURL": imageURL,
		"title": title,
		"type": "PERSONAL_UPDATE_DONATION",
		"timestamp": timestamp,
		"projectID": projectID,
		"updateID": key1,
		"donation": donation,
		"description": description,
		"likes": likes,
		"userID": userID
	};
	var updates = {};
	updates[key1] = contents;

	updateRef.update(updates, function(error) {
		if (error) {
			console.log("Data could not be saved." + error);
		} else {
			console.log("Data saved successfully.");
		}
		
		
		
		var user = snapshot.child('Users').child(userID);
		var userIDs = [];
		if (user.hasChild("followers")) {
			userIDs = user.child("followers").val();
		}
		
		userIDs.push(userID);
		addUpdateToUsers(ref, snapshot, userIDs, key1, user.val()['FBID'], function() {
			console.log('Added update to users successfully');
			completion()
		});
	});
}

function addUpdateToUsers(ref, snapshot, userIDs, updateID, posterID, completion) {
	var usersRef = ref.child("Users");
	var users = snapshot.child('Users');
	var updates = {}
	for (let userID of userIDs) {
		if (users.hasChild(userID)) {
			var user = users.child(userID).val()
			if (user["updates"] == undefined) {
				user["updates"] = [updateID];
			} else {
				var userUpdates = user["updates"];
				userUpdates.push(updateID);
			}
			updates[userID] = user;
		} else {
			console.log('Error: child DNE');
		}
	}
	console.log('test: ' + posterID)
	var poster = users.child(posterID).val();
	//if this is a personal update, add the personal update to the personalUpdates array of the user who posted it
	if (poster.personalUpdates == undefined) {
		poster.personalUpdates = [updateID];
		console.log('added first personal update')
	}
	else {
		var posterPersonalUpdates = poster["personalUpdates"];
		posterPersonalUpdates.push(updateID);
		console.log('pushed it: ' + JSON.stringify(poster["personalUpdates"]))
	}
	updates[posterID] = poster;

	usersRef.update(updates, function(error) {
		if (error) {
			console.log("Data could not be saved." + error);
		} else {
			console.log("Data saved successfully.");
		}
		//if this is a personal update, add the personal update to the personalUpdates array of the user who posted it

		completion()
	});
}


// //if this is a personal update, add the personal update to the personalUpdates array of the user who posted it
// if (type == Constants.PERSONAL_UPDATE) {
// 	dataRef.observeSingleEvent(of: .value, with: {
// 		(snapshot) in
// 		let dictionary: [String: AnyObject] = snapshot.value as![String: AnyObject]
// 		let projectDict = dictionary["Users"] as![String: AnyObject]
// 		if (snapshot.hasChild("Users") && userID != nil && snapshot.childSnapshot(forPath: "Users").hasChild(userID!)) {
// 			//add the update id to the user's updates array
// 			if (snapshot.childSnapshot(forPath: "Users").childSnapshot(forPath: userID!).hasChild("personalUpdates")) {
// 				var updateIDArray = projectDict[userID!] ? ["personalUpdates"] as![String]
// 				updateIDArray.append(updateID)
// 				let updates = ["personalUpdates": updateIDArray]
// 				dataRef.child("Users").child(userID!).updateChildValues(updates)
// 			}
// 			//updatesIDs has not yet been created
// 			else {
// 				let updateArray = [updateID]
// 				let updates = ["personalUpdates": updateArray]
// 				dataRef.child("Users").child(userID!).updateChildValues(updates)
// 			}
// 		}
// 	})

// }


// GO THROUGH THE USERS WHO FOLLOW THE POSTER OF THIS UPDATE and add the personal update to their updates array
// if (type == Constants.PERSONAL_UPDATE) {
// 	if let userID = userID {
// 		dataRef.observeSingleEvent(of: .value, with: {
// 			(snapshot) in
// 			let dictionary: [String: AnyObject] = snapshot.value as![String: AnyObject]

// 			if (snapshot.childSnapshot(forPath: "Users").childSnapshot(forPath: userID).hasChild("followers")) {
// 				let userDict = dictionary["Users"] ? [userID] as![String: AnyObject]
// 				let userFollowers = userDict["followers"] as![String]

// 				for followerID in userFollowers {
// 					let followerDict = dictionary["Users"] ? [followerID] as![String: AnyObject]

// 					if (snapshot.childSnapshot(forPath: "Users").childSnapshot(forPath: followerID).hasChild("updates")) {
// 						var updateArray = followerDict["updates"] as![String]
// 						updateArray.append(updateID)
// 						let updates = ["updates": updateArray]
// 						dataRef.child("Users").child(followerID).updateChildValues(updates)
// 					} else {
// 						let updates = ["updates": updateID]
// 						dataRef.child("Users").child(followerID).updateChildValues(updates)
// 					}
// 				}
// 			}
// 		})
// 	}
// }