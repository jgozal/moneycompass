import { FV, PMT } from 'formulajs/lib/financial'

const COMPOUND_FREQUENCY = 12

/**
 * @param {number} option.loanAmount How much money the loan is
 * @param {number} option.investmentRate Market return rate (in decimals)
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
        loanAmount: loanAmount,
        investmentAmount: 0
      }
    ],
    longer: [
      {
        loanAmount: loanAmount,
        investmentAmount: 0
      }
    ]
  }

  // Both options spend the same amount of money monthly, depending on which
  // mortgage payment is higher
  const budget = shorterOptionPMT

  // Since we'll shift our budget to investment for the shorter plan, this
  // payment may change
  let currentShorterOptionPMT = shorterOptionPMT

  for (let year = 1; year <= longerOption.mortgageTerm; year++) {
    const lastShorterOptionResult = annualResultsByOption.shorter[year - 1]

    // We we get close to paying off the shorter term mortgage, we reduce our
    // payment until the mortgage becomes 0
    //
    // TODO 2019-07-21: There's probably a bug here, since the PMT is monthly
    //   and we are doing annual calculations here
    if (lastShorterOptionResult.loanAmount < -1 * budget) {
      currentShorterOptionPMT = Math.min(
        -1 * lastShorterOptionResult.loanAmount,
        0
      )
    }

    annualResultsByOption.shorter.push(
      getAnnualResult(
        budget,
        currentShorterOptionPMT,
        shorterOption.mortgageRate,
        investmentRate,
        lastShorterOptionResult
      )
    )
    annualResultsByOption.longer.push(
      getAnnualResult(
        budget,
        longerOptionPMT,
        longerOption.mortgageRate,
        investmentRate,
        annualResultsByOption.longer[year - 1]
      )
    )
  }

  return annualResultsByOption
}

function getAnnualResult (budget, pmt, mortgageRate, investmentRate, result) {
  return {
    pmt,
    loanAmount:
      -1 *
      FV(
        mortgageRate / COMPOUND_FREQUENCY,
        COMPOUND_FREQUENCY,
        pmt,
        result.loanAmount
      ),
    investmentAmount:
      -1 *
      FV(
        investmentRate / COMPOUND_FREQUENCY,
        COMPOUND_FREQUENCY,
        budget - pmt,
        result.investmentAmount
      )
  }
}
