// @ts-nocheck
import { Route, Switch, useRouteMatch } from "react-router";
import ConditionalRedirect from "../../components/conditional-redirect";
import SideNav from "../../components/side-nav";
import { useStore } from "../../contexts/store-context";
import BranchPage from "../branch-page";
import EmployeePage from "../employee-page";
import RolePage from "../role-page";
import SchedulePage from "../schedule-page/";
import MenuManagerPage from "../menu-manager-page/";
import StoreSetup from "../store-setup";
import "./style.css";

export default function Dashboard(props) {
	const { path } = useRouteMatch();
	const store = useStore();

	//TODO: useEffect to fetch store information using user's id
	
	return (
		<div className="dashboard">
			<SideNav />
			<div className="dashboard-container">
				<Switch>
					<Route path={`${path}setup-store`} component={StoreSetup} />
                    {/* everyone of these path will redirect to create store page if store id is undefined */}
					<ConditionalRedirect
						path={`${path}`}
						exact
						condition={() => store.id === undefined}
						redirect="/setup-store"
						component={BranchPage}
					/>
					<ConditionalRedirect
						path={`${path}role`}
						exact
						condition={() => store.id === undefined}
						redirect="/setup-store"
						component={RolePage}
					/>
					<ConditionalRedirect
						path={`${path}employee`}
						exact
						condition={() => store.id === undefined}
						redirect="/setup-store"
						component={EmployeePage}
					/>
					<ConditionalRedirect
						path={`${path}schedule`}
						exact
						condition={() => store.id === undefined}
						redirect="/setup-store"
						component={SchedulePage}
					/>
					<ConditionalRedirect
						path={`${path}store-manager-page`}
						exact
						condition={() => store.id === undefined}
						redirect="/setup-store"
						component={MenuManagerPage}
					/>
				</Switch>
			</div>
		</div>
	);
}
