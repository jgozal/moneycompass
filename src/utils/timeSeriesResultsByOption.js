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

  /* const getValuesAfterInflation = monthlySeries => {
    const monthlySeriesAfterInflation = {
      shorter: [],
      longer: []
    }

    for (const term in monthlySeries) {
      monthlySeries[term].forEach((month, index) => {
        const monthAfterInflation = {}

        for (const key in month) {
          monthAfterInflation[key] =
            month[key] /
            (1 + (inflationRate / COMPOUND_FREQUENCY) * (index + 1))
        }

        monthlySeriesAfterInflation[term].push(monthAfterInflation)
      })
    }

    return monthlySeriesAfterInflation
  } */

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
      budget: budget / (1 + inflationRate / COMPOUND_FREQUENCY),
      pmt: budget / (1 + inflationRate / COMPOUND_FREQUENCY),
      loanAmt:
        loanAmt * (1 + shorterOption.mortgageRate / COMPOUND_FREQUENCY) +
        shorterOption.mortgagePMT,
      investmentPMT: 0,
      investmentAmount: 0
    }
  ]
  const longerList = [
    {
      budget: budget / (1 + inflationRate / COMPOUND_FREQUENCY),
      pmt:
        Math.abs(longerOption.mortgagePMT) /
        (1 + inflationRate / COMPOUND_FREQUENCY),
      loanAmt:
        loanAmt * (1 + longerOption.mortgageRate / COMPOUND_FREQUENCY) +
        longerOption.mortgagePMT,
      investmentPMT:
        (budget + longerOption.mortgagePMT) /
        (1 + inflationRate / COMPOUND_FREQUENCY),
      investmentAmount: budget + longerOption.mortgagePMT
    }
  ]

  for (
    let month = 1;
    month <= longerOption.mortgageTerm * COMPOUND_FREQUENCY - 1;
    month++
  ) {
    const shorter = {
      budget:
        shorterList[month - 1].budget /
        (1 + inflationRate / COMPOUND_FREQUENCY),
      pmt: checkShorterCutoff(month, shorterList[month - 1].budget, true),
      loanAmt:
        shorterList[month - 1].loanAmt *
          (1 + shorterOption.mortgageRate / COMPOUND_FREQUENCY) -
        checkShorterCutoff(month, budget, true),
      investmentPMT: checkShorterCutoff(
        month,
        shorterList[month - 1].budget,
        false
      ),
      investmentAmount:
        (shorterList[month - 1].investmentAmount *
          (1 + investmentRate / COMPOUND_FREQUENCY)) /
          (1 + inflationRate / COMPOUND_FREQUENCY) +
        checkShorterCutoff(month, budget, false)
    }

    const longer = {
      budget:
        shorterList[month - 1].budget /
        (1 + inflationRate / COMPOUND_FREQUENCY),
      pmt: longerList[month - 1].pmt / (1 + inflationRate / COMPOUND_FREQUENCY),
      loanAmt:
        longerList[month - 1].loanAmt *
          (1 + longerOption.mortgageRate / COMPOUND_FREQUENCY) +
        longerOption.mortgagePMT,
      investmentPMT:
        longerList[month - 1].investmentPMT /
        (1 + inflationRate / COMPOUND_FREQUENCY),
      investmentAmount:
        (longerList[month - 1].investmentAmount *
          (1 + investmentRate / COMPOUND_FREQUENCY)) /
          (1 + inflationRate / COMPOUND_FREQUENCY) +
        (budget + longerOption.mortgagePMT)
    }

    shorterList.push(shorter)
    longerList.push(longer)
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
  const monthlySeries = getMonthly({
    loanAmt,
    investmentRate,
    inflationRate,
    shorterOption,
    longerOption
  })

  const yearlySeries = {}

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
