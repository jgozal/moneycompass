// References:
// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
// https://www.nerdwallet.com/mortgages/mortgage-rates/30-year-fixed
// https://michaelbluejay.com/house/15vs30.html

import React from 'react'

import { Button, Col, Row } from 'reactstrap'

import InputCard from './input-card'
import AmortizationTable from './amortization-table'
import Summary from './summary'

import _ from 'lodash'
import { FV, PMT } from 'formulajs/lib/financial'
import { getYearly } from '../../utils/timeSeriesResultsByOption'

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

option1.interestRate = 4
option1.term = 15

option2.interestRate = 4.3
option2.term = 30

class MortgageInvestmentCompare extends React.Component {
  constructor () {
    super()
    this.toggleShowTable = this.toggleShowTable.bind(this)
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
      },
      shorterOption: '',
      longerOption: '',
      yearlyResultsByOption: [],
      showTable: false
    }
  }

  componentWillMount () {
    // Running all calculations with default values on page load
    this.setState(this.calculateAll(this.state))
  }

  toggleShowTable () {
    this.setState({ showTable: !this.state.showTable })
  }

  // Returns monthly payment.
  calculatePMT (o, state) {
    return PMT(
      o.interestRate / 100 / COMPOUND_FREQUENCY,
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
    return Math.abs(option1.fv - option2.fv)
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

    const [shorter, longer] = _.sortBy([option1, option2], 'term')
    state.shorterOption = shorter.term === option1.term ? 'option1' : 'option2'
    state.longerOption = longer.term === option1.term ? 'option1' : 'option2'

    state.yearlyResultsByOption = getYearly({
      loanAmt: state.loanAmt,
      investmentRate: state.investmentRate / 100,
      inflationRate: state.inflation / 100,
      shorterOption: {
        mortgageRate: shorter.interestRate / 100,
        mortgageTerm: shorter.term
      },
      longerOption: {
        mortgageRate: longer.interestRate / 100,
        mortgageTerm: longer.term
      }
    })

    return state
  }

  render () {
    const shorterOption = this.state.options[this.state.shorterOption]
    const longerOption = this.state.options[this.state.longerOption]
    const bestOption = _.maxBy([shorterOption, longerOption], 'fv')

    return (
      <Row>
        <Col xs='4'>
          <InputCard
            loanAmt={this.state.loanAmt}
            investmentRate={this.state.investmentRate}
            inflation={this.state.inflation}
            onInputChange={this.updateInput}
            option1={option1}
            option2={option2}
            shorterOption={shorterOption}
            longerOption={longerOption}
          />
        </Col>
        <Col xs='8'>
          <Summary
            shorterOption={shorterOption}
            longerOption={longerOption}
            bestOption={bestOption}
            optCost={this.state.optCost}
            inflation={this.state.inflation}
            investmentRate={this.state.investmentRate}
            yearlyResultsByOption={this.state.yearlyResultsByOption}
          />
          <Button
            className='d-block mx-auto mt-1'
            outline
            color='success'
            onClick={this.toggleShowTable}
          >
            {this.state.showTable ? 'Hide' : 'See'} Yearly Breakdown
          </Button>
          <AmortizationTable
            option1={option1}
            option2={option2}
            shorterOption={shorterOption}
            longerOption={longerOption}
            yearlyResultsByOption={this.state.yearlyResultsByOption}
            showTable={this.state.showTable}
          />
          <pre>{JSON.stringify(this.state, null, 4).replace(/[{}]/g, '')}</pre>
        </Col>
      </Row>
    )
  }
}

export default MortgageInvestmentCompare
