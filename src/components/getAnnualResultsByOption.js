import { FV, PMT } from 'formulajs/lib/financial'

const COMPOUND_FREQUENCY = 12

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

  for (let i = 1; i <= longerOption.mortgageTerm; i++) {
    const lastShorterOptionResult = annualResultsByOption.shorter[i - 1]
    const lastLongerOptionResult = annualResultsByOption.longer[i - 1]

    // We we get close to paying off the shorter term mortgage, we reduce our
    // payment until the mortgage becomes 0
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
        lastLongerOptionResult
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
