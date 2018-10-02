import React, { Component } from 'react';
import styles from './NoteList.css';
import { app, base, fire } from '../base';

class NoteList extends Component {
	constructor() {
		super()
	}

	render() {
		return (
				<nav><ul class="noteNav">
					<a>To-Do</a>
					<a>Work</a>
					<a>Finance</a>
					<a>Food</a>
				</ul></nav>
			);
	}
}

export default NoteList;