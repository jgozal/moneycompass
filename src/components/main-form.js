// References:
// https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx
// https://www.nerdwallet.com/mortgages/mortgage-rates/30-year-fixed
// https://michaelbluejay.com/house/15vs30.html

import React from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Table
} from 'reactstrap'
import Accordion from './accordion'

import _ from 'lodash'
import numbro from 'numbro'
import { FV, PMT } from 'formulajs/lib/financial'
import styled, { css } from 'react-emotion'
import { getYearly } from '../utils/timeSeriesResultsByOption'

import { LIGHT_GRAY, GRAY, LIGHT_GREEN } from '../assets/colors'

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

// CSS

const AmortizationTable = styled(Table)`
  th,
  tbody {
    text-align: center;
  }

  th:first-of-type {
    border: 0;
  }

  th:nth-child(6),
  td:nth-child(6) {
    border-left-width: thick;
    border-left-color: ${GRAY}};
  }
`

const checkLoanTerms = (year, option1, option2) => {
  return year + 1 === option1.term || year + 1 === option2.term
}

const highlightTableCells = (year, option1, option2) => {
  return (
    checkLoanTerms(year, option1, option2) &&
    css`
      td:nth-child(n + 2):nth-child(-n + 5) {
        background-color: ${option1.fv > option2.fv ? LIGHT_GREEN : LIGHT_GRAY};
      }

      td:nth-child(n + 6):nth-child(-n + 9) {
        background-color: ${option2.fv > option1.fv ? LIGHT_GREEN : LIGHT_GRAY};
      }
    `
  )
}

const hoverTableCells = (year, option1, option2) => {
  // grab table cells depending on year
  const tableCells = Array.from(
    document.getElementsByTagName('tbody')[0].children[year].children
  )

  const hover = (color, brightness, cell, index) => {
    const nextCells = tableCells[index + 4]
    const prevCells = tableCells[index - 4]

    cell.style.backgroundColor = index !== 0 && color
    cell.style.filter = `brightness(${brightness}%)`

    if (typeof nextCells !== 'undefined' && index !== 0) {
      nextCells.style.backgroundColor = color
      nextCells.style.filter = `brightness(${brightness}%)`
    }

    if (typeof prevCells !== 'undefined' && index !== 4) {
      prevCells.style.backgroundColor = color
      prevCells.style.filter = `brightness(${brightness}%)`
    }
  }

  // iterate over all cells in row and set appropriate color depending on mouse event
  tableCells.forEach((cell, index) => {
    // do not set background color for rows that already have a background color
    if (checkLoanTerms(year, option1, option2)) {
      cell.addEventListener('mouseover', () => hover(null, 85, cell, index))
      cell.addEventListener('mouseleave', () => hover(null, 100, cell, index))
    } else {
      cell.addEventListener('mouseover', () =>
        hover(LIGHT_GRAY, 85, cell, index)
      )
      cell.addEventListener('mouseleave', () =>
        hover('white', 100, cell, index)
      )
    }
  })
}

class MainForm extends React.Component {
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
    state.shorterOption = shorter
    state.longerOption = longer

