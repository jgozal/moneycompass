// References:
// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
// https://www.nerdwallet.com/mortgages/mortgage-rates/30-year-fixed
// https://michaelbluejay.com/house/15vs30.html

import React from 'react';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Accordion from './accordion';

import _ from 'lodash';
import numeral from 'numeral';
import { FV, PMT } from 'formulajs/lib/financial';
import styled, { css } from "react-emotion";

// DEFAULT VALUES

const COMPOUND_FREQUENCY = 12;

const DEFAULT_OPTION = {
  interestAmt: 0,
  interestRate: 0,
  term: 0,
  pmt: 0,
  fv: 0
};

let o1 = Object.assign({}, DEFAULT_OPTION);
let o2 = Object.assign({}, DEFAULT_OPTION);

o1.interestRate = 4.3;
o1.term = 30;

o2.interestRate = 4;
o2.term = 15;

// CSS

const MainContainer = styled('div')`
  display: flex;
  flex-direction: row;
`
const Sections = styled('div')`
  width: 40%;
`

const Result = styled('div')`
  width: 60%;
`

const Info = styled('p')`
  font-size: 14px;
  margin-bottom: 10px;
  color: grey;
`

const Section = styled('div')`
  margin-bottom: 40px;
  border-left: 6px solid red;
  padding-left: 25px;

  .input-group {
    width: 80%;
    margin-right: 25px;
    margin-bottom: 15px;
  }
`

const InputContainer = styled('div')`
  display: flex;
  flex-direction: row;
`

const InputWrapper = styled('div')`
  display: flex;
  flex-direction: column;

  label {
    font-size: 12px;
    font-weight: 600;
    margin-left: 2px;
  }
`

class MainForm extends React.Component {

  constructor() {
    super();
    this.calculatePMT = this.calculatePMT.bind(this)
    this.calculateInterestAmt = this.calculateInterestAmt.bind(this)
    this.calculateFV = this.calculateFV.bind(this)
    this.calculateOpportunityCost = this.calculateOpportunityCost.bind(this);
    this.updateInput = this.updateInput.bind(this)
    this.calculateAll = this.calculateAll.bind(this);
    this.state = {
      investmentRate: 9,
      loanAmt: 200000,
      inflation: 2,
      optCost: 0,
      options: {
        o1, o2
      }
    }
  }

  componentWillMount() {
    // Running all calculations with default values on page load
    this.setState(this.calculateAll(this.state));
  }

  // Returns monthly payment.
  calculatePMT(o, state) {
    return PMT((o.interestRate - state.inflation) / 100 / COMPOUND_FREQUENCY, o.term * COMPOUND_FREQUENCY, state.loanAmt);
  }

  // Returns interest amount and depends on payment (PMT).
  calculateInterestAmt(o, state) {
    return o.pmt * (o.term * COMPOUND_FREQUENCY) + state.loanAmt;
  }

  // Returns future value dynamically depending on mortgage term length.
  calculateFV(o1, o2, state) {
    // TODO: what if terms of o1 and o2 are equal?
    if (o1.term > o2.term) {
      return FV((state.investmentRate - state.inflation) / 100 / COMPOUND_FREQUENCY, o1.term * COMPOUND_FREQUENCY, o2.pmt - o1.pmt, 0);
    } else if (o1.term < o2.term) {
      return FV((state.investmentRate - state.inflation) / 100 / COMPOUND_FREQUENCY, (o2.term - o1.term) * COMPOUND_FREQUENCY, o1.pmt, 0);
    }
  }

  // Returns opportunity cost of choosing o1 over o2. Opportunity cost can be positive and negative.
  calculateOpportunityCost(o1, o2) {
    return (o1.fv + o1.interestAmt) - (o2.fv + o2.interestAmt);
  }

  // Runs every time an input is updated and uses input's name tag to make specific changes in the state
  updateInput(e) {
    let state = Object.assign({}, this.state);
    const key = e.target.name;

    const value = parseFloat(e.target.value);

    _.set(state, key, value);
    if (!isNaN(value)) {
      state = this.calculateAll(state);
    }
    this.setState(state);
  }

