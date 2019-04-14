import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var config = {
	apiKey: "AIzaSyBEnBSP2AhyluulVVKVtJhk0uLoAuNJ8SQ",
	authDomain: "flow-note-6a889.firebaseapp.com",
	databaseURL: "https://flow-note-6a889.firebaseio.com",
	projectId: "flow-note-6a889",
	storageBucket: "flow-note-6a889.appspot.com",
	messagingSenderId: "329499415062"
};

const app = firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
db.settings({
	timestampsInSnapshots: true
});

const fire = firebase;

export { app, fire, db };