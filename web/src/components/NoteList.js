import React, { Component } from 'react';
import styles from './NoteList.css';
import { app, db, fire } from '../base';

class NoteItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: false
		};
	}

	render () {
		var note = this.props.note;
		var selectedClass = "";
		if (note.id === this.props.selectedNoteId) {
			selectedClass = "selectedNote";
		}

		return (
				<a class={selectedClass} onClick={() => {this.props.onSelect(note);}}>
					{note.title}
				</a>
			);
	}

}

class NoteList extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const list = this.props.notes.map((note) =>
			<NoteItem key={note.id} note={note} selectedNoteId={this.props.selectedNoteId} onSelect={this.props.onSelect}></NoteItem>
		);

		return (
				<nav><ul class="noteNav">
					{list}
				</ul></nav>
			);
	}
}

export default NoteList;