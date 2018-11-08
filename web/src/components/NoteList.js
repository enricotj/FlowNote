import React, { Component } from 'react';
import './NoteList.css';

import { connect } from 'react-redux';
import { updateNote, selectNote } from "../actions/noteActions";

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

const mapStateToProps = (store) => {
	return {
		notes: store.notes.notes,
		selectedNote: store.notes.selected
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateNote: (note) => dispatch(updateNote(note)),
		selectNote: (index) => dispatch(selectNote(index)),
	}
};

class NoteList extends Component {

	onSelectNote = (note) => {
		if (this.props.notes) {
			var selectedNoteId = this.props.notes[this.props.selectedNote];
			if (selectedNoteId !== note.id) {
				this.props.updateNote(this.props.notes[this.props.selectedNote]);
			}
		}

		for (var i = 0; i < this.props.notes.length; i++) {
			if (this.props.notes[i].id === note.id) {
				this.props.selectNote(i);
				break;
			}
		}
	}

	render() {
		var selectedNoteId = 0;
		if (this.props.selectedNote >= 0 && this.props.notes.length > 0) {
			selectedNoteId = this.props.notes[this.props.selectedNote].id;
		}
		const list = this.props.notes.map((note) =>
			<NoteItem key={note.id} note={note} selectedNoteId={selectedNoteId} onSelect={this.onSelectNote}></NoteItem>
		);

		return (
				<nav><ul class="noteNav">
					{list}
				</ul></nav>
			);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NoteList);