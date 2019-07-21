import { FV, PMT } from 'formulajs/lib/financial'

const COMPOUND_FREQUENCY = 12

export function getAnnualResultsByOption ({
  loanAmount,
  investmentRate,
  shorterOption,
  longerOption
}) {
  let shorterOptionPMT = PMT(
    shorterOption.mortgageRate / COMPOUND_FREQUENCY,
    shorterOption.mortgageTerm * COMPOUND_FREQUENCY,
    loanAmount
  )

  const longerOptionPMT = PMT(
    longerOption.mortgageRate / COMPOUND_FREQUENCY,
    longerOption.mortgageTerm * COMPOUND_FREQUENCY,
    loanAmount
  )

  const budget = Math.min(shorterOptionPMT, longerOptionPMT)

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

  for (let i = 1; i <= longerOption.mortgageTerm; i++) {
    const lastShorterOptionResult = annualResultsByOption.shorter[i - 1]
    const lastLongerOptionResult = annualResultsByOption.longer[i - 1]

    // We we get close to paying off the shorter term mortgage, we reduce our payment until the
    // mortgage becomes 0
    if (lastShorterOptionResult.loanAmount < -1 * budget) {
      shorterOptionPMT = Math.min(-1 * lastShorterOptionResult.loanAmount, 0)
    }

    annualResultsByOption.shorter.push(
      getAnnualResult(
        budget,
        shorterOptionPMT,
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
