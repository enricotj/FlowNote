import React, { Component } from 'react';
import './Note.css';

import { connect } from 'react-redux';
import { updateNote, updateNoteLocally } from "../actions/noteActions";

const mapStateToProps = (store) => {
	return {
		fetchedNotes: store.notes.fetched,
		notes: store.notes.notes,
		selectedNote: store.notes.selected
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateNote: (note) => dispatch(updateNote(note)),
		updateNoteLocally: (note) => dispatch(updateNoteLocally(note)),
	}
};

class Note extends Component {
	saveTimeout = 2;

	constructor(props) {
		super(props);
		this.state = {
			saveTimer: null,
			saveCounter: 0
		};
	}

	componentDidMount = () => {
		let saveTimer = setInterval(this.saveTick, 1000);
		this.setState({saveTimer});
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

		this.props.updateNote(this.props.notes[this.props.selectedNote]);
	}

	onEditTitle = (event) => {
		let note = Object.assign({}, this.props.notes[this.props.selectedNote]);
		note.title = event.target.value;
		this.props.updateNoteLocally(note);

		let saveCounter = this.saveTimeout;
		this.setState({saveCounter});
	}

	onEditBody = (event) => {
		let note = Object.assign({}, this.props.notes[this.props.selectedNote]);
		note.body = event.target.value;
		this.props.updateNoteLocally(note);

		let saveCounter = this.saveTimeout;
		this.setState({saveCounter});
	}

	render() {
		var selectedNote = { id: "", title: "", body: "" };
		if (this.props.fetchedNotes) {
			selectedNote = this.props.notes[this.props.selectedNote];
		}

		return (<div class="Note">
			{!this.props.fetchedNotes ?
				(<div class="Loading"><b>Loading...</b></div>) :
				(<div class="NoteInner">
					<input class="Title" name="Title" type="text" ref="titleField" value={selectedNote.title} onChange={this.onEditTitle}/>
					<textarea class="Body" name="Body" value={selectedNote.body} onChange={this.onEditBody}/>
				</div>)}
			</div>);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Note);