import { app, db, fire } from '../base';

export function fetchNotes() {
	return function(dispatch){
		dispatch({type: "FETCH_NOTES"});
		db.collection("notes").where("author", "==", app.auth().currentUser.uid).orderBy("modTime", "desc").get()
			.then((querySnapshot) => {
				var noteData = [];
				querySnapshot.forEach((doc) => {
					var data = {
						id: doc.id,
						title: doc.data().title,
						body: doc.data().body
					}
					noteData.push(data);
				});
				dispatch({type: "FETCH_NOTES_SUCCESS", payload: noteData});
				dispatch({type: "SELECT_NOTE", payload: 0});
			})
			.catch((error) => {
				dispatch({type: "FETCH_NOTES_ERROR", payload: error});
			});
	};
}

export function selectNote(index) {
	return {
		type: "SELECT_NOTE",
		payload: index
	};
}

export function createNote() {
	return function(dispatch) {
		var ref = db.collection("notes").doc();

		dispatch({type: "CREATE_NOTE", payload: ref.id});

		ref.set({
			author: app.auth().currentUser.uid,
			title: "",
			body: "",
			modTime: fire.firestore.FieldValue.serverTimestamp()
		})
		.then(() => {
			console.log("New note added!");
		})
		.catch((error) => {
			console.error("Error writing document: ", error);
			dispatch({type: "CREATE_NOTE_ERROR", payload: error});
		});
	};
}

export function updateNote(note) {
	return function(dispatch) {
		dispatch({type: "UPDATE_NOTE", payload: note});

		db.collection("notes").doc(note.id).update({
			title: note.title,
			body: note.body,
			modTime: fire.firestore.FieldValue.serverTimestamp()
		})
		.then(function() {
			console.log("Note updated!")
		})
		.catch(function(error) {
			console.log("Error updating note: ", error);
			dispatch({type: "UPDATE_NOTE_ERROR", payload: error});
		});
	};
}

export function deleteNote(noteId) {
	return function(dispatch) {
		if (noteId.length !== 0) {
			dispatch({type: "DELETE_NOTE", payload: noteId});
			
			db.collection("notes").doc(noteId).delete()
			.then(() => {
				console.log("Note deleted!");
			})
			.catch((error) => {
				console.error("Error deleting document: ", error);
				dispatch({type: "DELETE_NOTE_ERROR", payload: error});
			});
		}
	};
}