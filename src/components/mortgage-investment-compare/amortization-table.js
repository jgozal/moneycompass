import React from 'react'

import { Table } from 'reactstrap'
import { LIGHT_GRAY, GRAY, LIGHT_GREEN } from '../../assets/colors'
import { css, cx } from 'react-emotion'

import { formatMoney } from '../../utils/numberUtils'

const amortizationTable = css`
  thead tr:first-of-type th {
    font-size: 1rem;
  }

  th,
  tbody {
    text-align: center;
    font-size: 0.75rem;
  }

  th:first-of-type,
  td:first-of-type {
    white-space: nowrap;
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
  return checkLoanTerms(year, option1, option2)
    ? css`
        td:nth-child(n + 2):nth-child(-n + 5) {
          background-color: ${option1.fv > option2.fv
    ? LIGHT_GREEN
    : LIGHT_GRAY};
        }

        td:nth-child(n + 6):nth-child(-n + 9) {
          background-color: ${option2.fv > option1.fv
    ? LIGHT_GREEN
    : LIGHT_GRAY};
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
      cell.addEventListener('mouseover', () =>
        hover(LIGHT_GRAY, 85, cell, index)
      )
      cell.addEventListener('mouseleave', () =>
        hover('white', 100, cell, index)
      )
    }
  })
}

const AmortizationTable = props => {
  return (
    props.showTable && (
      <Table bordered responsive className={cx(amortizationTable, 'mt-4')}>
        <thead>
          <tr>
            <th colSpan='1' />
            <th colSpan='4'>{props.shorterOption.term} year</th>
            <th colSpan='4'>{props.longerOption.term} year</th>
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
          {props.yearlyResultsByOption.shorter.map((_r, year) => {
            const shorter = props.yearlyResultsByOption.shorter[year]
            const longer = props.yearlyResultsByOption.longer[year]

            return (
              <tr
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
                <td>Year {year + 1}</td>
                <td>{formatMoney(-shorter.pmt)}</td>
                <td>{formatMoney(-shorter.investmentPMT)}</td>
                <td>{formatMoney(shorter.loanAmt)}</td>
                <td>{formatMoney(-shorter.investmentAmount)}</td>
                <td>{formatMoney(-longer.pmt)}</td>
                <td>{formatMoney(-longer.investmentPMT)}</td>
                <td>{formatMoney(longer.loanAmt)}</td>
                <td>{formatMoney(-longer.investmentAmount)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  )
}

export default AmortizationTable
