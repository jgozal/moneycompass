import * as _ from 'lodash'
import { FV, PMT } from 'formulajs/lib/financial'

const COMPOUND_FREQUENCY = 12

/**
 * @param {number} option.loanAmount How much money the loan is
 * @param {number} option.investmentRate Market return rate (in decimals)
 * @param {number} option.inflationRate Annual inflation rate (in decimals)
 * @param {object} option.shorterOption
 *   @property {number} mortgageRate Mortgage APR (in decimals)
 *   @property {number} mortgageTerm Mortgage term (in years)
 * @param {object} option.longerOption
 *
 * @return {object}
 *   @property {object[]} shorter
 *     @property {number} pmt Monthly payment amount (for that year)
 *     @property {number} loanAmount Remaining loan amount
 *     @property {number} investmentAmount How much money in investments
 *   @property {object[]} longer
 */
export function getMonthlyResultsByOption ({
  loanAmount,
  investmentRate,
  inflationRate,
  shorterOption,
  longerOption
}) {
  const shorterOptionPMT = PMT(
    shorterOption.mortgageRate / COMPOUND_FREQUENCY,
    shorterOption.mortgageTerm * COMPOUND_FREQUENCY,
    loanAmount
  )

  const longerOptionPMT = PMT(
    longerOption.mortgageRate / COMPOUND_FREQUENCY,
    longerOption.mortgageTerm * COMPOUND_FREQUENCY,
    loanAmount
  )

  const monthlyResultsByOption = {
    shorter: [
      {
        budget: shorterOptionPMT,
        pmt: shorterOptionPMT,
        loanAmount: loanAmount,
        investmentAmount: 0
      }
    ],
    longer: [
      {
        budget: shorterOptionPMT,
        pmt: longerOptionPMT,
        loanAmount: loanAmount,
        investmentAmount: 0
      }
    ]
  }

  for (
    let month = 1;
    month <= longerOption.mortgageTerm * COMPOUND_FREQUENCY;
    month++
  ) {
    monthlyResultsByOption.shorter.push(
      getMonthlyResult(
        shorterOption.mortgageRate,
        investmentRate,
        inflationRate,
        monthlyResultsByOption.shorter[month - 1]
      )
    )
    monthlyResultsByOption.longer.push(
      getMonthlyResult(
        longerOption.mortgageRate,
        investmentRate,
        inflationRate,
        monthlyResultsByOption.longer[month - 1]
      )
    )
  }

  return monthlyResultsByOption
}

export function getYearlyResultsByOption (arr) {
  const finalArr = []

  let pmtResult = 0
  let investmentPMTResult = 0

  arr.forEach((item, index) => {
    pmtResult += item.pmt
    investmentPMTResult += item.investmentPMT
    if ((index + 1) % 12 === 0) {
      finalArr.push({
        pmt: pmtResult || 0,
        investmentPMT: investmentPMTResult || 0,
        loanAmount: item.loanAmount || 0,
        investmentAmount: item.investmentAmount || 0
      })

      pmtResult = 0
      investmentPMTResult = 0
    }
  })

  return finalArr
}

function getMonthlyResult (
  mortgageRate,
  investmentRate,
  inflationRate,
  lastResult
) {
  let pmt = lastResult.pmt

  // If the loan is less than the monthly payment, only pay what's remaining in
  // the loan amount
  if (
    lastResult.loanAmount < FV(mortgageRate / COMPOUND_FREQUENCY, 1, pmt, 0)
  ) {
    pmt = PMT(mortgageRate / COMPOUND_FREQUENCY, 1, lastResult.loanAmount)
  }

  // Everything else can be invested
  const investmentPMT = lastResult.budget - pmt

  const resultBeforeInflation = {
    budget: lastResult.budget,
    pmt: pmt,
    investmentPMT: investmentPMT,
    loanAmount:
      -1 * FV(mortgageRate / COMPOUND_FREQUENCY, 1, pmt, lastResult.loanAmount),
    investmentAmount:
      -1 *
      FV(
        investmentRate / COMPOUND_FREQUENCY,
        1,
        investmentPMT,
        lastResult.investmentAmount
      )
  }

  const resultAfterInflation = {}

  _.forOwn(
    resultBeforeInflation,
    (value, key) =>
      (resultAfterInflation[key] = getMonthlyValueAfterInflation(
        value,
        inflationRate
      ))
  )

  return resultAfterInflation
}

function getMonthlyValueAfterInflation (value, inflationRate) {
  return -1 * FV((-1 * inflationRate) / COMPOUND_FREQUENCY, 1, 0, value)
}
