import React from "react";
import styled, { css } from 'react-emotion'
import Input from "../subcomponents/input";

const Card = styled('div') `
    background-color: rgba(245,245,245,0.75);
    display: flex;
    flex-direction: column;
    height: 325px;
    width: 600px;
    align-items: center;
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
`

const Question = styled('div') `
    text-align: center;
    margin-top: 50px;
    font-size: 24px;
`

const Button = styled('button') `
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 18px;
    margin-top: 45px;
`

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