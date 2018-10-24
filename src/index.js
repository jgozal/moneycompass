import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import ReactDOM from "react-dom";

import MainForm from "./components/main-form";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div class="p-2">
          Hello world!
        </div>
        <MainForm />
      </div>
    );
  }
}

const wrapper = document.getElementById("app-container");
wrapper ? ReactDOM.render(<App />, wrapper) : false;

export default App;
