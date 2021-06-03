import { Redirect, Route } from "react-router";

/**
 * this component will act as a simple Route if condition is not provided or calling the condition function return false
 * when calling the condition function return true, this component will redirect you to the link in redirect prop
 */
export default function ConditionalRedirect({condition, redirect, component: Component, ...rest}) {
    if(condition && condition()) {
        return <Redirect to={redirect}/>;
    }

    return <Route {...rest} render={props => <Component {...props}/>} />;
}