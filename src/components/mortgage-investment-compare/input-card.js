import React from 'react'

import Accordion from './accordion'
import {
  Card,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'

import { toUSD } from '../../utils/numberFormat'

/**
 * @param {*} props
 *   @property {number} loanAmt
 *   @property {number} investmentRate
 *   @property {number} inflation
 *   @property {function} onInputChange
 *   @property {Object} option1
 *   @property {Object} option2
 *   @property {Object} shorterOption
 *   @property {Object} longerOption
 */

const InputCard = props => {
  return (
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
              value={props.loanAmt}
              onChange={props.onInputChange}
            />
          </InputGroup>
          <Accordion title='How much can I afford?'>
            Most financial advisers agree that people should spend no more than{' '}
            <b>28 percent</b> of their gross monthly income on housing expenses
            and no more than <b>36 percent</b> on total debt.{' '}
            <a href='https://www.bankrate.com/calculators/mortgages/new-house-calculator.aspx'>
              Bankrate
            </a>{' '}
            has a great tool to help you determine how much you can afford.
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
                  value={props.option1.term}
                  onChange={props.onInputChange}
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
                  value={props.option2.term}
                  onChange={props.onInputChange}
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
            has an excellent article which outlines the pros and cons of 15-year
            versus 30-year mortgages.
          </Accordion>
          <Accordion
            title={`What happens when after you’re done paying off the ${
              props.shorterOption.term
            }-year mortgage?`}
          >
            This tool assumes that you’ll invest the difference between the
            payment of the {props.shorterOption.term}-year and the{' '}
            {props.longerOption.term}
            -year mortgages. If you had to make monthly payments of{' '}
            {toUSD(-props.shorterOption.pmt)} for your{' '}
            {props.shorterOption.term}
            -year mortgage versus {toUSD(-props.longerOption.pmt)} for your{' '}
            {props.longerOption.term}
            -year mortgage, you would invest the difference (
            {toUSD(-1 * (props.shorterOption.pmt - props.longerOption.pmt))})
            monthly after paying off your {props.shorterOption.term}-year
            mortgage.
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
                  value={props.option1.interestRate}
                  onChange={props.onInputChange}
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
                  value={props.option2.interestRate}
                  onChange={props.onInputChange}
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
              value={props.investmentRate}
              onChange={props.onInputChange}
            />
            <InputGroupAddon addonType='append'>
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <Accordion title='How do I invest?'>
            Investing refers to the process of allocating money to something
            that you expect to generate income from or/and that you hope will
            appreciate (increase in value). You can invest in anything: real
            estate, index funds, stocks, bonds etc. Most times, you will need a
            brokerage account to invest.{' '}
            <a href='https://investor.vanguard.com/home/'>Vanguard</a>, an{' '}
            <a href='https://about.vanguard.com/what-sets-vanguard-apart/why-ownership-matters/'>
              investor-owned
            </a>{' '}
            fund company, offers great mutual funds and ETFs with very low fees.
          </Accordion>
          <Accordion title='Return on Investment (ROI)'>
            Return on investment (ROI) is the gain or loss generated on your
            investment relative to the amount of money invested (expressed as a
            percentage). This tool defaults to a 9% ROI because that is roughly
            the average historical annual return for the S&P 500.{' '}
            <a href='https://www.investopedia.com/ask/answers/042415/what-average-annual-return-sp-500.asp'>
              Investopedia
            </a>{' '}
            provides a little more background on this.
          </Accordion>
          <Accordion title='Risk and Diversification'>
            Diversification is about not putting all your eggs in one basket to
            mitigate risk (how volatile is your investment). We recommend you
            invest in a variety of low-cost index funds to diversify as best as
            possible.{' '}
            <a href='https://www.thebalance.com/the-importance-of-diversification-3025567'>
              The Balance
            </a>{' '}
            has a great article on diversification.
          </Accordion>
          <Accordion title='Long Term vs. Short Term Investments'>
            Long term investments are those you hold for longer than a year. In
            contrast, short term investments are usually held for a year or
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
            accounts are accounts which are subject to capital gains taxes (you
            will have to pay taxes on your profit). Retirement accounts (IRA,
            401k, 403b, etc) in contrast, are tax-sheltered, but the caveat is
            that your money suffers from some withdrawal restrictions.{' '}
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
              value={props.inflation}
              onChange={props.onInputChange}
            />
            <InputGroupAddon addonType='append'>
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <Accordion title='What is Inflation?'>
            Prices generally increase as time passes. The average home price in
            the US during the 1960s was roughly $20,000. The average home price
            today is roughly{' '}
            <a href='https://www.census.gov/construction/nrs/pdf/uspricemon.pdf'>
              $370,000
            </a>
            . Because prices increase, your purchasing power decreases. If you
            had $370,000 to buy a house today and you just left the money in
            your bank account for 10 years, it is unlikely you would be able to
            buy the same house for that price again 10 years later. That is
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
            As time passes, inflation makes your mortgage payments cheaper and
            your return on investment lower. We factor all of this automatically
            so the final result you see on your right is not the actual money
            you will have gained/lost in {props.longerOption.term} years, but
            rather, the money you will have gained/lost in{' '}
            {props.longerOption.term} years adjusted to today’s purchasing
            power. If you’re curious about what the actual number would be, give
            inflation a value of 0%. But remember that everything will be a lot
            more expensive in {props.longerOption.term} years, and that is why
            we need to include inflation.
          </Accordion>
        </FormGroup>
      </Form>
    </Card>
  )
}

export default InputCard
