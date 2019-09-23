const COMPOUND_FREQUENCY = 12

/**
 * @param {number} option.loanAmt How much money the loan is
 * @param {number} option.investmentRate Market return rate (in decimals)
 * @param {number} option.inflationRate Annual inflation rate (in decimals)
 * @param {object} option.shorterOption
 *   @property {number} mortgageRate Mortgage APR (in decimals)
 *   @property {number} mortgageTerm Mortgage term (in years)
 *   @property {number} mortgagePMT Mortgage payment (monthly)
 * @param {object} option.longerOption
 *
 * @return {object}
 *   @property {object[]} shorter
 *     @property {number} pmt Monthly payment amount (for that year)
 *     @property {number} loanAmt Remaining loan amount
 *     @property {number} investmentAmt How much money in investments
 *   @property {object[]} longer
 */

export const getMonthly = ({
  loanAmt,
  investmentRate,
  inflationRate,
  shorterOption,
  longerOption
}) => {
  const monthlySeries = {}

  const budget = Math.abs(shorterOption.mortgagePMT)
  const monthlyInflationRate = inflationRate / COMPOUND_FREQUENCY
  const monthlyInvestmentRate = 1 + investmentRate / COMPOUND_FREQUENCY
  const shorterOptionMonthlyMortgageRate =
    1 + shorterOption.mortgageRate / COMPOUND_FREQUENCY
  const longerOptionMonthlyMortgageRate =
    1 + longerOption.mortgageRate / COMPOUND_FREQUENCY

  const getValuesAfterInflation = termSeries => {
    return termSeries.map((monthData, index) => {
      const monthAfterInflation = {}
      for (const key in monthData) {
        monthAfterInflation[key] =
          monthData[key] * getPurchasingPower(index + 1, monthlyInflationRate)
      }
      return monthAfterInflation
    })
  }

  const checkShorterCutoff = (month, value, before) => {
    let condition

    if (before) {
      condition = month <= shorterOption.mortgageTerm * COMPOUND_FREQUENCY - 1
    } else {
      condition = month > shorterOption.mortgageTerm * COMPOUND_FREQUENCY - 1
    }

    return condition ? value : 0
  }

  const shorterList = [
    {
      budget: budget,
      pmt: budget,
      loanAmt:
        loanAmt * shorterOptionMonthlyMortgageRate + shorterOption.mortgagePMT,
      investmentPMT: 0,
      investmentAmt: 0
    }
  ]
  const longerList = [
    {
      budget: budget,
      pmt: Math.abs(longerOption.mortgagePMT),
      loanAmt:
        loanAmt * longerOptionMonthlyMortgageRate + longerOption.mortgagePMT,
      investmentPMT: budget + longerOption.mortgagePMT,
      investmentAmt: budget + longerOption.mortgagePMT
    }
  ]

  for (
    let month = 1;
    month <= longerOption.mortgageTerm * COMPOUND_FREQUENCY - 1;
    month++
  ) {
    const shorterPrevMonth = shorterList[month - 1]
    const longerPrevMonth = longerList[month - 1]

    const shorter = {
      budget: shorterPrevMonth.budget,
      pmt: checkShorterCutoff(month, shorterPrevMonth.budget, true),
      loanAmt:
        shorterPrevMonth.loanAmt * shorterOptionMonthlyMortgageRate -
        checkShorterCutoff(month, shorterPrevMonth.budget, true),
      investmentPMT: checkShorterCutoff(month, shorterPrevMonth.budget, false),
      investmentAmt:
        shorterPrevMonth.investmentAmt * monthlyInvestmentRate +
        checkShorterCutoff(month, budget, false)
    }

    const longer = {
      budget: longerPrevMonth.budget,
      pmt: longerPrevMonth.pmt,
      loanAmt:
        longerPrevMonth.loanAmt * longerOptionMonthlyMortgageRate -
        longerPrevMonth.pmt,
      investmentPMT: longerPrevMonth.investmentPMT,
      investmentAmt:
        longerPrevMonth.investmentAmt * monthlyInvestmentRate +
        (budget + longerOption.mortgagePMT)
    }

    shorterList.push(shorter)
    longerList.push(longer)
  }

  monthlySeries.shorter = getValuesAfterInflation(shorterList)
  monthlySeries.longer = getValuesAfterInflation(longerList)

  return monthlySeries
}

export const getYearly = ({
  loanAmt,
  investmentRate,
  inflationRate,
  shorterOption,
  longerOption
}) => {
  const yearlySeries = {}

  const monthlySeries = getMonthly({
    loanAmt,
    investmentRate,
    inflationRate,
    shorterOption,
    longerOption
  })

  let budgetResult = 0
  let pmtResult = 0
  let investmentPMTResult = 0

  for (const term in monthlySeries) {
    yearlySeries[term] = []

    monthlySeries[term].forEach((month, index) => {
      budgetResult += month.budget
      pmtResult += month.pmt
      investmentPMTResult += month.investmentPMT
      if ((index + 1) % 12 === 0) {
        yearlySeries[term].push({
          budget: budgetResult || 0,
          pmt: pmtResult || 0,
          investmentPMT: investmentPMTResult || 0,
          loanAmt: month.loanAmt || 0,
          investmentAmt: month.investmentAmt || 0
        })
        budgetResult = 0
        pmtResult = 0
        investmentPMTResult = 0
      }
    })
  }

  return yearlySeries
}

export const getPurchasingPower = (term, inflationRate, compoundFrequency) => {
  return (
    1 /
    (1 + inflationRate / (compoundFrequency || 1)) **
      (term * (compoundFrequency || 1))
  )
}
