import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import jwt from "jsonwebtoken";
import privateKey from "../config/privateKey";

const cookies = new Cookies();

export const IsAuthContext = createContext({});
export const SetIsAuthContext = createContext((v)=>{});
export const SetAuthTokenContext = createContext((v)=>{});
export const LogoutContext = createContext(()=>{});
export const GetUserTokenContext = createContext(() => {});

//TODO: User information such as username and profile picture should also be stored here, and be provided to side nav

export function useIsAuth() {
	return useContext(IsAuthContext);
}

export function useSetIsAuth() {
	return useContext(SetIsAuthContext);
}

export function useSetAuthToken() {
	return useContext(SetAuthTokenContext);
}

export function useLogout() {
	return useContext(LogoutContext);
}

export function useGetUserToken() {
	return useContext(GetUserTokenContext);
}

export function AuthProvider({ children }) {
	const [isAuth, setIsAuth] = useState(false);

	const logout = function () {
		axios
			.post(
				"https://run.mocky.io/v3/4a355b58-42cc-4407-a21b-724ef06c3253/logout"
			)
			.then(() => {
				console.log("Logged out");
				cookies.remove("services", {
					path: "/",
				});
				setIsAuth(false);
				window.location.replace("/auth");
			});
	};

	const setAuthToken = function (data) {
		const savedToken = jwt.sign(
			JSON.stringify({
				...data,
				expires: new Date(Date.now() + 1 * 58 * 60 * 1000),
			}),
			privateKey
		);
		cookies.set("services", savedToken, {
			path: "/",
		});

		axios.defaults.headers.common[
			"Authorization"
		] = `Bearer ${data.accessToken}`;

		setIsAuth(true);
	};

	const getUserToken = function () {
		return jwt.verify(cookies.get("services"), privateKey);
	}

	useEffect(() => {
		if (!isAuth && cookies.get("services")) {
			const savedToken = jwt.verify(cookies.get("services"), privateKey);
			axios.defaults.headers.common[
				"Authorization"
			// @ts-ignore
			] = `Bearer ${savedToken.accessToken}`;
			setIsAuth(true);
		}
	}, [isAuth]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (cookies.get("services")) {
				// @ts-ignore
				let { expires, refreshToken } = jwt.verify(
					cookies.get("services"),
					privateKey
				);
				const now = new Date(Date.now());
				expires = new Date(expires);

				if (now > expires) {
					axios
						.get(
							"https://run.mocky.io/v3/f681a2a4-c4e9-49e5-9359-5b1b6f86dd88/token",

							{
								headers: {
									Authorization: `Bearer ${refreshToken}`,
								},
							}
						)
						.then(({ data }) => {
							setAuthToken(data);
						});
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	return (
		<IsAuthContext.Provider value={isAuth}>
			<SetIsAuthContext.Provider value={setIsAuth}>
				<LogoutContext.Provider value={logout}>
					<SetAuthTokenContext.Provider value={setAuthToken}>
						<GetUserTokenContext.Provider value={getUserToken}>
							{children}
						</GetUserTokenContext.Provider>
					</SetAuthTokenContext.Provider>
				</LogoutContext.Provider>
			</SetIsAuthContext.Provider>
		</IsAuthContext.Provider>
	);
}
