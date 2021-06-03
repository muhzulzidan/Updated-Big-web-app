// @ts-nocheck
import { useState } from "react";
import AuthInput from "../../components/inputs/auth-input";
import axios from "axios";
import "./style.css";
import { useSetAuthToken } from "../../contexts/auth-context";
import { useHistory } from "react-router";

export default function LoginPage(props) {
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [loginMessage, setLoginMessage] = useState({});

	const [signupEmail, setSignupEmail] = useState("");
	const [signupPassword, setSignupPassword] = useState("");
	const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
	const [isAgree, setIsAgree] = useState(false);
	const [signupMessage, setSignupMessage] = useState("");

	const [errors, setErrors] = useState({});

	const setAuthToken = useSetAuthToken();
	const history = useHistory();

	const validateEmail = function (email) {
		return email.match(
			/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
		);
	};

	const login = function (e) {
		e.preventDefault();

		//validate login information:
		const error = {};
		if (!validateEmail(loginEmail))
			error.loginEmail = "Invalid login email";
		if (!loginEmail) error.loginEmail = "Email is required";
		if (!loginPassword) error.loginPassword = "Password is required";
		setErrors(error);
		if (error.loginEmail || error.loginPassword) return;

		axios
			.post(
				"https://run.mocky.io/v3/f681a2a4-c4e9-49e5-9359-5b1b6f86dd88/login",
				{
					email: loginEmail,
					password: loginPassword,
				}
			)
			.then(({ data }) => {
				if (data.isAdmin) {
					setLoginMessage({
						textClass: "text-success",
						message: "Logged in successfully",
					});

					setTimeout(() => {
						setAuthToken(data);
						history.push("/");
					}, 1100);
				} else {
					setLoginMessage({
						textClass: "text-success",
						message: (
							<span>
								{" "}
								<span>
									{" "}
									Logged in successfully <br />
								</span>{" "}
								<span className="notadmin">
									{" "}
									You need to be an admin to access the admin
									panel <br />
								</span>{" "}
								<span className="notadmin">
									{" "}
									Access token is printed in console{" "}
								</span>{" "}
							</span>
						),
					});
					console.log(`User token: ${data.accessToken}`);
				}
			})
			.catch(({ response }) => {
				if (response) {
					setLoginMessage({
						textClass: "text-danger",
						message: `There was an error please try again ${response.status}`,
					});
				}
			});
	};

	const signup = function (e) {
		e.preventDefault();

		//valid sign up information
		const error = {};
		if (!validateEmail(signupEmail))
			error.signupEmail = "Invalid sign up email";
		if (!signupEmail) error.signupEmail = "Email is required";
		if (!signupPassword) error.signupPassword = "Password is required";
		if (!signupPasswordConfirm)
			error.signupPasswordConfirm = "Please enter your password again";
		if (signupPassword !== signupPasswordConfirm)
			error.signupPasswordConfirm = "Passwords are not identical";
		if (!isAgree) error.isAgree = "Terms and conditions are required";
		setErrors(error);
		if (
			error.signupEmail ||
			error.signupPassword ||
			error.signupPasswordConfirm ||
			error.isAgree
		)
			return;

		axios
			.post("https://reqres.in/api/register", {
				email: signupEmail,
				password: signupPassword,
			})
			.then(() =>
				setSignupMessage({
					textClass: "text-success",
					message: "Your account has been created",
				})
			)
			.catch(({ response }) => {
				if (response) {
					setSignupMessage({
						textClass: "text-danger",
						message: `There was an error ${response.status}`,
					});
				}
			});
	};

	return (
		<div className="d-flex justify-content-center auth-container">
			{/* Login form */}
			<form onSubmit={login}>
				<div className="auth-head">LOG IN</div>
				<div className="auth-subhead">Enter your credentials</div>
				<AuthInput
					placeholder="EMAIL"
					error={errors.loginEmail}
					value={loginEmail}
					name="email"
					onChange={(e) => setLoginEmail(e.target.value)}
				/>
				<div className="auth-error-message">{errors.loginEmail}</div>
				<AuthInput
					placeholder="PASSWORD"
					isPassword={true}
					error={errors.loginPassword}
					value={loginPassword}
					name="password"
					onChange={(e) => setLoginPassword(e.target.value)}
				/>
				<div className="auth-error-message">{errors.loginPassword}</div>
				<div className="auth-forgot">Forgot password?</div>
				<div className="text-center">
					<button className="auth-submit" type="submit">
						Log in
					</button>
					<div
						className={`auth-message ${
							loginMessage.textClass ? loginMessage.textClass : ""
						}`}
					>
						{loginMessage.message}
					</div>
				</div>
			</form>

			{/* separator div*/}
			<div className="vertical-separator"></div>

			{/* Sign up form */}
			<form onSubmit={signup}>
				<div className="auth-head">SIGN UP</div>
				<div className="auth-subhead">Tell us a little about you</div>
				<AuthInput
					placeholder="EMAIL"
					name="email"
					error={errors.signupEmail}
					value={signupEmail}
					onChange={(e) => setSignupEmail(e.target.value)}
				/>
				<div className="auth-error-message">{errors.signupEmail}</div>
				<AuthInput
					placeholder="PASSWORD"
					isPassword={true}
					name="password"
					error={errors.signupPassword}
					value={signupPassword}
					onChange={(e) => setSignupPassword(e.target.value)}
				/>
				<div className="auth-error-message">
					{errors.signupPassword}
				</div>
				<AuthInput
					placeholder="CONFIRM PASSWORD"
					isPassword={true}
					name="confirm_password"
					error={errors.signupPasswordConfirm}
					value={signupPasswordConfirm}
					onChange={(e) => setSignupPasswordConfirm(e.target.value)}
				/>
				<div className="auth-error-message">
					{errors.signupPasswordConfirm}
				</div>
				<div className="text-center mb-5">
					<label className="mt-2">
						<input
							className="auth-checkbox"
							type="checkbox"
							onChange={(e) => setIsAgree(e.target.checked)}
							checked={isAgree}
						/>
						<span
							className={`auth-checkbox-label ${
								errors.isAgree && !isAgree
									? "auth-checkbox-label-error"
									: ""
							}`}
						>
							I agree to the{" "}
							<span className="font-weight-bold">
								Terms and Conditions
							</span>
						</span>
					</label>
				</div>
				<div className="text-center">
					<button className="auth-submit" type="submit">
						Sign up
					</button>
					<div
						className={`auth-message ${
							signupMessage.textClass
								? signupMessage.textClass
								: ""
						}`}
					>
						{signupMessage.message}
					</div>
				</div>
			</form>
		</div>
	);
}
