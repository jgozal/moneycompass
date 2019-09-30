import _ from 'lodash'
import React from 'react'

import {
  Card,
  Col,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  CustomInput
} from 'reactstrap'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

import { toUSD } from '../../utils/numberFormat'
import Accordion from '../general/accordion'
import Tooltip from '../general/tooltip'
import ValidatedNumberInput from '../general/validated-number-input'

class InputCard extends React.Component {
  constructor () {
    super()
    this.onInputChange = this.onInputChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (
      this.props.input !== nextProps.input ||
      this.props.includeROI !== nextProps.includeROI ||
      this.props.includeInflation !== nextProps.includeInflation
    ) {
      this.props.updtateResult(nextProps.input)
    }
  }

  onInputChange (path, value) {
    const newInput = _.cloneDeep(this.props.input)
    _.set(newInput, path, value)
    this.props.onInputChange(newInput)
  }

  render () {
    const [shorterOption, longerOption] = _.sortBy(
      [this.props.input.option1, this.props.input.option2],
      'term'
    )

    return (
      <Card className='p-4'>
        <Form>
          <FormGroup className='mb-3'>
            <Tooltip
              icon={faQuestionCircle}
              content='The amount you promise to pay back after making your down payment'
              id='loanAmt'
            >
              <label>How much is your loan?</label>
            </Tooltip>
            <InputGroup className='my-2'>
              <InputGroupAddon addonType='prepend'>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <ValidatedNumberInput
                max={5000000000}
                min={0}
                name='loanAmt'
                onChange={this.onInputChange}
                placeholder='Loan Amount'
                value={this.props.input.loanAmt}
              />
            </InputGroup>
            <Accordion title='How much can I afford?'>
              Most financial advisers agree that people should spend no more
              than <b>28 percent</b> of their gross monthly income on housing
              expenses and no more than <b>36 percent</b> on total debt.{' '}
              <a href='https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx'>
                Bankrate
              </a>{' '}
              has a great tool to help you determine how much you can afford.
            </Accordion>
          </FormGroup>
          <hr />
          <FormGroup className='mb-3'>
            <Tooltip
              icon={faQuestionCircle}
              content='The time you have to repay the loan (in years)'
              id='term'
            >
              <label>Loan Term</label>
            </Tooltip>
            <Row form>
              <Col>
                <small>
                  <b>Mortgage Option 1</b>
                </small>
                <InputGroup className='my-2'>
                  <ValidatedNumberInput
                    isInteger
                    max={100}
                    min={1}
                    name='option1.term'
                    onChange={this.onInputChange}
                    placeholder='Loan Term'
                    value={this.props.input.option1.term}
                  />
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>years</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col>
                <small>
                  <b>Mortgage Option 2</b>
                </small>
                <InputGroup className='my-2'>
                  <ValidatedNumberInput
                    isInteger
                    max={100}
                    min={1}
                    name='option2.term'
                    onChange={this.onInputChange}
                    placeholder='Loan Term'
                    value={this.props.input.option2.term}
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
              title={`What happens after you’re done paying off the
              ${shorterOption.term}-year mortgage?`}
            >
              This tool assumes that you’ll invest the difference between the
              payment of the {shorterOption.term}-year and the{' '}
              {longerOption.term}
              -year mortgages. If you had to make monthly payments of{' '}
              {toUSD(-shorterOption.pmt)} for your {shorterOption.term}
              -year mortgage versus {toUSD(-longerOption.pmt)} for your{' '}
              {longerOption.term}
              -year mortgage, you would invest the difference (
              {toUSD(-1 * (shorterOption.pmt - longerOption.pmt))}) monthly
              after paying off your {shorterOption.term}-year mortgage.
            </Accordion>
          </FormGroup>
          <hr />
          <FormGroup className='mb-3'>
            <Tooltip
              icon={faQuestionCircle}
              content='The yearly cost of borrowing the loan'
              id='interestRate'
            >
              <label>Annual Percentage Rate (APR) & Interest</label>
            </Tooltip>
            <Row form>
              <Col>
                <small>
                  <b>Mortgage Option 1</b>
                </small>
                <InputGroup className='my-2'>
                  <ValidatedNumberInput
                    max={1000}
                    min={-1000}
                    name='option1.interestRate'
                    onChange={this.onInputChange}
                    placeholder='APR'
                    value={this.props.input.option1.interestRate}
                  />
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>%</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col>
                <small>
                  <b>Mortgage Option 2</b>
                </small>
                <InputGroup className='my-2'>
                  <ValidatedNumberInput
                    max={1000}
                    min={-1000}
                    name='option2.interestRate'
                    onChange={this.onInputChange}
                    placeholder='APR'
                    value={this.props.input.option2.interestRate}
                  />
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>%</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>
            <Accordion title='What is the annual percentage rate (APR)?'>
              APR measures how much it costs to borrow money.{' '}
              <a href='https://www.bankrate.com/glossary/a/apr/'>Bankrate</a>{' '}
              provides a more in-depth explanation.
            </Accordion>
            <Accordion title='Fixed vs. Variable Interest Rates'>
              This tool assumes your mortgage interest rate is fixed.{' '}
              <a href='https://www.valuepenguin.com/loans/fixed-vs-variable-interest-rates'>
                Value Penguin
              </a>{' '}
              has a great article about how fixed and variable rates work.
            </Accordion>
          </FormGroup>
          <hr />
          <FormGroup className='mb-3'>
            <div className='d-flex flex-row justify-content-between'>
              <Tooltip
                icon={faQuestionCircle}
                content='How well you expect your investment to perform each year'
                id='investmentRate'
              >
                <label>Return on Investment (ROI)</label>
              </Tooltip>
              <CustomInput
                type='checkbox'
                className='custom-switch'
                id='roi-switch'
                name='roi-switch'
                label={<small>Include?</small>}
                checked={this.props.includeROI}
                onChange={this.props.onROISwitch}
              />
            </div>
            <InputGroup className='my-2'>
              <ValidatedNumberInput
                max={1000}
                min={-1000}
                name='investmentRate'
                placeholder='ROI'
                value={this.props.input.investmentRate}
                onChange={this.onInputChange}
                disabled={!this.props.includeROI}
              />
              <InputGroupAddon addonType='append'>
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Accordion title='How do I invest?'>
              Investing refers to the process of allocating money to something
              that you expect to generate income from or/and that you hope will
              appreciate (increase in value). You can invest in anything: real
              estate, index funds, stocks, bonds etc. Most times, you will need
              a brokerage account to invest.{' '}
              <a href='https://investor.vanguard.com/home/'>Vanguard</a>, an{' '}
              <a href='https://about.vanguard.com/what-sets-vanguard-apart/why-ownership-matters/'>
                investor-owned
              </a>{' '}
              fund company, offers great mutual funds and ETFs with very low
              fees.
            </Accordion>
            <Accordion title='Return on Investment (ROI)'>
              Return on investment (ROI) is the gain or loss generated on your
              investment relative to the amount of money invested (expressed as
              a percentage). This tool defaults to a 8% ROI because that is
              roughly the average historical annual return for the S&P 500.{' '}
              <a href='https://www.investopedia.com/ask/answers/042415/what-average-annual-return-sp-500.asp'>
                Investopedia
              </a>{' '}
              provides a little more background on this.
            </Accordion>
            <Accordion title='Risk and Diversification'>
              Diversification is about not putting all your eggs in one basket
              so as to mitigate risk (how volatile is your investment). We
              recommend you invest in a variety of low-cost index funds to
              diversify as best as possible.{' '}
              <a href='https://www.thebalance.com/the-importance-of-diversification-3025567'>
                The Balance
              </a>{' '}
              has a great article on diversification.
            </Accordion>
            <Accordion title='Long Term vs. Short Term Investments'>
              Long term investments are those you hold for longer than a year.
              In contrast, short term investments are usually held for a year or
              less. Note that short term investments usually have a{' '}
              <b>higher tax burden</b> than long term investments.{' '}
              <a href='https://www.edwardjones.ca/financial-focus/investment-topics/short-term-vs-long-term-investments.html'>
                Edward Jones
              </a>{' '}
              provides some info about the distinctions between a long term and
              short term investment.
            </Accordion>
            <Accordion title='Taxable Accounts vs. Retirement Accounts'>
              This tool assumes you invest your money through a retirement
              account. When opening a brokerage account, you have the option to
              invest through a taxable account, or a retirement account. Taxable
              accounts are accounts which are subject to capital gains taxes
              (you will have to pay taxes on your profit). Retirement accounts
              (IRA, 401k, 403b, etc) in contrast, are tax-sheltered, but the
              caveat is that your money suffers from some withdrawal
              restrictions.{' '}
              <a href='https://www.sofi.com/learn/content/what-is-a-taxable-account/'>
                SoFi
              </a>{' '}
              provides a more in-depth analysis on this topic.
            </Accordion>
          </FormGroup>
          <hr />
          <FormGroup className='mb-3'>
            <div className='d-flex flex-row justify-content-between'>
              <Tooltip
                icon={faQuestionCircle}
                content='How fast you expect prices to rise every year'
                id='inflation'
              >
                <label>Inflation</label>
              </Tooltip>
              <CustomInput
                type='checkbox'
                className='custom-switch'
                id='inflation-switch'
                name='inflation-switch'
                label={<small>Include?</small>}
                checked={this.props.includeInflation}
                onChange={this.props.onInflationSwitch}
              />
            </div>
            <InputGroup className='my-2'>
              <ValidatedNumberInput
                max={1000000000}
                min={-1000000000}
                name='inflation'
                onChange={this.onInputChange}
                placeholder='Inflation'
                value={this.props.input.inflation}
                disabled={!this.props.includeInflation}
              />
              <InputGroupAddon addonType='append'>
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Accordion title='What is Inflation?'>
              Prices generally increase as time passes. The average home price
              in the US during the 1960s was roughly $20,000. The average home
              price today is roughly{' '}
              <a href='https://www.census.gov/construction/nrs/pdf/uspricemon.pdf'>
                $370,000
              </a>
              . Because prices increase, your purchasing power decreases. If you
              had $370,000 to buy a house today and you just left the money in
              your bank account for 10 years, it is unlikely you would be able
              to buy the same house for that price again 10 years later. That is
              inflation, and that is why investing is so important, to protect
              your purchasing power against it.{' '}
              <a href='https://www.khanacademy.org/economics-finance-domain/core-finance/inflation-tutorial/inflation-basics-tutorial/v/what-is-inflation'>
                Khan Academy
              </a>{' '}
              has a great video about inflation.
            </Accordion>
            <Accordion title='How do you determine inflation?'>
              The Fed sets a target inflation rate of 2%. Inflation in the US is
              determined by the{' '}
              <a href='https://www.bls.gov/cpi/'>Consumer Price Index (CPI)</a>.
              Other countries have a similar way to measure inflation.{' '}
              <a href='https://www.khanacademy.org/economics-finance-domain/core-finance/inflation-tutorial/inflation-basics-tutorial/v/inflation-data'>
                Khan Academy
              </a>{' '}
              has a brief video that talks about the data behind the CPI.
            </Accordion>
            <Accordion title='How inflation affects your mortgage and investments'>
              As time passes, inflation makes your mortgage payments cheaper (or
              more accurately, your purchasing power smaller) and your return on
              investment lower. Everything will be a lot more expensive in{' '}
              {longerOption.term} years, and that is why inflation matters so
              much.{' '}
              {this.props.includeInflation &&
                `We factor all of this automatically so the
              final result on your right is not the actual money you
              will gain/lose in ${longerOption.term} years, but rather,
              the money you will gain/lose in ${longerOption.term} years
              adjusted to today’s purchasing power. If you’re curious about what
              the actual number will be, disable inflation.`}
            </Accordion>
          </FormGroup>
        </Form>
      </Card>
    )
  }
}

export default InputCard
