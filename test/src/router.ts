import {
    Router as ReactRouter,
    Route as ReactRoute,
    Switch as ReactSwitch,
    RouteProps,
    Redirect as ReactRedirect,
    RedirectProps,
    RouteComponentProps,
} from "react-router-dom";
import { RouterProps, SwitchProps } from "react-router";
import * as H from "history";
import { Component, VNode, ComponentFactory } from "preact";

declare module "react-router-dom" {
    interface RouteProps {
        location?: H.Location;
        component?:
            | ComponentFactory<RouteComponentProps<any>>
            | ComponentFactory<any>;
        render?: ((props: RouteComponentProps<any>) => VNode);
        children?: ((props: RouteComponentProps<any>) => VNode) | VNode;
        path?: string | string[];
        exact?: boolean;
        sensitive?: boolean;
        strict?: boolean;
    }
}

interface Router extends Component<RouterProps, any> {
    new (props: RouterProps): Router;
}
interface Route<T extends RouteProps = RouteProps> extends Component<T, any> {
    new (props: T): Route;
}

interface Redirect extends Component<RedirectProps, any> {
    new (props: RedirectProps): Redirect;
}

interface Switch extends Component<SwitchProps, any> {
    new (props: SwitchProps): Switch;
}

const Route = (ReactRoute as any) as Route;
const Redirect = (ReactRedirect as any) as Redirect;
const Router = (ReactRouter as any) as Router;
const Switch = (ReactSwitch as any) as Switch;

export {
    Route,
    Redirect,
    Router,
    Switch,
    RouteProps,
    RouterProps,
    SwitchProps,
    RedirectProps,
    RouteComponentProps,
};
