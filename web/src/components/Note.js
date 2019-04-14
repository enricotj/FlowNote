import React, { Component } from 'react';
import './Note.css';

import { connect } from 'react-redux';
import { updateNote, updateNoteLocally, selectNote, } from "../actions/noteActions";

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
		selectNote: (index) => dispatch(selectNote(index)),
	}
};

class Note extends Component {
	saveTimeout = 2;

	constructor(props) {
		super(props);
		this.state = {
			saveTimer: null,
			saveCounter: 0,
			scriptString: ""
		};
	}

	componentDidMount = () => {
		let saveTimer = setInterval(this.saveTick, 1000);
		this.setState({saveTimer});
	}

	componentWillUnmount = () => {
		this.saveNote();
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

	onEditBody = (event) => {
		this.setState({scriptString: event.target.value});

		let note = Object.assign({}, this.props.notes[this.props.selectedNote]);
		note.body = event.target.value;
		this.props.updateNoteLocally(note);

		let saveCounter = this.saveTimeout;
		this.setState({saveCounter});
	}

	handleKeyDown = (event) => {
		if (event.keyCode === 9)
		{
			event.preventDefault();
			let note = Object.assign({}, this.props.notes[this.props.selectedNote]);
			var val = note.body;
			var start = event.target.selectionStart;
			var end = event.target.selectionEnd;
			var str = val.substring(0, start) + "\t" + val.substring(end);
			note.body = str;
			this.props.updateNoteLocally(note);

			this.setState(
				{"scriptString": str},
				() => {
						var pos = start + 1;
						this.refs.bodyInput.selectionStart = this.refs.bodyInput.selectionEnd = pos;
					});
		}
	}

	render() {
		var selectedNote = { id: "", body: "" };
		var enabled = (this.props.selectedNote >= 0 && this.props.notes.length > 0);
		if (this.props.fetchedNotes && enabled) {
			selectedNote = this.props.notes[this.props.selectedNote];
		}
		if (enabled) {
			return (<div class="Note">
				{!this.props.fetchedNotes ?
					(<div class="Loading"><b>Loading...</b></div>) :
					(<div class="NoteInner">
						<textarea class="Body" name="Body" ref="bodyInput"
							autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
							onChange={this.onEditBody}
							onKeyDown={this.handleKeyDown}
							value={selectedNote.body}/>
					</div>)}
				</div>);
		}
		else {
			return (<div class="Note">
				{!this.props.fetchedNotes ?
					(<div class="Loading"><b>Loading...</b></div>) :
					(<div class="NoteInner">
					</div>)}
				</div>);
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Note);