import React from "react";
import styled, { css } from 'react-emotion'
import Input from "../subcomponents/input";

class StepCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputvalue: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            inputvalue: event.target.value
        })
    }

    render() {
        return (
            <Card>
                <Question>What is your annual income?</Question>
                <Input />
                <Button type="button">Next</Button>
            </Card>
        );
    }
}

export default StepCard;
