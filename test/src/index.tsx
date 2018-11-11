import "@babel/polyfill";
import { h, Component, render } from "preact";
import { Router, route } from "preact-router";
import ReactLoader from "./reactLoader";
import VueLoader from "./vueLoader";
import Redirect from "redirect";

class App extends Component {
    render() {
        return (
            <div>
                <button onClick={() => route("/react")}>To React</button>
                <button onClick={() => route("/vue")}>To Vue</button>
                <Router>
                    <VueLoader path="/vue" />
                    <ReactLoader id="react" path="/react" />
                    <Redirect path="/" to="/vue" />
                </Router>
            </div>
        );
    }
}

render(<App />, document.getElementById("root")!);
