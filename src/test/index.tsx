import "@babel/polyfill";
import { h, Component, render } from "preact";
import { Router, route } from "preact-router";
import ReactLoader from "./reactLoader";

class App extends Component {
    render() {
        return (
            <div>
                <button onClick={() => route("/angular")}>To Angular</button>
                <button onClick={() => route("/")}>To React</button>
                <Router>
                    <div path="/angular">Angular</div>
                    <ReactLoader id="react" path="/" />
                </Router>
            </div>
        );
    }
}

render(<App />, document.getElementById("root")!);
