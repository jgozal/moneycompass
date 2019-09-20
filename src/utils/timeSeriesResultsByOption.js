const COMPOUND_FREQUENCY = 12

export const getMonthly = ({
  loanAmt,
  investmentRate,
  inflationRate,
  shorterOption,
  longerOption
}) => {
  const monthlySeries = {}

  const shorterList = [
    // first month
    {
      budget:
        Math.abs(shorterOption.mortgagePMT) *
        (1 - inflationRate / COMPOUND_FREQUENCY),
      investmentPMT: 0,
      investmentAmount: 0,
      pmt: shorterOption.mortgagePMT * (1 - inflationRate / COMPOUND_FREQUENCY),
      loanAmt:
        loanAmt *
          (1 + shorterOption.mortgageRate / COMPOUND_FREQUENCY) *
          (1 - inflationRate / COMPOUND_FREQUENCY) +
        shorterOption.mortgagePMT * (1 - inflationRate / COMPOUND_FREQUENCY)
    }
  ]

  const longerList = [
    // first month
    {
      budget:
        Math.abs(shorterOption.mortgagePMT) *
        (1 - inflationRate / COMPOUND_FREQUENCY),
      investmentPMT:
        (shorterOption.mortgagePMT - longerOption.mortgagePMT) *
        (1 - inflationRate / COMPOUND_FREQUENCY),
      investmentAmount:
        (shorterOption.mortgagePMT - longerOption.mortgagePMT) *
        (1 - inflationRate / COMPOUND_FREQUENCY),
      pmt: longerOption.mortgagePMT * (1 - inflationRate / COMPOUND_FREQUENCY),
      loanAmt:
        loanAmt *
          (1 + longerOption.mortgageRate / COMPOUND_FREQUENCY) *
          (1 - inflationRate / COMPOUND_FREQUENCY) +
        longerOption.mortgagePMT * (1 - inflationRate / COMPOUND_FREQUENCY)
    }
  ]

  const getShorterInvestmentPMT = (month, budget, inflationAdjusted) => {
    let investmentPMT
    if (month <= shorterOption.mortgageTerm * COMPOUND_FREQUENCY) {
      investmentPMT = 0
    } else {
      investmentPMT = inflationAdjusted
        ? budget * (1 - inflationRate / COMPOUND_FREQUENCY)
        : budget
    }
    return investmentPMT
  }

  const getShorterLoanPMT = (month, prevPMT, inflationAdjusted) => {
    let loanPMT
    if (month >= shorterOption.mortgageTerm * COMPOUND_FREQUENCY) {
      loanPMT = 0
    } else {
      loanPMT = inflationAdjusted
        ? prevPMT * (1 - inflationRate / COMPOUND_FREQUENCY)
        : shorterOption.mortgagePMT
    }
    return loanPMT
  }

  // results after inflation
  for (
    let month = 1;
    month <= longerOption.mortgageTerm * COMPOUND_FREQUENCY - 1;
    month++
  ) {
    const shorter = {
      budget: Math.abs(
        shorterList[month - 1].budget * (1 - inflationRate / COMPOUND_FREQUENCY)
      ),
      pmt: getShorterLoanPMT(month, shorterList[month - 1].pmt, true),
      loanAmt:
        shorterList[month - 1].loanAmt *
          (1 + shorterOption.mortgageRate / COMPOUND_FREQUENCY) *
          (1 - inflationRate / COMPOUND_FREQUENCY) +
        getShorterLoanPMT(month, shorterList[month - 1].pmt, true),
      investmentPMT: getShorterInvestmentPMT(
        month,
        shorterList[month - 1].budget,
        true
      ),
      investmentAmount:
        shorterList[month - 1].investmentAmount *
          (1 - inflationRate / COMPOUND_FREQUENCY) *
          (1 + investmentRate / COMPOUND_FREQUENCY) +
        getShorterInvestmentPMT(month, shorterList[month - 1].budget, true)
    }

    const longer = {
      budget: Math.abs(
        longerList[month - 1].budget * (1 - inflationRate / COMPOUND_FREQUENCY)
      ),
      pmt: longerList[month - 1].pmt * (1 - inflationRate / COMPOUND_FREQUENCY),
      loanAmt:
        longerList[month - 1].loanAmt *
          (1 + longerOption.mortgageRate / COMPOUND_FREQUENCY) *
          (1 - inflationRate / COMPOUND_FREQUENCY) +
        longerList[month - 1].pmt * (1 - inflationRate / COMPOUND_FREQUENCY),
      investmentPMT:
        (shorterList[month - 1].pmt - longerList[month - 1].pmt) *
        (1 - inflationRate / COMPOUND_FREQUENCY),
      investmentAmount:
        longerList[month - 1].investmentAmount *
          (1 - inflationRate / COMPOUND_FREQUENCY) *
          (1 + investmentRate / COMPOUND_FREQUENCY) +
        (shorterList[month - 1].pmt - longerList[month - 1].pmt) *
          (1 - inflationRate / COMPOUND_FREQUENCY)
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
