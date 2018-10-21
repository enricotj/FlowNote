/*
note object:
{
	id: null,
	title: null,
	body: null,
}
*/

export default function reducer(state={
		notes: [],
		selected: -1,
		fetching: false,
		fetched: false,
		error: null,
		updateTimer: 0,
	}, action) {

		switch (action.type) {
			case "FETCH_NOTES": {
				return {...state, fetching: true};
			}
			case "FETCH_NOTES_ERROR": {
				return {...state, fetching: false, error: action.payload};
			}
			case "FETCH_NOTES_SUCCESS": {
				return {...state, notes: action.payload, fetching: false, fetched: true};
			}

			case "SELECT_NOTE": {
				return {...state, selected: action.payload};
			}

			case "CREATE_NOTE": {
				return {...state, notes: [{id: action.payload, title: "", body: ""}, ...state.notes], selected: 0};
			}
			case "CREATE_NOTE_ERROR": {
				return {...state, error: action.payload};
			}

			case "UPDATE_NOTE": {
				const newNotes = [...state.notes];
				const noteToEdit = newNotes.findIndex(note => note.id === action.payload.id);
				newNotes[noteToEdit] = action.payload;
				return {...state, notes: newNotes};
			}
			case "UPDATE_NOTE_ERROR": {
				return {...state, error: action.payload};
			}

			case "DELETE_NOTE": {
				return {...state, notes: state.notes.filter(note => note.id !== action.payload), selected: 0};
			}
			case "DELETE_NOTE_ERROR": {
				return {...state, error: action.payload};
			}

			default:
				console.log("Invalid action type: ", action.type);
				break;
		}

		return state;
}