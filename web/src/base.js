import Rebase from 're-base';
import firebase from "firebase";
import "firebase/firestore";

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
const base = Rebase.createClass(db);

const fire = firebase;

export { app, base, fire, db };