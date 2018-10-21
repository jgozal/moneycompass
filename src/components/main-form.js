// TODO:
// - Set return amount
// - Basic styling

import _ from 'lodash';
import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { FV, PMT } from 'formulajs/lib/financial';

class MainForm extends React.Component {

  constructor() {
    super();
    this.calculate = this.calculate.bind(this);
    this.state = this.calculate({
      investmentRate: 0.07,
      mortgageAmt: 200000,
      mortgageInterestRate: 0.04,
      options: {
        a: {
          fv: 0,
          interestAmt: 0,
          mortgageTerm: 30,
          pmt: 0,
        },
        b: {
          fv: 0,
          interestAmt: 0,
          mortgageTerm: 15,
          pmt: 0,
        }
      }
    })
  }

  updateInput(e) {
    const state = _.cloneDeep(this.state);
    const key = e.target.name;
    const value = Number(e.target.value);
    _.set(state, key, value);
    const updatedState = this.calculate(state);
    this.setState(updatedState);
  }

  // TODO:
  // What's the longest time to invest?
  // When I'm done with the mortgage, then invest for the rest of the time
  calculate(state) {
    const COMPOUND_FREQUENCY = 12

    state.options.a.pmt = PMT(state.mortgageInterestRate / COMPOUND_FREQUENCY, state.options.a.mortgageTerm * COMPOUND_FREQUENCY, state.mortgageAmt);
    state.options.a.interestAmt = state.options.a.pmt * (state.options.a.mortgageTerm * COMPOUND_FREQUENCY) + state.mortgageAmt;

    state.options.b.pmt = PMT(state.mortgageInterestRate / COMPOUND_FREQUENCY, state.options.b.mortgageTerm * COMPOUND_FREQUENCY, state.mortgageAmt);
    state.options.b.interestAmt = state.options.b.pmt * (state.options.b.mortgageTerm * COMPOUND_FREQUENCY) + state.mortgageAmt;

    state.options.a.fv = FV(state.investmentRate / COMPOUND_FREQUENCY, state.options.a.mortgageTerm * COMPOUND_FREQUENCY, state.options.b.pmt - state.options.a.pmt, 0)
    state.options.b.fv = FV(state.investmentRate / COMPOUND_FREQUENCY, (state.options.a.mortgageTerm - state.options.b.mortgageTerm) * COMPOUND_FREQUENCY, state.options.b.pmt, 0)

    return state
  }

  render() {
    // TODO: Calculate PMT
    // TODO: Calculate interest amount

    let gainForA = this.state.options.a.fv + this.state.options.a.interestAmt
    let gainForB = this.state.options.b.fv + this.state.options.b.interestAmt

    return (
      <div className="clearfix">
        <div className="col col-6">
          <label>What is your mortgate interest rate?</label>
          <Input type="number" name="mortgageInterestRate" value={this.state.mortgageInterestRate} placeholder="Interest rate (annual)" onChange={this.updateInput}/>
          <label>How long is your first mortgate option?</label>
          <Input type="number" name="options.a.mortgageTerm" value={this.state.options.a.mortgageTerm} placeholder="Number of years" onChange={this.updateInput}/>
          <label>How long is your second mortgate option?</label>
          <Input type="number" name="options.b.mortgageTerm" value={this.state.options.b.mortgageTerm} placeholder="Number of years (to compare)" onChange={this.updateInput}/>
          <label>How much is your mortgage amount (the loan you are taking out)?</label>
          <Input type="number" name="mortgageAmt" value={this.state.mortgageAmt} placeholder="Mortgage amount (the loan you are taking out)" onChange={this.updateInput}/>
          <label>What is the expected return if you invest your money instead?</label>
          <Input type="number" name="investmentRate" value={this.state.investmentRate} placeholder="Expected return for your investments" onChange={this.updateInput}/>
        </div>
        <div className="col col-6">
          <div>The amount of money you'll have if you invest {-1 * (this.state.options.b.pmt - this.state.options.a.pmt).toFixed(0)} on a monthly basis at a {this.state.investmentRate} annual return rate after {this.state.options.a.mortgageTerm} years: {this.state.options.a.fv.toFixed(0)}</div>
          <div>FV for B: {this.state.options.b.fv.toFixed(0)}</div>
          <div>FV for A minus interest: {gainForA.toFixed(0)}</div>
          <div>FV for B minus interest: {gainForB.toFixed(0)}</div>
          <div>Opportunity cost: {(gainForA - gainForB).toFixed(0)}</div>
        </div>
      </div>
    )
  }
}

export default MainForm;

// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
