import React from "react";

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
        <div className="step-card">
            Card Placeholder
        </div>
      );
    }
  }
  
  export default StepCard;