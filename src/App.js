import { BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import ConditionalRedirect from "./components/conditional-redirect";
import { AuthProvider } from "./contexts/auth-context";
import LoginPage from "./pages/login-page";
import Dashboard from "./pages/dashboard";
import Cookies from "universal-cookie";
import { StoreProvider } from "./contexts/store-context";

const cookies = new Cookies();

function App() {
	return (
		<AuthProvider>
			<StoreProvider>
				<BrowserRouter>
					<Switch>
						{/* route to login page, if you have a token, redirect to dashboard */}
						<ConditionalRedirect
							path="/auth"
							exact
							condition={() => cookies.get("services")}
							redirect="/"
							component={LoginPage}
						/>
						{/* route to dashboard, if you don't have a token, redirect to login page */}
						<ConditionalRedirect
							path="/"
							condition={() => !cookies.get("services")}
							redirect="/auth"
							component={Dashboard}
						/>
					</Switch>
				</BrowserRouter>
			</StoreProvider>
		</AuthProvider>
	);
}

export default App;
