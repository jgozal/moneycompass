// References:
// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
// https://www.nerdwallet.com/mortgages/mortgage-rates/30-year-fixed

import _ from 'lodash';
import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { FV, PMT } from 'formulajs/lib/financial';

class MainForm extends React.Component {

  constructor() {
    super();

    this.calculate = this.calculate.bind(this);
    this.updateInput = this.updateInput.bind(this);

    this.state = this.calculate({
      investmentRate: 0.07,
      mortgageAmt: 200000,
      options: {
        a: {
          fv: 0,
          interestAmt: 0,
          mortgageInterestRate: 0.043,
          mortgageTerm: 30,
          pmt: 0,
        },
        b: {
          fv: 0,
          interestAmt: 0,
          mortgageInterestRate: 0.04,
          mortgageTerm: 15,
          pmt: 0,
        }
      }
    });
  }

  updateInput(e) {
    let state = _.cloneDeep(this.state);
    const key = e.target.name;

    // key and value be explicit

    const value = parseFloat(e.target.value);

    _.set(state, key, value);
    state = this.calculate(state);
    this.setState(state);
  }

  // TODO:
  // What's the longest time to invest?
  // When I'm done with the mortgage, then invest for the rest of the time
  calculate(state) {
    const COMPOUND_FREQUENCY = 12;

    const a = state.options.a;
    const b = state.options.b;

    if (!a.mortgageTerm || !b.mortgageTerm) {
      return state;
    }

    a.pmt = PMT(a.mortgageInterestRate / COMPOUND_FREQUENCY, a.mortgageTerm * COMPOUND_FREQUENCY, state.mortgageAmt);
    a.interestAmt = a.pmt * (a.mortgageTerm * COMPOUND_FREQUENCY) + state.mortgageAmt;

    b.pmt = PMT(b.mortgageInterestRate / COMPOUND_FREQUENCY, b.mortgageTerm * COMPOUND_FREQUENCY, state.mortgageAmt);
    b.interestAmt = b.pmt * (b.mortgageTerm * COMPOUND_FREQUENCY) + state.mortgageAmt;

    a.fv = FV(state.investmentRate / COMPOUND_FREQUENCY, a.mortgageTerm * COMPOUND_FREQUENCY, b.pmt - a.pmt, 0);
    b.fv = FV(state.investmentRate / COMPOUND_FREQUENCY, (a.mortgageTerm - b.mortgageTerm) * COMPOUND_FREQUENCY, b.pmt, 0);

    return state;
  }

  render() {
    const a = this.state.options.a;
    const b = this.state.options.b;

    let gainForA = a.fv + a.interestAmt;
    let gainForB = b.fv + b.interestAmt;

    return (
      <div className="row">
        <div className="col-4 border-right">
          <div className="row">
            <div className="col-6">
              <h4>Mortgage 1</h4>
              <label>What is the mortgage's APR? (annual percentage rate)</label>
              <Input
                className="mb-2"
                name="options.a.mortgageInterestRate"
                onChange={this.updateInput}
                placeholder="Annual Percentage Rate"
                type="number"
                value={a.mortgageInterestRate}
                />
              <label>What is the term of the first mortgage? (in years)</label>
              <Input
                className="mb-2"
                name="options.a.mortgageTerm"
                onChange={this.updateInput}
                placeholder="Number of years"
                type="number"
                value={a.mortgageTerm}
                />
            </div>
            <div className="col-6">
              <h4>Mortgage 2</h4>
              <label>What is the mortgage's APR? (annual percentage rate)</label>
              <Input
                className="mb-2"
                name="options.b.mortgageInterestRate"
                onChange={this.updateInput}
                placeholder="Annual Percentage Rate"
                type="number"
                value={b.mortgageInterestRate}
                />
              <label>What is the term of the second mortgage? (in years)</label>
              <Input
                className="mb-2"
                name="options.b.mortgageTerm"
                onChange={this.updateInput}
                placeholder="Number of years"
                type="number"
                value={b.mortgageTerm}
                />
            </div>
          </div>
          <label>What is the size of your loan?</label>
          <Input
            className="mb-2"
            name="mortgageAmt"
            onChange={this.updateInput}
            placeholder="Mortgage amount"
            type="number"
            value={this.state.mortgageAmt}
            />
          <label>What is your expected return if you invest your money?</label>
          <Input
            className="mb-2"
            name="investmentRate"
            onChange={this.updateInput}
            placeholder="Expected return for your investments"
            type="number"
            value={this.state.investmentRate}
            />
        </div>
        <div className="col-8">
          <p>
            This is the amount of money you'll have if you invest {-1 * (b.pmt - a.pmt).toFixed(0)}
            on a monthly basis at a {this.state.investmentRate} annual return rate
            after {a.mortgageTerm} years, minus a total mortgage interest of
            {-1 * a.interestAmt.toFixed(0)}: {gainForA.toFixed(0)}
          </p>
          <p>
            This is the amount of money you'll have if you invest {-1 * b.pmt.toFixed(0)}
            on a monthly basis at a {this.state.investmentRate} annual return rate
            after {a.mortgageTerm - b.mortgageTerm} years, minus a total mortgage
            interest of {-1 * b.interestAmt.toFixed(0)}: {gainForB.toFixed(0)}
          </p>
          <p>
            Opportunity cost (the amount of money gained/lost by going with a
            {a.mortgageTerm} year mortgage): {(gainForA - gainForB).toFixed(0)}
          </p>
        </div>
      </div>
    )
  }
}

export default MainForm;
