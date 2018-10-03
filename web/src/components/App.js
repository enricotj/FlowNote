import React, { Component } from 'react';
import styles from './App.css';
import '../firebaseui-styling.global.css';
import { app, base, fire } from '../base';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import NoteList from './NoteList';
import Note from './Note';

class App extends Component {
	constructor() {
		super();
		this.state = {
			signedIn: false,
			loading: true
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
		});
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
						<NoteList></NoteList>
						<Note></Note>
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
