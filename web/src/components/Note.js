import React, { Component } from 'react';
import './Note.css';

class Note extends Component {
	render() {
		return (<div class="Note">
			{!this.props.loadedNotes ? 
				(<div class="Loading"><b>Loading...</b></div>) :
				(<div class="NoteInner">
					<input class="Title" name="Title" type="text" ref="titleField" value={this.props.selected.title} onChange={this.props.onEditTitle}/>
					<textarea class="Body" name="Body" value={this.props.selected.body} onChange={this.props.onEditBody}/>
				</div>)}
			</div>);
	}
}

export default Note;