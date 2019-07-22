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
export function getAnnualResultsByOption ({
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

  const annualResultsByOption = {
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

  for (let year = 1; year <= longerOption.mortgageTerm; year++) {
    const lastShorterOptionResult = annualResultsByOption.shorter[year - 1]

    annualResultsByOption.shorter.push(
      getAnnualResult(
        shorterOption.mortgageRate,
        investmentRate,
        inflationRate,
        lastShorterOptionResult
      )
    )
    annualResultsByOption.longer.push(
      getAnnualResult(
        longerOption.mortgageRate,
        investmentRate,
        inflationRate,
        annualResultsByOption.longer[year - 1]
      )
    )
  }

  return annualResultsByOption
}

function getAnnualResult (
  mortgageRate,
  investmentRate,
  inflationRate,
  lastResult
) {
  let pmt = lastResult.pmt

  if (
    lastResult.loanAmount <
    FV(mortgageRate / COMPOUND_FREQUENCY, COMPOUND_FREQUENCY, pmt, 0)
  ) {
    pmt = PMT(
      mortgageRate / COMPOUND_FREQUENCY,
      COMPOUND_FREQUENCY,
      lastResult.loanAmount
    )
  }

  console.log(
    'investmentPMT',
    FV(
      investmentRate / COMPOUND_FREQUENCY,
      COMPOUND_FREQUENCY,
      lastResult.budget - pmt,
      0
    )
  )

  const resultBeforeInflation = {
    budget: lastResult.budget,
    pmt: pmt,
    loanAmount:
      -1 *
      FV(
        mortgageRate / COMPOUND_FREQUENCY,
        COMPOUND_FREQUENCY,
        pmt,
        lastResult.loanAmount
      ),
    investmentAmount:
      -1 *
      FV(
        investmentRate / COMPOUND_FREQUENCY,
        COMPOUND_FREQUENCY,
        lastResult.budget - pmt,
        lastResult.investmentAmount
      )
  }

  const resultAfterInflation = {}

  _.forOwn(
    resultBeforeInflation,
    (value, key) =>
      (resultAfterInflation[key] = getAnnualValueAfterInflation(
        value,
        inflationRate
      ))
  )

  return resultAfterInflation
}

function getAnnualValueAfterInflation (value, inflationRate) {
  return (
    -1 *
    FV((-1 * inflationRate) / COMPOUND_FREQUENCY, COMPOUND_FREQUENCY, 0, value)
  )
}
