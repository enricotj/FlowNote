import React from "react";

export default class Login extends React.Component {
	constructor(props) {
		super(props);

		this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
	}

	handleGoogleLogin() {
		console.log("login with google button clicked")
	}

	componentWillMount() {
	}

	render() {
		return <LoginPage handleGoogleLogin={this.handleGoogleLogin}/>;
	}
}

const LoginPage = ({handleGoogleLogin}) => (
	<div>
		<h1>Login</h1>
		<div>
			<button
				type="button"
				onClick={handleGoogleLogin}>
				Sign in with Google
			</button>
		</div>
	</div>
);
const SplashScreen = () => (<p>Loading...</p>)