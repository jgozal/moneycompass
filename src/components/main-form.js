import _ from 'lodash';
import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { PMT } from 'formulajs/lib/financial';

class MainForm extends React.Component {

  constructor() {
    super();
    this.calculate = this.calculate.bind(this);
    this.state = {
      mortgageAmt: 200000,
      mortgageInterestRate: 0.003333,
      options: {
        a: {
          interestAmt: 0,
          mortgageTerm: 360,
          pmt: 0,
        },
        b: {
          interestAmt: 0,
          mortgageTerm: 180,
          pmt: 0,
        }
      }
    }
  }

  calculate(e) {
    const state = _.cloneDeep(this.state);
    const key = e.target.name;
    const value = Number(e.target.value);
    _.set(state, key, value);

    state.options.a.pmt = PMT(state.mortgageInterestRate, state.options.a.mortgageTerm, state.mortgageAmt);
    state.options.a.interestAmt = state.options.a.pmt * state.options.a.mortgageTerm + state.mortgageAmt;

    state.options.b.pmt = PMT(state.mortgageInterestRate, state.options.b.mortgageTerm, state.mortgageAmt);
    state.options.b.interestAmt = state.options.b.pmt * state.options.b.mortgageTerm + state.mortgageAmt;

    this.setState(state);
  }

  render() {
    // TODO: Calculate PMT
    // TODO: Calculate interest amount
    return (
      <div>
        <Input type="number" name="mortgageInterestRate" value={this.state.mortgageInterestRate} placeholder="Interest rate (annual)" onChange={this.calculate}/>
        <Input type="number" name="options.a.mortgageTerm" value={this.state.options.a.mortgageTerm} placeholder="Number of years" onChange={this.calculate}/>
        <Input type="number" name="options.b.mortgageTerm" value={this.state.options.b.mortgageTerm} placeholder="Number of years (to compare)" onChange={this.calculate}/>
        <Input type="number" name="mortgageAmt" value={this.state.mortgageAmt} placeholder="Mortgage amount (the loan you are taking out)" onChange={this.calculate}/>
      </div>
    )
  }
}

export default MainForm;

// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