    state.yearlyResultsByOption = getYearly({
      loanAmount: state.loanAmt,
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
    return (
      <Row className='mt-5 p-4'>
        <Col xs='4'>
          {/* TODO 2019-09-11: We could probably pull this out into its own component */}
          <Card className='p-4'>
            <Form>
              <FormGroup>
                <label>How much is your loan?</label>
                <InputGroup>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name='loanAmt'
                    placeholder='Loan Amount'
                    type='number'
                    value={this.state.loanAmt}
                    onChange={this.updateInput}
                  />
                </InputGroup>
                <Accordion title='How much can I afford?'>
                  Most financial advisers agree that people should spend no more
                  than <b>28 percent</b> of their gross monthly income on
                  housing expenses and no more than <b>36 percent</b> on total
                  debt.{' '}
                  <a href='https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx'>
                    Bankrate
                  </a>{' '}
                  has a great tool to help you determine how much you can
                  afford.
                </Accordion>
              </FormGroup>
              <FormGroup>
                <label>Loan Term</label>
                <Row form>
                  <Col>
                    <small>Mortgage Option 1</small>
                    <InputGroup>
                      <Input
                        name='options.option1.term'
                        placeholder='Loan Term'
                        type='number'
                        value={option1.term}
                        onChange={this.updateInput}
                      />
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>years</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                  <Col>
                    <small>Mortgage Option 2</small>
                    <InputGroup>
                      <Input
                        name='options.option2.term'
                        placeholder='Loan Term'
                        type='number'
                        value={option2.term}
                        onChange={this.updateInput}
                      />
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>years</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </Row>
                <Accordion title='Pros and Cons'>
                  <a href='https://thelendersnetwork.com/15-year-mortgage-vs-30-year-mortgage-rates/'>
                    The Lender’s Network
                  </a>{' '}
                  has an excellent article which outlines the pros and cons of
                  15-year versus 30-year mortgages.
                </Accordion>
                <Accordion
                  title={`What happens when after you’re done paying off the ${_.min(
                    [option1.term, option2.term]
                  )}-year mortgage?`}
                >
                  This tool assumes that you’ll invest the difference between
                  the payment of the {this.state.shorterOption.term}-year and
                  the {this.state.longerOption.term}-year mortgages. If you had
                  to make monthly payments of{' '}
                  {formatMoney(-1 * this.state.shorterOption.pmt)} for your{' '}
                  {this.state.shorterOption.term}-year mortgage versus{' '}
                  {formatMoney(-1 * this.state.longerOption.pmt)} for your{' '}
                  {this.state.longerOption.term}-year mortgage, you would invest
                  the difference (
                  {formatMoney(
                    -1 *
                      (this.state.shorterOption.pmt -
                        this.state.longerOption.pmt)
                  )}
                  ) monthly after paying off your{' '}
                  {this.state.shorterOption.term}-year mortgage.
                </Accordion>
              </FormGroup>
              <FormGroup>
                <label>Annual Percentage Rate (APR) & Interest</label>
                <Row form>
                  <Col>
                    <small>Mortgage Option 1</small>
                    <InputGroup>
                      <Input
                        name='options.option1.interestRate'
                        placeholder='APR'
                        type='number'
                        value={option1.interestRate}
                        onChange={this.updateInput}
                      />
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>%</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                  <Col>
                    <small>Mortgage Option 2</small>
                    <InputGroup>
                      <Input
                        name='options.option2.interestRate'
                        placeholder='APR'
                        type='number'
                        value={option2.interestRate}
                        onChange={this.updateInput}
                      />
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>%</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </Row>
                <Accordion title='What is the annual percentage rate (APR)?'>
                  APR measures how much it costs to borrow money.{' '}
                  <a href='https://www.bankrate.com/glossary/a/apr/'>
                    Bankrate
                  </a>{' '}
                  provides a more in-depth explanation.
                </Accordion>
                <Accordion title='Fixed vs Variable Interest Rates'>
                  This tool assumes your mortgage interest rate is fixed.{' '}
                  <a href='https://www.valuepenguin.com/loans/fixed-vs-variable-interest-rates'>
                    Value Penguin
                  </a>{' '}
                  has a great article about how fixed and variable rates work.
                </Accordion>
              </FormGroup>
              <FormGroup>
                <label>Return on Investment (ROI)</label>
                <InputGroup>
                  <Input
                    name='investmentRate'
                    placeholder='ROI'
                    type='number'
                    value={this.state.investmentRate}
                    onChange={this.updateInput}
                  />
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>%</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <Accordion title='How do I invest?'>
                  Investing refers to the process of allocating money to
                  something that you expect to generate income from or/and that
                  you hope will appreciate (increase in value). You can invest
                  in anything: real estate, index funds, stocks, bonds etc. Most
                  times, you will need a brokerage account to invest.{' '}
                  <a href='https://investor.vanguard.com/home/'>Vanguard</a>, an{' '}
                  <a href='https://about.vanguard.com/what-sets-vanguard-apart/why-ownership-matters/'>
                    investor-owned
                  </a>{' '}
                  fund company, offers great mutual funds and ETFs with very low
                  fees.
                </Accordion>
                <Accordion title='Return on Investment (ROI)'>
                  Return on investment (ROI) is the gain or loss generated on
                  your investment relative to the amount of money invested
                  (expressed as a percentage). This tool defaults to a 9% ROI
                  because that is roughly the average historical annual return
                  for the S&P 500.{' '}
                  <a href='https://www.investopedia.com/ask/answers/042415/what-average-annual-return-sp-500.asp'>
                    Investopedia
                  </a>{' '}
                  provides a little more background on this.
                </Accordion>
                <Accordion title='Risk and Diversification'>
                  Diversification is about not putting all your eggs in one
                  basket to mitigate risk (how volatile is your investment). We
                  recommend you invest in a variety of low-cost index funds to
                  diversify as best as possible.{' '}
                  <a href='https://www.thebalance.com/the-importance-of-diversification-3025567'>
                    The Balance
                  </a>{' '}
                  has a great article on diversification.
                </Accordion>
                <Accordion title='Long Term vs. Short Term Investments'>
                  Long term investments are those you hold for longer than a
                  year. In contrast, short term investments are usually held for
                  a year or less. Note that short term investments usually have
                  a <b>higher tax burden</b> than long term investments.{' '}
                  <a href='https://www.edwardjones.ca/financial-focus/investment-topics/short-term-vs-long-term-investments.html'>
                    Edward Jones
                  </a>{' '}
                  provides some info about the distinctions between a long term
                  and short term investment.
                </Accordion>
                <Accordion title='Taxable Accounts vs. Retirement Accounts'>
                  This tool assumes you invest your money through a retirement
                  account. When opening a brokerage account, you have the option
                  to invest through a taxable account, or a retirement account.
                  Taxable accounts are accounts which are subject to capital
                  gains taxes (you will have to pay taxes on your profit).
                  Retirement accounts (IRA, 401k, 403b, etc) in contrast, are
                  tax-sheltered, but the caveat is that your money suffers from
                  some withdrawal restrictions.{' '}
                  <a href='https://www.sofi.com/learn/content/what-is-a-taxable-account/'>
                    SoFi
                  </a>{' '}
                  provides a more in-depth analysis on this topic.
                </Accordion>
              </FormGroup>
              <FormGroup>
                <label>Inflation</label>
                <InputGroup>
                  <Input
                    name='inflation'
                    placeholder='Inflation'
                    type='number'
                    value={this.state.inflation}
                    onChange={this.updateInput}
                  />
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>%</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <Accordion title='What is Inflation?'>
                  Prices generally increase as time passes. The average home
                  price in the US during the 1960s was roughly $20,000. The
                  average home price today is roughly{' '}
                  <a href='https://www.census.gov/construction/nrs/pdf/uspricemon.pdf'>
                    $370,000
                  </a>
                  . Because prices increase, your purchasing power decreases. If
                  you had $370,000 to buy a house today and you just left the
                  money in your bank account for 10 years, it is unlikely you
                  would be able to buy the same house for that price again 10
                  years later. That is inflation, and that is why investing is
                  so important, to protect your purchasing power against it.{' '}
                  <a href='https://www.khanacademy.org/economics-finance-domain/core-finance/inflation-tutorial/inflation-basics-tutorial/v/what-is-inflation'>
                    Khan Academy
                  </a>{' '}
                  has a great video about inflation.
                </Accordion>
                <Accordion title='How do you determine inflation?'>
                  The Fed sets a target inflation rate of 2%. Inflation in the
                  US is determined by the{' '}
                  <a href='https://www.bls.gov/cpi/'>
                    Consumer Price Index (CPI)
                  </a>
                  . Other countries have a similar way to measure inflation.{' '}
                  <a href='https://www.khanacademy.org/economics-finance-domain/core-finance/inflation-tutorial/inflation-basics-tutorial/v/inflation-data'>
                    Khan Academy
                  </a>{' '}
                  has a brief video that talks about the data behind the CPI.
                </Accordion>
                <Accordion title='How inflation affects your mortgage and investments'>
                  As time passes, inflation makes your mortgage payments cheaper
                  and your return on investment lower. We factor all of this
                  automatically so the final result you see on your right is not
                  the actual money you will have gained/lost in{' '}
                  {this.state.longerOption.term} years, but rather, the money
                  you will have gained/lost in {this.state.longerOption.term}{' '}
                  years adjusted to today’s purchasing power. If you’re curious
                  about what the actual number would be, give inflation a value
                  of 0%. But remember that everything will be a lot more
                  expensive in {this.state.longerOption.term} years, and that is
                  why we need to include inflation.
                </Accordion>
              </FormGroup>
            </Form>
          </Card>
        </Col>
        <Col xs='8'>
          <Button
            className='d-block mx-auto'
            outline
            color='info'
            size='lg'
            onClick={this.toggleShowTable}
          >
            {this.state.showTable ? 'Hide' : 'See'} Yearly Breakdown
          </Button>
          {this.state.showTable && (
            <AmortizationTable bordered responsive className='mt-5'>
              <thead>
                <tr>
                  <th colSpan='1' />
                  <th colSpan='4'>
                    {Math.min(option1.term, option2.term)} year
                  </th>
                  <th colSpan='4'>
                    {Math.max(option1.term, option2.term)} year
                  </th>
                </tr>
                <tr>
                  <th colSpan='1' />
                  <th>Mortgage Payment</th>
                  <th>Investment Payment</th>
                  <th>Loan Amount</th>
                  <th>Investment Amount</th>
                  <th>Mortgage Payment</th>
                  <th>Investment Payment</th>
                  <th>Loan Amount</th>
                  <th>Investment Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.state.yearlyResultsByOption.shorter.map((_r, year) => {
                  const shorter = this.state.yearlyResultsByOption.shorter[year]
                  const longer = this.state.yearlyResultsByOption.longer[year]

                  return (
                    <tr
                      key={'row' + year}
                      className={highlightTableCells(year, option1, option2)}
                      onMouseOver={() =>
                        hoverTableCells(year, option1, option2)
                      }
                    >
                      <td>Year {year + 1}</td>
                      <td>{formatMoney(shorter.pmt)}</td>
                      <td>{formatMoney(shorter.investmentPMT)}</td>
                      <td>{formatMoney(shorter.loanAmount)}</td>
                      <td>{formatMoney(shorter.investmentAmount)}</td>
                      <td>{formatMoney(longer.pmt)}</td>
                      <td>{formatMoney(longer.investmentPMT)}</td>
                      <td>{formatMoney(longer.loanAmount)}</td>
                      <td>{formatMoney(longer.investmentAmount)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </AmortizationTable>
          )}
          <pre>{JSON.stringify(this.state, null, 4).replace(/[{}]/g, '')}</pre>
        </Col>
      </Row>
    )
  }
}

function formatMoney (value) {
  return numbro(value).format('$0,0.00')
}

export default MainForm
