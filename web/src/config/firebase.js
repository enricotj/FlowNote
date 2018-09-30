import firebase from "firebase";
import 'firebase/firestore';

import { FirebaseConfig } from "./keySwitcher";
firebase.initializeApp(FirebaseConfig);

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = db;
export const firebaseAuth = firebase.auth;