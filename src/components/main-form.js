// References:
// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
// https://www.nerdwallet.com/mortgages/mortgage-rates/30-year-fixed
// https://michaelbluejay.com/house/15vs30.html

import _ from 'lodash';
import React from 'react';
import numeral from 'numeral';
import styled, { css } from "react-emotion";
import { Input } from 'reactstrap';
import { FV, PMT } from 'formulajs/lib/financial';


const COMPOUND_FREQUENCY = 12;

const o = {
  interestAmt: 0,
  interestRate: 0,
  term: 0,
  pmt: 0,
  fv: 0
};

let o1 = Object.assign({}, o);
let o2 = Object.assign({}, o);

const Row = styled('div')`
  display: flex;
  flex-direction: row;
`

class MainForm extends React.Component {

  constructor() {
    super();
    this.calculatePMT = this.calculatePMT.bind(this)
    this.calculateInterestAmt = this.calculateInterestAmt.bind(this)
    this.calculateFV = this.calculateFV.bind(this)
    this.updateInput = this.updateInput.bind(this)
    this.state = {
      investmentRate: 7,
      loanAmt: 200000,
      inflation: 2,
      options: {
        o1, o2
      }
    }
  }

  componentWillMount() {
    o1.interestRate = 4.3;
    o1.term = 30;

    o2.interestRate = 4;
    o2.term = 15;
  }

  componentDidMount() {
    console.log(o1)
    console.log(o2)
    console.log(this.state)
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.calculatePMT(nextProps.state.options.o1))
    console.log(this.calculatePMT(nextProps.state.options.o2))
    console.log(this.calculateInterestAmt(nextProps.state.options.o1))
    console.log(this.calculateInterestAmt(nextProps.state.options.o2))
    console.log(this.calculateFV(nextProps.state.options.o1, nextProps.state.options.o2))
    console.log(this.calculateFV(nextProps.state.options.o2, nextProps.state.options.o1))
  }

  calculatePMT(o) {
    return PMT(o.interestRate / 100 / COMPOUND_FREQUENCY, o.term * COMPOUND_FREQUENCY, this.state.loanAmt);
  }

  calculateInterestAmt(o) {
    return o.pmt * (o.term * COMPOUND_FREQUENCY) + this.state.loanAmt
  }

  calculateFV(o1, o2) {
     // TODO: what if o1 and o2 are equal?
    if (o1.term > o2.term) {
      return FV(this.state.investmentRate / 100 / COMPOUND_FREQUENCY, o1.term * COMPOUND_FREQUENCY, o2.pmt - o1.pmt, 0);
    } else if (o1.term < o2.term) {
      return FV(this.state.investmentRate / 100 / COMPOUND_FREQUENCY, (o1.term - o2.term) * COMPOUND_FREQUENCY, o2.pmt, 0);
    }   
  }
  
  updateInput(e) {
    let state = _.cloneDeep(this.state);
    const key = e.target.name;

    // key and value be explicit

    const value = parseFloat(e.target.value);

    _.set(state, key, value);
    if (!isNaN(value)) {
      state = this.calculate(state);
    }
    this.setState(state);
  }

  render() {
    o1 = this.state.options.o1;
    o2 = this.state.options.o2;

    return (
      <div className="main-container">
        <div className="section">
          <h5>Loan Amount</h5>
          <Input
            name=""
            placeholder="Loan Amount"
            type="number"
            value={this.state.loanAmt}
            onChange={this.updateInput}
          />
        </div>
        <div className="section">
          <h5>Loan Term</h5>
          <Row>
            <Input
              name=""
              placeholder="Loan Term"
              type="number"
              value={o1.term}
              onChange={this.updateInput}
            />
            <Input
              name=""
              placeholder="Loan Term"
              type="number"
              value={o2.term}
              onChange={this.updateInput}
            />
          </Row>
        </div>
        <div className="section">
          <h5>Interest/APR</h5>
          <Row>
            <Input
              name=""
              placeholder="APR"
              type="number"
              value={o1.interestRate}
              onChange={this.updateInput}
            />
            <Input
              name=""
              placeholder="APR"
              type="number"
              value={o2.interestRate}
              onChange={this.updateInput}
            />
          </Row>
        </div>
        <div className="section">
          <h5>Return on Investment (ROI)</h5>
          <Input
            name=""
            placeholder="ROI"
            type="number"
            value={this.state.investmentRate}
            onChange={this.updateInput}
          />
        </div>
        <div className="section">
          <h5>Inflation</h5>
          <Input
            name=""
            placeholder="Inflation"
            type="number"
            value={this.state.inflation}
            onChange={this.updateInput}
          />
        </div>
      </div>
    )
  }
}

export default MainForm;
