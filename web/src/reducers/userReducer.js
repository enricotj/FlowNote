export default function reducer(state={
		user: {
			uid: null,
			name: null,
			email: null
		},
		signedIn: false
	}, action) {

		switch (action.type) {
			case "SIGNED_IN": {
				return {...state, user: action.payload, signedIn: true};
			}
			case "SIGNED_OUT": {
				return {...state, user: {uid: null, name: null, email: null}, signedIn: false};
			}
		}

		return state;
}