import React from "react";
import ReactDOM from "react-dom";
import StepCard from "./components/step-card";

class App extends React.Component {
  constructor (props) {
      super(props);
  }
  
  render() {
    return (
      <div className="app">
        <StepCard />
      </div>
    );
  }
}

const wrapper = document.getElementById("app-container");
wrapper ? ReactDOM.render(<App />, wrapper) : false;

export default App;