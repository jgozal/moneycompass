import React from "react";
import styled, { css } from 'react-emotion'

const Card = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;
    width: 600px;
    background: #F5F5F5;
`

class StepCard extends React.Component {
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
        <Card>
            Step Card Placeholder
        </Card>
      );
    }
  }
  
  export default StepCard;