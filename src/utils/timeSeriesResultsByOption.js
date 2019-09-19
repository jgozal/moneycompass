import * as _ from 'lodash'
import { FV, PMT } from 'formulajs/lib/financial'

const COMPOUND_FREQUENCY = 12

/**
 * @param {number} option.loanAmt How much money the loan is
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
 *     @property {number} loanAmt Remaining loan amount
 *     @property {number} investmentAmt How much money in investments
 *   @property {object[]} longer
 */
export function getMonthly ({
  loanAmt,
  investmentRate,
  inflationRate,
  shorterOption,
  longerOption
}) {
  const shorterPMT =
    -1 *
    PMT(
      shorterOption.mortgageRate / COMPOUND_FREQUENCY,
      shorterOption.mortgageTerm * COMPOUND_FREQUENCY,
      loanAmt
    )
  const longerPMT =
    -1 *
    PMT(
      longerOption.mortgageRate / COMPOUND_FREQUENCY,
      longerOption.mortgageTerm * COMPOUND_FREQUENCY,
      loanAmt
    )

  const initial = {
    action: {
      invested: 0,
      paid: 0
    },
    outcome: {
      investment: 0,
      loan: loanAmt
    }
  }

  const longerResults = [initial]
  const shorterResults = [initial]

  while (_.last(longerResults).outcome.loan > 0 && longerResults.length < 900) {
    longerResults.push(
      getNextMonthWithPartialInvestment({
        currentMonth: _.last(longerResults),
        invested: shorterPMT - longerPMT,
        investmentRate,
        paid: longerPMT
      })
    )
    shorterResults.push(
      getNextMonthWithFullInvestment({
        currentMonth: _.last(shorterResults),
        budget: shorterPMT,
        investmentRate
      })
    )
  }

  return {
    longer: _.tail(longerResults),
    shorter: _.tail(shorterResults)
  }
}

function getNextMonthWithFullInvestment ({
  currentMonth,
  budget,
  investmentRate
}) {
  let invested, paid
  if (currentMonth.outcome.loan >= budget) {
    invested = 0
    paid = budget
  } else {
    invested = budget - currentMonth.outcome.loan
    paid = currentMonth.outcome.loan
  }
  return {
    action: { invested, paid },
    outcome: {
      investment:
        -1 *
        FV(
          investmentRate / COMPOUND_FREQUENCY,
          1,
          invested,
          currentMonth.outcome.investment
        ),
      loan: currentMonth.outcome.loan - paid
    }
  }
}

function getNextMonthWithPartialInvestment ({
  currentMonth,
  invested,
  investmentRate,
  paid
}) {
  return {
    action: { invested, paid },
    outcome: {
      investment:
        -1 *
        FV(
          investmentRate / COMPOUND_FREQUENCY,
          1,
          invested,
          currentMonth.outcome.investment
        ),
      loan: currentMonth.outcome.loan - paid
    }
  }
}

export function getYearly ({
  loanAmt,
  investmentRate,
  inflationRate,
  shorterOption,
  longerOption
}) {
  const { longer, shorter } = getMonthly({
    loanAmt,
    investmentRate,
    inflationRate,
    shorterOption,
    longerOption
  })
  return {
    longer: toYearly(longer),
    shorter: toYearly(shorter)
  }
}

function toYearly (results) {
  return _.chain(results)
    .chunk(12)
    .map(monthes => {
      return {
        action: {
          invested: _.sumBy(monthes, 'action.invested'),
          paid: _.sumBy(monthes, 'action.paid')
        },
        outcome: _.last(monthes).outcome
      }
    })
    .value()
}
