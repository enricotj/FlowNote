import React, { Component } from 'react';
import styles from './Note.css';
import { app, base, fire } from '../base';

class Note extends Component {

	constructor() {
		super()
	}

	render() {
		return (<div class="Note">
				<input class="Title" name="Title" type="text"/>
				<textarea class="Body" name="Body"></textarea>
			</div>);
	}
}

export default Note;