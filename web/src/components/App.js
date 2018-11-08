import React, { Component } from 'react';
import styles from './App.css';
import '../firebaseui-styling.global.css';
import { app, fire } from '../base';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import NoteList from './NoteList';
import Note from './Note';

import { connect } from 'react-redux';
import { fetchNotes, createNote, deleteNote } from "../actions/noteActions";

const mapStateToProps = (store) => {
	return {
		notes: store.notes.notes,
		selectedNote: store.notes.selected
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchNotes: () => dispatch(fetchNotes()),
		createNote: () => dispatch(createNote()),
		deleteNote: (noteId) => dispatch(deleteNote(noteId)),
	}
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signedIn: false,
			loading: true,
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
				this.props.fetchNotes();
			}
		});
	}

	onDeleteNote = () => {
		if (this.props.selectedNote >= 0 && this.props.notes.length > 0) {
			var id = this.props.notes[this.props.selectedNote].id;
			this.props.deleteNote(id);
		}
	}

	render() {
		if (this.state.loading) {
			return (<div className="Loading"><b>Flow Note is Loading...</b></div>);
		}

		return (
			<div className="App">
				{this.state.signedIn ? 
					(<ul class="NavBar">
						<li><div className="AppName">Flow Note</div></li>
						<li><a onClick={() => this.props.createNote()}>✚</a></li>
						<li><a onClick={() => this.onDeleteNote()}>🗑</a></li>
						<li className="SignOut"><a onClick={() => app.auth().signOut()}>Sign Out</a></li>
					</ul>) :
					(<ul class="NavBar">
						<li><div className="AppName">Flow Note</div></li>
						{/*<li><a class="active" href="#home">Home</a></li>
						<li><a href="#news">News</a></li>
						<li><a href="#contact">Contact</a></li>
						<li><a href="#about">About</a></li>*/}
					</ul>)}
				{this.state.signedIn ? 
					(<div className="SignedIn">
						<NoteList/>
						<Note ref="noteEditor"/>
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