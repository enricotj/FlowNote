import React, { Component } from 'react';
import styles from './App.css';
import '../firebaseui-styling.global.css';
import { app, db, fire } from '../base';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import NoteList from './NoteList';
import Note from './Note';

class App extends Component {
	constructor() {
		super();
		this.state = {
			signedIn: false,
			loading: true,
			selectedNote: { title: "", body: "", id: "", author: "" },
			loadedNotes: false,
			saveTimer: null,
			saveCounter: 0
		};
		console.log(this.state);
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
		});

		let saveTimer = setInterval(this.saveTick, 1000);
		this.setState({saveTimer});
	}
	
	componentWillUnmount() {
		this.clearInterval(this.state.saveTimer);
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
		db.collection("notes").doc(this.state.selectedNote.id).update({
			title: this.state.selectedNote.title,
			body: this.state.selectedNote.body
		})
		.then(function() {
			console.log("Note saved!")
		})
		.catch(function(error) {
			console.log("Error saving note: ", error);
		});
	}

	onSelectNote = (note) => {
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
	}

	onAddNote = () => {
		db.collection("notes").add({
			author: app.auth().currentUser.uid,
			title: "",
			body: ""
		})
		.then(function() {
			console.log("New note added!");
			// TODO: refresh note list, select new note
		})
		.catch(function(error) {
			console.error("Error writing document: ", error);
		});
	}

	onEditTitle = (event) => {
		let selectedNote = Object.assign({}, this.state.selectedNote);
		selectedNote.title = event.target.value;
		this.setState({selectedNote});

		let saveCounter = 3;
		this.setState({saveCounter});
	}

	onEditBody = (event) => {
		let selectedNote = Object.assign({}, this.state.selectedNote);
		selectedNote.body = event.target.value;
		this.setState({selectedNote});

		let saveCounter = 3;
		this.setState({saveCounter});
	}

	render() {
		if (this.state.loading) {
			return (<div class="Loading"><b>Flow-Note is Loading...</b></div>);
		}

		return (
			<div className="App">
				<ul class="NavBar">
					<li><div class="AppName">Flow-Note</div></li>
					{/*<li><a class="active" href="#home">Home</a></li>
					<li><a href="#news">News</a></li>
					<li><a href="#contact">Contact</a></li>
					<li><a href="#about">About</a></li>*/}
					{this.state.signedIn ? 
						(<li class="SignOut"><a onClick={() => app.auth().signOut()}>Sign Out</a></li>) : (<div/>) }
				</ul>
				{this.state.signedIn ? 
					(<div class="SignedIn">
						<NoteList onSelect={this.onSelectNote} onAdd={this.onAddNote}></NoteList>
						<Note selected={this.state.selectedNote} onEditTitle={this.onEditTitle} onEditBody={this.onEditBody} loadedNotes={this.state.loadedNotes}/>
					</div>) :
					(<div>
						<div class="SignInPrompt">Sign In</div>
						<StyledFirebaseAuth className={styles.firebaseUi} uiConfig={this.uiAuthConfig} firebaseAuth={app.auth()}/>
					</div>)}
			</div>
		);
	}
}

export default App;
