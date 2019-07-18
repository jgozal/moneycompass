// References:
// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
// https://www.nerdwallet.com/mortgages/mortgage-rates/30-year-fixed
// https://michaelbluejay.com/house/15vs30.html

import _ from 'lodash'
import React from 'react'
import styled from 'react-emotion'
import { Input } from 'reactstrap'
import { FV, PMT } from 'formulajs/lib/financial'

// DEFAULT VALUES

const COMPOUND_FREQUENCY = 12

const DEFAULT_OPTION = {
  interestAmt: 0,
  interestRate: 0,
  term: 0,
  pmt: 0,
  fv: 0
}

let option1 = _.cloneDeep(DEFAULT_OPTION)
let option2 = _.cloneDeep(DEFAULT_OPTION)

option1.interestRate = 4.3
option1.term = 30

option2.interestRate = 4
option2.term = 15

// CSS

const Row = styled('div')`
  display: flex;
  flex-direction: row;
`

class MainForm extends React.Component {
  constructor () {
    super()
    this.calculatePMT = this.calculatePMT.bind(this)
    this.calculateInterestAmt = this.calculateInterestAmt.bind(this)
    this.calculateFV = this.calculateFV.bind(this)
    this.calculateOpportunityCost = this.calculateOpportunityCost.bind(this)
    this.updateInput = this.updateInput.bind(this)
    this.calculateAll = this.calculateAll.bind(this)
    this.state = {
      investmentRate: 9,
      loanAmt: 200000,
      inflation: 2,
      optCost: 0,
      options: {
        option1,
        option2
      }
    }
  }

  componentWillMount () {
    // Running all calculations with default values on page load
    this.setState(this.calculateAll(this.state))
  }

  // Returns monthly payment.
  calculatePMT (o, state) {
    return PMT(
      (o.interestRate - state.inflation) / 100 / COMPOUND_FREQUENCY,
      o.term * COMPOUND_FREQUENCY,
      state.loanAmt
    )
  }

  // Returns interest amount and depends on payment (PMT).
  calculateInterestAmt (o, state) {
    return o.pmt * (o.term * COMPOUND_FREQUENCY) + state.loanAmt
  }

  // Returns future value dynamically depending on mortgage term length.
  calculateFV (option1, option2, state) {
    // TODO: what if terms of option1 and option2 are equal?
    if (option1.term > option2.term) {
      return FV(
        (state.investmentRate - state.inflation) / 100 / COMPOUND_FREQUENCY,
        option1.term * COMPOUND_FREQUENCY,
        option2.pmt - option1.pmt,
        0
      )
    } else if (option1.term < option2.term) {
      return FV(
        (state.investmentRate - state.inflation) / 100 / COMPOUND_FREQUENCY,
        (option2.term - option1.term) * COMPOUND_FREQUENCY,
        option1.pmt,
        0
      )
    }
  }

  // Returns opportunity cost of choosing option1 over option2. Opportunity cost can be positive and negative.
  calculateOpportunityCost (option1, option2) {
    return option1.fv + option1.interestAmt - (option2.fv + option2.interestAmt)
  }

  // Runs every time an input is updated and uses input's name tag to make specific changes in the state
  updateInput (e) {
    let state = Object.assign({}, this.state)
    const key = e.target.name

    const value = parseFloat(e.target.value)

    _.set(state, key, value)
    if (!isNaN(value)) {
      state = this.calculateAll(state)
    }
    this.setState(state)
  }

  // Runs all calculations and returns a modified state
  calculateAll (state) {
    option1 = state.options.option1
    option2 = state.options.option2

    option1.pmt = this.calculatePMT(option1, state)
    option2.pmt = this.calculatePMT(option2, state)

    option1.interestAmt = this.calculateInterestAmt(option1, state)
    option2.interestAmt = this.calculateInterestAmt(option2, state)

    option1.fv = this.calculateFV(option1, option2, state)
    option2.fv = this.calculateFV(option2, option1, state)

    state.optCost = this.calculateOpportunityCost(option1, option2)

    return state
  }

  render () {
    return (
      <div className='main-container'>
        <div className='section'>
          <h5>Loan Amount</h5>
          <Input
            name='loanAmt'
            placeholder='Loan Amount'
            type='number'
            value={this.state.loanAmt}
            onChange={this.updateInput}
          />
        </div>
        <div className='section'>
          <h5>Loan Term</h5>
          <Row>
            <Input
              name='options.option1.term'
              placeholder='Loan Term'
              type='number'
              value={option1.term}
              onChange={this.updateInput}
            />
            <Input
              name='options.option2.term'
              placeholder='Loan Term'
              type='number'
              value={option2.term}
              onChange={this.updateInput}
            />
          </Row>
        </div>
        <div className='section'>
          <h5>Interest/APR</h5>
          <Row>
            <Input
              name='options.option1.interestRate'
              placeholder='APR'
              type='number'
              value={option1.interestRate}
              onChange={this.updateInput}
            />
            <Input
              name='options.option2.interestRate'
              placeholder='APR'
              type='number'
              value={option2.interestRate}
              onChange={this.updateInput}
            />
          </Row>
        </div>
        <div className='section'>
          <h5>Return on Investment (ROI)</h5>
          <Input
            name='investmentRate'
            placeholder='ROI'
            type='number'
            value={this.state.investmentRate}
            onChange={this.updateInput}
          />
        </div>
        <div className='section'>
          <h5>Inflation</h5>
          <Input
            name='inflation'
            placeholder='Inflation'
            type='number'
            value={this.state.inflation}
            onChange={this.updateInput}
          />
        </div>

        <div className='result'>
          <pre>{JSON.stringify(this.state, null, '\t')}</pre>
        </div>
      </div>
    )
  }
}

export default MainForm
