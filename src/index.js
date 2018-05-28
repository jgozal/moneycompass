import React from "react";
import ReactDOM from "react-dom";
import styled, { css } from 'react-emotion'

import StepCard from "./components/step-card";

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    vertical-align: center;
    align-items: center;
    height: 95vh;
`

class App extends React.Component {
  constructor (props) {
      super(props);
  }
  
  render() {
    return (
      <Container>
        <StepCard />
      </Container>
    );
  }
}

const wrapper = document.getElementById("app-container");
wrapper ? ReactDOM.render(<App />, wrapper) : false;

export default App;