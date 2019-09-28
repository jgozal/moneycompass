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
import {
  getYearly,
  getPurchasingPower
} from '../../utils/timeSeriesResultsByOption'

// DEFAULT VALUES

const COMPOUND_FREQUENCY = 12

class MortgageInvestmentCompare extends React.Component {
  constructor () {
    super()
    this.calculateFV = this.calculateFV.bind(this)
    this.calculateInterestAmt = this.calculateInterestAmt.bind(this)
    this.calculateOpportunityCost = this.calculateOpportunityCost.bind(this)
    this.calculatePMT = this.calculatePMT.bind(this)
    this.getResult = this.getResult.bind(this)
    this.toggleShowTable = this.toggleShowTable.bind(this)
    this.updateInput = this.updateInput.bind(this)

    const input = {
      inflation: 2,
      investmentRate: 8,
      loanAmt: 200000,
      option1: {
        interestRate: 4,
        term: 15
      },
      option2: {
        interestRate: 4.3,
        term: 30
      }
    }

    const result = this.getResult(input)

    this.state = {
      input,
      result,
      showTable: false
    }
  }

  toggleShowTable () {
    this.setState({ showTable: !this.state.showTable })
  }

  // Returns monthly payment.
  calculatePMT (o, input) {
    return PMT(
      o.interestRate / 100 / COMPOUND_FREQUENCY,
      o.term * COMPOUND_FREQUENCY,
      input.loanAmt
    )
  }

  // Returns interest amount and depends on payment (PMT).
  calculateInterestAmt (o, input) {
    return o.pmt * (o.term * COMPOUND_FREQUENCY) + input.loanAmt
  }

  // Returns future value dynamically depending on mortgage term length.
  calculateFV (option1, option2, input) {
    if (option1.term >= option2.term) {
      return (
        FV(
          input.investmentRate / 100 / COMPOUND_FREQUENCY,
          option1.term * COMPOUND_FREQUENCY,
          option2.pmt - option1.pmt,
          0
        ) *
        getPurchasingPower(
          option1.term,
          input.inflation / 100,
          COMPOUND_FREQUENCY
        )
      )
    } else if (option1.term < option2.term) {
      return (
        FV(
          input.investmentRate / 100 / COMPOUND_FREQUENCY,
          (option2.term - option1.term) * COMPOUND_FREQUENCY,
          option1.pmt,
          0
        ) *
        getPurchasingPower(
          option2.term,
          input.inflation / 100,
          COMPOUND_FREQUENCY
        )
      )
    }
  }

  // Returns opportunity cost of choosing option1 over option2. Opportunity cost can be positive and negative.
  calculateOpportunityCost (option1, option2) {
    return Math.abs(option1.fv - option2.fv)
  }

  // Runs every time an input is updated and uses input's name tag to make specific changes in the state
  updateInput (input) {
    const result = this.getResult(input)
    this.setState({ input, result })
  }

  // Runs all calculations and returns a modified state
  getResult (input) {
    const option1 = _.cloneDeep(input.option1)
    const option2 = _.cloneDeep(input.option2)

    option1.pmt = this.calculatePMT(option1, input)
    option2.pmt = this.calculatePMT(option2, input)

    option1.interestAmt = this.calculateInterestAmt(option1, input)
    option2.interestAmt = this.calculateInterestAmt(option2, input)

    option1.fv = this.calculateFV(option1, option2, input)
    option2.fv = this.calculateFV(option2, option1, input)

    const optCost = this.calculateOpportunityCost(option1, option2)

    const [shorter, longer] = _.sortBy([option1, option2], 'term')

    const yearlyResultsByOption = getYearly({
      loanAmt: input.loanAmt,
      investmentRate: input.investmentRate / 100,
      inflationRate: input.inflation / 100,
      shorterOption: {
        mortgageRate: shorter.interestRate / 100,
        mortgageTerm: shorter.term,
        mortgagePMT: shorter.pmt
      },
      longerOption: {
        mortgageRate: longer.interestRate / 100,
        mortgageTerm: longer.term,
        mortgagePMT: longer.pmt
      }
    })

    return {
      optCost,
      option1,
      option2,
      yearlyResultsByOption
    }
  }

  render () {
    const options = _.sortBy(
      [this.state.result.option1, this.state.result.option2],
      'term'
    )
    const bestOption = _.maxBy(options, 'fv')
    const [shorterOption, longerOption] = options

    return (
      <Row>
        <Col xs='4'>
          <InputCard
            onInputChange={this.updateInput}
            input={this.state.input}
          />
        </Col>
        <Col xs='8'>
          <Button
            className='float-right mb-4 ml-4'
            outline
            size='lg'
            color='success'
            onClick={this.toggleShowTable}
          >
            {this.state.showTable ? 'Back to Summary' : 'See Yearly Breakdown'}
          </Button>
          {this.state.showTable ? (
            <AmortizationTable
              option1={this.state.result.option1}
              option2={this.state.result.option2}
              shorterOption={shorterOption}
              longerOption={longerOption}
              yearlyResultsByOption={this.state.result.yearlyResultsByOption}
            />
          ) : (
            <Summary
              bestOption={bestOption}
              inflation={this.state.input.inflation}
              investmentRate={this.state.input.investmentRate}
              longerOption={longerOption}
              optCost={this.state.result.optCost}
              shorterOption={shorterOption}
              yearlyResultsByOption={this.state.result.yearlyResultsByOption}
            />
          )}
        </Col>
      </Row>
    )
  }
}

export default MortgageInvestmentCompare
