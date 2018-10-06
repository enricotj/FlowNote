import React, { Component } from 'react';
import styles from './NoteList.css';
import { app, db, fire } from '../base';

class NoteList extends Component {

	constructor(props) {
		super(props);
		this.state = {notes: []};

		this.updateNotes = this.updateNotes.bind(this);
	}

	updateNotes(note) {
		console.log(note);
		this.setState(prevState => ({
				notes: [...prevState.notes, note]
			}));
	}

	componentDidMount() {
		var docRef = db.collection("notes").where("author", "==", app.auth().currentUser.uid).get()
			.then((querySnapshot) => {
				var first = true;
				querySnapshot.forEach((doc) => {
					let data = {
						id: doc.id,
						author: doc.data().author,
						title: doc.data().title,
						body: doc.data().body,
					}

					if (first) {
						this.props.onSelect(data);
						first = false;
					}

					this.updateNotes(data);
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}

	render() {
		const list = this.state.notes.map((note) =>
			<a onClick={() => {this.props.onSelect(note);}}>{note.title === "" ? "<untitled>" : note.title}</a>
		);

		return (
				<nav><ul class="noteNav">
					<a class="NewNote" onClick={() => this.props.onAdd()}>✚</a>
					{list}
				</ul></nav>
			);
	}
}

export default NoteList;