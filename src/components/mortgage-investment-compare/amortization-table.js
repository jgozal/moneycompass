import React from 'react'

import { CustomInput, Table } from 'reactstrap'
import { GRAY_300, GRAY, GREEN_300 } from '../../assets/colors'
import styled, { css } from 'react-emotion'

import { toUSD } from '../../utils/numberFormat'

const tableDivider = css`
  border-left-width: thick;
  border-left-color: ${GRAY}};
`
const fixedTableLayout = css`
  display: table;
  width: 100%;
  table-layout: fixed; /* even columns width , fix width of table too*/
`
const tableFontSizeAlign = css`
  text-align: center;
  font-size: 0.75rem;
`

const Thead = styled('thead')`
  ${fixedTableLayout}

  width: calc(
    100% - 1em
  ); /* scrollbar is average 1em/16px width, remove it from thead width */
`
const Tbody = styled('tbody')`
  ${tableFontSizeAlign}

  display: block;
  height: 45rem;
  overflow: auto;
`
const Th = styled('th')`
  ${tableFontSizeAlign}

  :first-of-type {
    white-space: nowrap;
    border: 0;
  }

  :nth-child(6) {
    ${tableDivider}
  }
`
const Tr = styled('tr')`
  ${fixedTableLayout}

  :first-of-type th {
    font-size: 1rem;
  }
`
const Td = styled('td')`
  :first-of-type {
    white-space: nowrap;
  }

  :nth-child(6) {
    ${tableDivider}
  }
`

// checks if the table row being passed corresponds to the final year of either term
const checkLoanTerms = (year, option1, option2) => {
  return year + 1 === option1.term || year + 1 === option2.term
}

const highlightTableCells = (year, option1, option2) => {
  return checkLoanTerms(year, option1, option2)
    ? css`
        td:nth-child(n + 2):nth-child(-n + 5) {
          background-color: ${option1.fv > option2.fv ? GREEN_300 : GRAY_300};
        }

        td:nth-child(n + 6):nth-child(-n + 9) {
          background-color: ${option2.fv > option1.fv ? GREEN_300 : GRAY_300};
        }
      `
    : undefined
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

    if (nextCells !== undefined && index !== 0) {
      nextCells.style.backgroundColor = color
      nextCells.style.filter = `brightness(${brightness}%)`
    }

    if (prevCells !== undefined && index !== 4) {
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
      cell.addEventListener('mouseover', () => hover(GRAY_300, 85, cell, index))
      cell.addEventListener('mouseleave', () =>
        hover('white', 100, cell, index)
      )
    }
  })
}

/**
 * @param {*} props
 *   @property {Object} option1
 *   @property {Object} option2
 *   @property {Object} shorterOption
 *   @property {Object} longerOption
 *   @property {Object} yearlyResultsByOption
 */

const AmortizationTable = props => {
  return (
    <div>
      <h4>Yearly Breakdown</h4>
      <CustomInput
        checked={props.includeROI}
        className='custom-switch ml-4'
        id='roi-switch-yearly-breakdown'
        label={<small>Include ROI?</small>}
        name='roi-switch-yearly-breakdown'
        onChange={props.onROISwitch}
        type='checkbox'
      />
      <CustomInput
        checked={props.includeInflation}
        className='custom-switch ml-4'
        id='inflation-switch-yearly-breakdown'
        label={<small>Include Inflation?</small>}
        name='inflation-switch-yearly-breakdown'
        onChange={props.onInflationSwitch}
        type='checkbox'
      />
      <Table bordered responsive className='mt-3'>
        <Thead>
          <Tr>
            <Th colSpan='1' />
            <Th colSpan='4'>{props.shorterOption.term} year</Th>
            <Th colSpan='4'>{props.longerOption.term} year</Th>
          </Tr>
          <Tr>
            <Th colSpan='1' />
            <Th>Mortgage Payment</Th>
            <Th>Investment Payment</Th>
            <Th>Loan Amount</Th>
            <Th>Investment Amount</Th>
            <Th>Mortgage Payment</Th>
            <Th>Investment Payment</Th>
            <Th>Loan Amount</Th>
            <Th>Investment Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.yearlyResultsByOption.shorter.map((_r, year) => {
            const shorter = props.yearlyResultsByOption.shorter[year]
            const longer = props.yearlyResultsByOption.longer[year]

            return (
              <Tr
                key={'row' + year}
                className={highlightTableCells(
                  year,
                  props.option1,
                  props.option2
                )}
                onMouseOver={() =>
                  hoverTableCells(year, props.option1, props.option2)
                }
              >
                <Td>Year {year + 1}</Td>
                <Td>{toUSD(shorter.pmt)}</Td>
                <Td>{toUSD(shorter.investmentPMT)}</Td>
                <Td>{toUSD(shorter.loanAmt)}</Td>
                <Td>{toUSD(shorter.investmentAmt)}</Td>
                <Td>{toUSD(longer.pmt)}</Td>
                <Td>{toUSD(longer.investmentPMT)}</Td>
                <Td>{toUSD(longer.loanAmt)}</Td>
                <Td>{toUSD(longer.investmentAmt)}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </div>
  )
}

export default AmortizationTable
