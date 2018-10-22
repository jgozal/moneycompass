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
        <MainForm />
      </div>
    );
  }
}

const wrapper = document.getElementById("app-container");
wrapper ? ReactDOM.render(<App />, wrapper) : false;

export default App;
