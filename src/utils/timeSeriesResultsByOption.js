const COMPOUND_FREQUENCY = 12

export const getMonthly = ({
  loanAmt,
  investmentRate,
  inflationRate,
  shorterOption,
  longerOption
}) => {
  const monthlySeries = {}

  const budget = Math.abs(shorterOption.mortgagePMT)
  const monthlyInflationRate = 1 + inflationRate / COMPOUND_FREQUENCY
  const monthlyInvestmentRate = 1 + investmentRate / COMPOUND_FREQUENCY
  const shorterOptionMonthlyMortgageRate =
    1 + shorterOption.mortgageRate / COMPOUND_FREQUENCY
  const longerOptionMonthlyMortgageRate =
    1 + longerOption.mortgageRate / COMPOUND_FREQUENCY

  const getValuesAfterInflation = monthData => {
    const monthAfterInflation = {}
    for (const key in monthData) {
      monthAfterInflation[key] = monthData[key] / monthlyInflationRate
    }
    return monthAfterInflation
  }

  const checkShorterCutoff = (month, value, before) => {
    let condition

    if (before) {
      condition =
        month + 1 <= shorterOption.mortgageTerm * COMPOUND_FREQUENCY - 1
    } else {
      condition =
        month + 1 > shorterOption.mortgageTerm * COMPOUND_FREQUENCY - 1
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
      investmentAmount: 0
    }
  ]
  const longerList = [
    {
      budget: budget,
      pmt: Math.abs(longerOption.mortgagePMT),
      loanAmt:
        loanAmt * longerOptionMonthlyMortgageRate + longerOption.mortgagePMT,
      investmentPMT: budget + longerOption.mortgagePMT,
      investmentAmount: budget + longerOption.mortgagePMT
    }
  ]

  for (
    let month = 0;
    month <= longerOption.mortgageTerm * COMPOUND_FREQUENCY;
    month++
  ) {
    const shorterPrevMonth = shorterList[month]
    const longerPrevMonth = longerList[month]

    const shorter = {
      budget: shorterPrevMonth.budget,
      pmt: checkShorterCutoff(month, shorterPrevMonth.budget, true),
      loanAmt:
        shorterPrevMonth.loanAmt * shorterOptionMonthlyMortgageRate -
        checkShorterCutoff(month, shorterPrevMonth.budget, true),
      investmentPMT: checkShorterCutoff(month, shorterPrevMonth.budget, false),
      investmentAmount:
        shorterPrevMonth.investmentAmount * monthlyInvestmentRate +
        checkShorterCutoff(month, budget, false)
    }

    const longer = {
      budget: longerPrevMonth.budget,
      pmt: longerPrevMonth.pmt,
      loanAmt:
        longerPrevMonth.loanAmt * longerOptionMonthlyMortgageRate -
        longerPrevMonth.pmt,
      investmentPMT: longerPrevMonth.investmentPMT,
      investmentAmount:
        longerPrevMonth.investmentAmount * monthlyInvestmentRate +
        (budget + longerOption.mortgagePMT)
    }

    shorterList.push(getValuesAfterInflation(shorter))
    longerList.push(getValuesAfterInflation(longer))
  }

  monthlySeries.shorter = shorterList
  monthlySeries.longer = longerList

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
          investmentAmount: month.investmentAmount || 0
        })
        budgetResult = 0
        pmtResult = 0
        investmentPMTResult = 0
      }
    })
  }

  return yearlySeries
}