  // Runs all calculations and returns a modified state
  calculateAll(state) {
    o1 = state.options.o1;
    o2 = state.options.o2;

    o1.pmt = this.calculatePMT(o1, state);
    o2.pmt = this.calculatePMT(o2, state);

    o1.interestAmt = this.calculateInterestAmt(o1, state);
    o2.interestAmt = this.calculateInterestAmt(o2, state);

    o1.fv = this.calculateFV(o1, o2, state);
    o2.fv = this.calculateFV(o2, o1, state);

    state.optCost = this.calculateOpportunityCost(o1, o2);

    return state;
  }

  render() {
    return (
      <MainContainer>
        <Sections>
          <Section>
            <h6>Loan Amount</h6>
            <Info>The total amount that you promise to pay back. This is the amount after the down payment has been paid.</Info>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <Input
                name="loanAmt"
                placeholder="Loan Amount"
                type="number"
                value={this.state.loanAmt}
                onChange={this.updateInput}
              />
            </InputGroup>
            <Accordion
              title="How to determine the budget/ Income, etc"
              body="Some quick explanation for what this is"
            />
          </Section>

          <Section>
            <h6>Loan Term</h6>
            <Info>The time that you have to repay the loan.</Info>
            <InputContainer>
              <InputWrapper>
                <label>Mortgage Option 1</label>
                <InputGroup>
                  <Input
                    name="options.o1.term"
                    placeholder="Loan Term"
                    type="number"
                    value={o1.term}
                    onChange={this.updateInput}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>years</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </InputWrapper>
              <InputWrapper>
                <label>Mortgage Option 2</label>
                <InputGroup>
                  <Input
                    name="options.o2.term"
                    placeholder="Loan Term"
                    type="number"
                    value={o2.term}
                    onChange={this.updateInput}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>years</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </InputWrapper>
            </InputContainer>
            <Accordion
              title="Fixed vs. Variable (vs Adjusted)"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="Pros and Cons 30 vs 15"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="What happens after the shorter term runs out"
              body="Some quick explanation for what this is"
            />
          </Section>

          <Section>
            <h6>Annual Percentage Rate (APR) & Interest</h6>
            <Info>The cost of credit, including the interest and fees, expressed as an interest rate. APR was created to make it easier for consumers to compare loans with different rates and costs, and by law it must be disclosed in all advertising.</Info>
            <InputContainer>
              <InputWrapper>
                <label>Mortgage Option 1</label>
                <InputGroup>
                  <Input
                    name="options.o1.interestRate"
                    placeholder="APR"
                    type="number"
                    value={o1.interestRate}
                    onChange={this.updateInput}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>%</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </InputWrapper>
              <InputWrapper>
                <label>Mortgage Option 2</label>
                <InputGroup>
                  <Input
                    name="options.o2.interestRate"
                    placeholder="APR"
                    type="number"
                    value={o2.interestRate}
                    onChange={this.updateInput}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>%</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </InputWrapper>
            </InputContainer>
            <Accordion
              title="What is an APR, what it includes (Mortgage interest rate)"
              body="Some quick explanation for what this is"
            />
          </Section>

          <Section>
            <h6>Return on Investment (ROI)</h6>
            <Info>Some quick explanation for what this is</Info>
            <InputGroup>
              <Input
                name="investmentRate"
                placeholder="ROI"
                type="number"
                value={this.state.investmentRate}
                onChange={this.updateInput}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Accordion
              title="How to invest (talk about brokers)"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="What is an asset and types of assets"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="Expected/Average returns by asset"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="Volatility/Risk and Diversification"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="Long term vs short term"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="Retirement accounts vs brokerage accounts"
              body="Some quick explanation for what this is"
            />
          </Section>

          <Section>
            <h6>Inflation</h6>
            <Info>Some quick explanation for what this is</Info>
            <InputGroup>
              <Input
                name="inflation"
                placeholder="Inflation"
                type="number"
                value={this.state.inflation}
                onChange={this.updateInput}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Accordion
              title="What is inflation"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="How do you determine inflation"
              body="Some quick explanation for what this is"
            />
            <Accordion
              title="How inflation affects your mortgage and investments"
              body="Some quick explanation for what this is"
            />
          </Section>
        </Sections>

        <Result>
          <pre>{JSON.stringify(this.state, null, 4).replace(/[{}]/g, '')}</pre>
        </Result>

      </MainContainer>
    )
  }
}

export default MainForm;
