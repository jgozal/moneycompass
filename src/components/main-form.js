// References:
// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
// https://www.nerdwallet.com/mortgages/mortgage-rates/30-year-fixed

import _ from 'lodash';
import React from 'react';
import numeral from 'numeral';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { FV, PMT } from 'formulajs/lib/financial';

class MainForm extends React.Component {

  constructor() {
    super();

    this.calculate = this.calculate.bind(this);
    this.updateInput = this.updateInput.bind(this);

    this.state = this.calculate({
      investmentRate: 7,
      mortgageAmt: 200000,
      options: {
        a: {
          fv: 0,
          interestAmt: 0,
          apr: 4.3,
          mortgageTerm: 30,
          pmt: 0,
        },
        b: {
          fv: 0,
          interestAmt: 0,
          apr: 4,
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
      if (!isNaN(value)) {
        state = this.calculate(state);
      }
      this.setState(state);
  }

  calculate(state) {
    const COMPOUND_FREQUENCY = 12;

    const a = state.options.a;
    const b = state.options.b;

    if (!a.mortgageTerm || !b.mortgageTerm) {
      return state;
    }

    a.pmt = PMT(a.apr / 100 / COMPOUND_FREQUENCY, a.mortgageTerm * COMPOUND_FREQUENCY, state.mortgageAmt);
    a.interestAmt = a.pmt * (a.mortgageTerm * COMPOUND_FREQUENCY) + state.mortgageAmt;

    b.pmt = PMT(b.apr / 100 / COMPOUND_FREQUENCY, b.mortgageTerm * COMPOUND_FREQUENCY, state.mortgageAmt);
    b.interestAmt = b.pmt * (b.mortgageTerm * COMPOUND_FREQUENCY) + state.mortgageAmt;

    a.fv = FV(state.investmentRate / 100 / COMPOUND_FREQUENCY, a.mortgageTerm * COMPOUND_FREQUENCY, b.pmt - a.pmt, 0);
    b.fv = FV(state.investmentRate / 100 / COMPOUND_FREQUENCY, (a.mortgageTerm - b.mortgageTerm) * COMPOUND_FREQUENCY, b.pmt, 0);

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
                name="options.a.apr"
                onChange={this.updateInput}
                placeholder="Annual Percentage Rate"
                type="number"
                value={a.apr}
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
                name="options.b.apr"
                onChange={this.updateInput}
                placeholder="Annual Percentage Rate"
                type="number"
                value={b.apr}
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
            This is the amount of money you'll have if you invest ${numeral(-1 * (b.pmt - a.pmt).toFixed(0)).format('0,0')} on a monthly basis at a {numeral(this.state.investmentRate).format('0,0')}% annual return rate after {numeral(a.mortgageTerm).format('0,0')} years, minus a total mortgage interest of ${numeral(-1 * a.interestAmt.toFixed(0)).format('0,0')}: <b>${numeral(gainForA.toFixed(0)).format('0,0')}</b>
          </p>
          <p>
            This is the amount of money you'll have if you invest ${numeral(-1 * b.pmt.toFixed(0)).format('0,0')} on a monthly basis at a {numeral(this.state.investmentRate).format('0,0')}% annual return rate after {numeral(a.mortgageTerm - b.mortgageTerm).format('0,0')} years, minus a total mortgage interest of ${numeral(-1 * b.interestAmt.toFixed(0)).format('0,0')}: <b>${numeral(gainForB.toFixed(0)).format('0,0')}</b>
          </p>
          <p>
            Opportunity cost (the amount of money gained/lost by going with a {numeral(a.mortgageTerm).format('0,0')} year mortgage): <b>${numeral((gainForA - gainForB).toFixed(0)).format('0,0')}</b>
          </p>
          <h3>FAQ</h3>
          <h6>Why APR and not mortgage interest rate?</h6>
          <p>
            A mortgage interest rate does not include the necessary fees that come from taking the mortgage. You pay these fees upfront, and we need to factor in this opportunity cost.
          </p>
          <p>
            Learn more about here: <a href="https://www.bankrate.com/finance/mortgages/apr-and-interest-rate.aspx">https://www.bankrate.com/finance/mortgages/apr-and-interest-rate.aspx</a>
          </p>
        </div>
      </div>
    )
  }
}

export default MainForm;
