import "@babel/polyfill";
import { createBrowserHistory } from "history";
import { Component, h, render } from "preact";
import ReactLoader from "./reactLoader";
import VueLoader from "./vueLoader";
import { Route, Router, Switch, Redirect } from "./router";

const history = createBrowserHistory();

class App extends Component {
    render() {
        return (
            <div>
                <button onClick={() => history.push("/react")}>To React</button>
                <button onClick={() => history.push("/vue2")}>To Vue</button>
                <Router history={history}>
                    <Switch>
                        <Route path="/vue2" component={VueLoader} />
                        <Route path="/react" component={ReactLoader} />
                        <Route
                            path="/"
                            render={() => <Redirect to="/react" />}
                        />
                    </Switch>
                </Router>
            </div>
        );
    }
}

render(<App />, document.getElementById("root")!);
