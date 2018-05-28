import React from "react";
import styled, { css } from 'react-emotion';

const inputStyle = css`
    height: 35px;
    width: 300px;
    margin-top: 45px;
    font-size: 18px;

    :focus { 
        outline: none !important;
        border:1px solid #4CAF50;
    }
`;

const iconStyle = css`
    background-color: rgb(245,245,245);
    padding: 11px 11px 11px 11px;
    border:1px solid grey;
    border-right: none;
`;

class Input extends React.Component {
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
            <div>
                <span className ={iconStyle}>$</span>
                <input
                    type="text"
                    className={inputStyle}
                />
            </div>
        );
    }
}

export default Input;