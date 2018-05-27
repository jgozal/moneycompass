import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/input";

class MainPage extends Component {
  
  constructor() {
    super();
    this.state = {
      question_1: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
      
    return (
      <form id="user-form">
        <Input
          text="Question 1"
          label="question_1"
          type="text"
          id="question_1"
          value={this.state.question_1}
          handleChange={this.handleChange}
        />
      </form>
    );
  }
}

export default MainPage;

const wrapper = document.getElementById("main-page");
wrapper ? ReactDOM.render(<MainPage />, wrapper) : false;