import React from 'react'

import styled, { css, cx } from 'react-emotion'
import { Col, Row } from 'reactstrap'
import { GRAY, GREEN_300 } from '../../assets/colors'

import { toUSD } from '../../utils/numberFormat'

const Li = styled('li')`
  margin-top: 1rem;
`

const emphasize = cx('card', css(`border-color: ${GREEN_300};`))

const box = bestOption => css`
  background-color: ${bestOption ? GREEN_300 : GRAY};
  font-size: 3.5rem;
  color: white;
`

/**
 * @param {*} props
 *   @property {Object} option
 */
function ScenarioCol (props) {
  return (
    <Col className='p-4'>
      <h5>{props.option.term} year scenario:</h5>
      <ol className={css('padding-inline-start: 1rem;')}>{props.children}</ol>
    </Col>
  )
}

/**
 * @param {*} props
 *   @property {boolean} isBestOption
 *   @property {Object} option
 */
function BoxCol (props) {
  return (
    <Col className={`p-4 text-center ${props.isBestOption && emphasize}`}>
      <div className={cx(box(props.isBestOption), 'p-4')}>
        <b>{props.option.term}yr</b>
      </div>
      {props.isBestOption && (
        <h3 className='mt-3'>Better by {toUSD(props.optCost)}</h3>
      )}
    </Col>
  )
}

/**
 * @param {*} props
 *   @property {Object} shorterOption
 *   @property {Object} longerOption
 *   @property {Object} bestOption
 *   @property {number} optCost
 *   @property {number} investmentRate
 *   @property {number} inflation
 *   @property {Object} yearlyResultsByOption
 */

const Summary = props => {
  return (
    <div>
      <div>
        <h4>Which is better?</h4>
        <p className='mt-4'>
          <b>
            You make {toUSD(props.optCost)} more by choosing the{' '}
            {props.bestOption.term} year mortgage
          </b>
          . <b>{toUSD(props.optCost)}</b> is the difference between your{' '}
          {props.shorterOption.term} year investment total (
          <b>{toUSD(props.shorterOption.fv)}</b>) and your{' '}
          {props.longerOption.term} year investment total (
          <b>{toUSD(props.longerOption.fv)}</b>).
        </p>
        <Row noGutters className='my-4'>
          <BoxCol
            option={props.shorterOption}
            isBestOption={props.shorterOption === props.bestOption}
            optCost={props.optCost}
          />
          <BoxCol
            option={props.longerOption}
            isBestOption={props.longerOption === props.bestOption}
            optCost={props.optCost}
          />
        </Row>
      </div>
      <div>
        <h4>How it works</h4>
        <Row noGutters>
          <ScenarioCol option={props.shorterOption}>
            <Li>
              With the <b>{props.shorterOption.term} year mortgage</b> you pay{' '}
              <b>{toUSD(-props.shorterOption.pmt)}</b> monthly for{' '}
              {props.shorterOption.term} years.
            </Li>
            <Li>
              After the house is paid, you{' '}
              <b>invest {toUSD(-props.shorterOption.pmt)}</b> monthly with an{' '}
              <b>ROI of {props.investmentRate}%</b> at an{' '}
              <b>inflation rate of {props.inflation}%</b>.
            </Li>
            <Li>
              After <b>{props.longerOption.term} years</b>, your{' '}
              <b>investments</b> are worth{' '}
              <b>{toUSD(props.shorterOption.fv)}</b>.
            </Li>
          </ScenarioCol>
          <ScenarioCol option={props.longerOption}>
            <Li>
              With the <b>{props.longerOption.term} year mortgage</b> you pay{' '}
              <b>{toUSD(-props.longerOption.pmt)}</b> monthly for{' '}
              {props.longerOption.term} years.
            </Li>
            <Li>
              You also invest{' '}
              <b>
                {toUSD(-(props.shorterOption.pmt - props.longerOption.pmt))}
              </b>{' '}
              every month, making your total expenditure (
              <b>{toUSD(-props.shorterOption.pmt)}</b>) the same as the{' '}
              {props.shorterOption.term} year mortgage.
            </Li>
            <Li>
              After <b>{props.shorterOption.term} years</b> you have{' '}
              <b>
                {toUSD(
                  props.yearlyResultsByOption.longer[
                    props.shorterOption.term - 1
                  ].loanAmt
                )}{' '}
                left to pay
              </b>{' '}
              on your house, but your <b>investments</b> are worth{' '}
              <b>
                {toUSD(
                  -props.yearlyResultsByOption.longer[
                    props.shorterOption.term - 1
                  ].investmentAmount
                )}
              </b>
              .
            </Li>
            <Li>
              After <b>{props.longerOption.term} years</b> you pay off your
              house, and your <b>investments</b> are worth{' '}
              <b>{toUSD(props.longerOption.fv)}</b>.
            </Li>
          </ScenarioCol>
        </Row>
      </div>
    </div>
  )
}

export default Summary
