import React from 'react'

import styled, { css, cx } from 'react-emotion'
import { Col, Row } from 'reactstrap'
import { GRAY, LIGHT_GREEN } from '../../assets/colors'

import { formatMoney } from '../../utils/numberUtils'

const Li = styled('li')`
  margin-top: 1rem;
`

const emphasize = cx('card', css(`border-color: ${LIGHT_GREEN};`))

const box = bestOption => css`
  background-color: ${bestOption ? LIGHT_GREEN : GRAY};
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
        <h3 className='mt-3'>Better by {formatMoney(props.optCost)}</h3>
      )}
    </Col>
  )
}

const Summary = props => {
  return (
    <div>
      <div>
        <h4>Which is better?</h4>
        <p className='mt-2'>
          <b>
            You make {formatMoney(props.optCost)} more by choosing the{' '}
            {props.bestOption.term} year mortgage
          </b>
          . <b>{formatMoney(props.optCost)}</b> is the difference between your{' '}
          {props.shorterOption.term} year investment total (
          <b>{formatMoney(props.shorterOption.fv)}</b>) and your{' '}
          {props.longerOption.term} year investment total (
          <b>{formatMoney(props.longerOption.fv)}</b>).
        </p>
        <Row className='mt-4'>
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
      <Row noGutters>
        <ScenarioCol option={props.shorterOption}>
          <Li>
            With the <b>{props.shorterOption.term} year mortgage</b> you pay{' '}
            <b>{formatMoney(-props.shorterOption.pmt)}</b> monthly for{' '}
            {props.shorterOption.term} years.
          </Li>
          <Li>
            After the house is paid, you{' '}
            <b>invest {formatMoney(-props.shorterOption.pmt)}</b> monthly with
            an <b>ROI of {props.investmentRate}%</b> at an{' '}
            <b>inflation rate of {props.inflation}%</b>.
          </Li>
          <Li>
            After <b>{props.longerOption.term} years</b>, your{' '}
            <b>investments</b> are worth{' '}
            <b>{formatMoney(props.shorterOption.fv)}</b>.
          </Li>
        </ScenarioCol>
        <ScenarioCol option={props.longerOption}>
          <Li>
            With the <b>{props.longerOption.term} year mortgage</b> you pay{' '}
            <b>{formatMoney(-props.longerOption.pmt)}</b> monthly for{' '}
            {props.longerOption.term} years.
          </Li>
          <Li>
            You also invest{' '}
            <b>
              {formatMoney(-(props.shorterOption.pmt - props.longerOption.pmt))}
            </b>{' '}
            every month, making your total expenditure (
            <b>{formatMoney(-props.shorterOption.pmt)}</b>) the same as the{' '}
            {props.shorterOption.term} year mortgage.
          </Li>
          <Li>
            After <b>{props.shorterOption.term} years</b> you have{' '}
            <b>
              {formatMoney(
                props.yearlyResultsByOption.longer[props.shorterOption.term + 1]
                  .loanAmt
              )}{' '}
              left to pay
            </b>{' '}
            on your house, but your <b>investments</b> are worth{' '}
            <b>
              {formatMoney(
                -props.yearlyResultsByOption.longer[
                  props.shorterOption.term + 1
                ].investmentAmount
              )}
            </b>
            .
          </Li>
          <Li>
            After <b>{props.longerOption.term} years</b> you pay off your house,
            and your <b>investments</b> are worth{' '}
            <b>{formatMoney(props.longerOption.fv)}</b>.
          </Li>
        </ScenarioCol>
      </Row>
    </div>
  )
}

export default Summary
