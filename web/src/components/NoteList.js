import React, { Component } from 'react';
import styles from './NoteList.css';
import { app, base, fire } from '../base';

class NoteList extends Component {

	constructor() {
		super()
	}

	render() {
		const items = ["To-Do", "Work", "Finance", "Food", "Media", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"];
		const list = items.map((item) =>
			<a>{item}</a>
		);

		return (
				<nav><ul class="noteNav">
					<a class="NewNote">✚</a>
					{list}
				</ul></nav>
			);
	}
}

export default NoteList;