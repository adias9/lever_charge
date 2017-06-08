console.log('test start');

var admin = require("firebase-admin");

import * as admin from "firebase-admin";

var admin = require("firebase-admin");

var serviceAccount = require("lever-60125-firebase-adminsdk-vk0qx-336375f9a7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lever-60125.firebaseio.com/"
});

