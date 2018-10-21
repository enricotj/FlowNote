import React, { Component } from 'react';
import './NoteList.css';

class NoteItem extends Component {
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