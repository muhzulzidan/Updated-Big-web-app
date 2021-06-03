import { Route, Switch } from "react-router";
import { useRouteMatch } from "react-router-dom";
import NewStore from "./new-store";
import StoreContact from "./store-contact";
import StoreDetail from "./store-detail";
import StoreDocument from "./store-document";
import "./style.css";

export default function StoreSetup(props) {
    const { path, url } = useRouteMatch();
    return (
        <div className="store-setup-container">
            <div className="mt-5 ml-5 store-setup-h2">Store</div>
            <Switch>
                <Route path={`${path}`} exact component={NewStore}/>
                <Route path={`${path}/detail`} exact component={StoreDetail}/>
                <Route path={`${path}/contact`} exact component={StoreContact}/>
                <Route path={`${path}/document`} exact component={StoreDocument}/>
            </Switch>
        </div>
    )
}