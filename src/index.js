import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor (props) {
      super(props);
      this.state = {
          inputvalue: ''
      }
      this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange (event) {
    this.setState({
        inputvalue: event.target.value
    })
  }
  
  render() {
    return (
      <div className="app">
          <form>
              <label>Name</label>
              <input type="text" value={this.state.inputvalue} onChange={this.handleChange}/>
              <input type="submit" value="Submit"/>
          </form>
      </div>
    );
  }
}

const wrapper = document.getElementById("app-container");
wrapper ? ReactDOM.render(<App />, wrapper) : false;

export default App;