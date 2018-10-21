import React, { Component } from 'react';
import styles from './App.css';
import '../firebaseui-styling.global.css';
import { app, db, fire } from '../base';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import NoteList from './NoteList';
import Note from './Note';

import { connect } from 'react-redux';
import { fetchNotes, createNote } from "../actions/noteActions";

const mapStateToProps = (store) => {
	return {
		rnotes: store.notes.notes
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchNotes: () => dispatch(fetchNotes()),
		createNote: (note) => dispatch(createNote(note))
	}
};

class App extends Component {
	saveTimeout = 2;

	constructor(props) {
		super(props);
		this.state = {
			signedIn: false,
			loading: true,
			selectedNote: { title: "", body: "", id: "", author: "" },
			loadedNotes: false,
			saveTimer: null,
			saveCounter: 0,
			notes: []
		};
	}

	uiAuthConfig = {
		signInFlow: "popup",
		signInOptions: [
			fire.auth.GoogleAuthProvider.PROVIDER_ID,
			fire.auth.EmailAuthProvider.PROVIDER_ID
		],
		callbacks: {
			signInSuccess: () => false
		}
	}

	componentDidMount = () => {
		app.auth().onAuthStateChanged(user => {
			this.setState({ signedIn: !!user, loading:false });
			if (this.state.signedIn) {
				this.loadNotes();
			}
		});

		let saveTimer = setInterval(this.saveTick, 1000);
		this.setState({saveTimer});
	}
	
	componentWillUnmount() {
		this.clearInterval(this.state.saveTimer);
	}

	loadNotes = () => {
		db.collection("notes").where("author", "==", app.auth().currentUser.uid).orderBy("modTime", "desc").get()
			.then((querySnapshot) => {
				this.setState(prevState => ({
					notes: []
				}));
				var first = true;
				querySnapshot.forEach((doc) => {
					let data = {
						id: doc.id,
						author: doc.data().author,
						title: doc.data().title,
						body: doc.data().body
					}

					if (first) {
						this.onSelectNote(data);
						first = false;
					}

					this.setState(prevState => ({
						notes: [...prevState.notes, data]
					}));
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}

	saveTick = () => {
		let saveCounter = this.state.saveCounter;
		if (saveCounter > 0) {
			saveCounter--;
			if (saveCounter === 0) {
				this.saveNote();
			}
		}
		this.setState({saveCounter});
	}

	saveNote = () => {
		let saveCounter = 0;
		this.setState({saveCounter});
		db.collection("notes").doc(this.state.selectedNote.id).update({
			title: this.state.selectedNote.title,
			body: this.state.selectedNote.body,
			modTime: fire.firestore.FieldValue.serverTimestamp()
		})
		.then(function() {
			console.log("Note saved!")
		})
		.catch(function(error) {
			console.log("Error saving note: ", error);
		});
	}

	onSelectNote = (note) => {
		if (this.state.loadedNotes) {
			this.saveNote();
		}
		let selectedNote = Object.assign({}, this.state.selectedNote);
		selectedNote.id = note.id;
		selectedNote.author = note.author;
		selectedNote.title = note.title;
		selectedNote.body = note.body;
		this.setState({selectedNote});

		if (!this.state.loadedNotes) {
			var loadedNotes = true;
			this.setState({loadedNotes});
		}

		//this.refs.noteEditor.refs.titleField.focus();
	}

	onAddNote = () => {
		var ref = db.collection("notes").doc();
		
		var note = {
			id: ref.id,
			author: app.auth().currentUser.uid,
			title: "",
			body: "",
			modTime: fire.firestore.FieldValue.serverTimestamp()
		};
		
		this.setState(prevState => ({
			notes: [note, ...prevState.notes]
		}));
		
		this.onSelectNote(note);

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
		});
	}

	onEditTitle = (event) => {
		let selectedNote = Object.assign({}, this.state.selectedNote);
		selectedNote.title = event.target.value;
		this.setState({selectedNote});

		let saveCounter = this.saveTimeout;
		this.setState({saveCounter});

		let notes = this.state.notes;
		for (var i = 0; i < notes.length; i++) {
			if (notes[i].id === selectedNote.id) {
				notes[i].title = selectedNote.title;
				break;
			}
		}
		this.setState({notes});
	}

	onEditBody = (event) => {
		let selectedNote = Object.assign({}, this.state.selectedNote);
		selectedNote.body = event.target.value;
		this.setState({selectedNote});

		let saveCounter = this.saveTimeout;
		this.setState({saveCounter});

		let notes = this.state.notes;
		for (var i = 0; i < notes.length; i++) {
			if (notes[i].id === selectedNote.id) {
				notes[i].body = selectedNote.body;
				break;
			}
		}
		this.setState({notes});
	}

	onDelete = () => {
		var id = this.state.selectedNote.id;
		if (id.length !== 0) {
			db.collection("notes").doc(id).delete()
			.then(() => {
				console.log("Note deleted!");
				this.loadNotes();
			})
			.catch((error) => {
				console.error("Error deleting document: ", error);
			});

			let newNotes = this.state.notes;
			var deleted = false;
			for (var i = 0; i < newNotes.length; i++) {
				if (newNotes[i].id === id) {
					newNotes.splice(i, 1);
					deleted = true;
					break;
				}
			}

			if (deleted) {
				this.setState(prevState => ({
					notes: newNotes
				}));
				this.onSelectNote(newNotes[0]);
			}
		}
	}

	render() {
		if (this.state.loading) {
			return (<div className="Loading"><b>Flow Note is Loading...</b></div>);
		}

		return (
			<div className="App">
			{this.state.signedIn ? 
				(
					<ul class="NavBar">
						<li><div className="AppName">Flow Note</div></li>
						<li><a onClick={() => this.onAddNote()}>✚</a></li>
						<li><a onClick={() => this.onDelete()}>🗑</a></li>
						<li className="SignOut"><a onClick={() => app.auth().signOut()}>Sign Out</a></li>
					</ul>
				) :
				(
					<ul class="NavBar">
						<li><div className="AppName">Flow Note</div></li>
						{/*<li><a class="active" href="#home">Home</a></li>
						<li><a href="#news">News</a></li>
						<li><a href="#contact">Contact</a></li>
						<li><a href="#about">About</a></li>*/}
					</ul>
				)
			}
				{this.state.signedIn ? 
					(<div className="SignedIn">
						<NoteList
							onSelect={this.onSelectNote}
							onAdd={this.onAddNote}
							notes={this.state.notes}
							selectedNoteId={this.state.selectedNote.id}>
						</NoteList>
						<Note
							ref="noteEditor"
							selected={this.state.selectedNote} 
							onEditTitle={this.onEditTitle}
							onEditBody={this.onEditBody}
							loadedNotes={this.state.loadedNotes}>
						</Note>
					</div>) :
					(<div>
						<div className="SignInPrompt">Sign In</div>
						<StyledFirebaseAuth className={styles.firebaseUi} uiConfig={this.uiAuthConfig} firebaseAuth={app.auth()}/>
					</div>)}
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);