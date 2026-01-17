// Solar calculation utilities

export function calculateROI(goalAmount, systemSize) {
  // Average solar panel generates 1.5 kWh per watt per year in Chicago
  const annualKWh = systemSize * 1000 * 1.5
  
  // Average electricity rate in Chicago: $0.15/kWh
  const annualSavings = annualKWh * 0.15
  
  // Investor gets 60% of savings
  const investorAnnualReturn = annualSavings * 0.6
  
  // ROI = (Annual Return / Investment) * 100
  const roi = (investorAnnualReturn / goalAmount) * 100
  
  return {
    roi: roi.toFixed(1),
    annualReturn: investorAnnualReturn.toFixed(0),
    annualSavings: annualSavings.toFixed(0),
    monthlySavings: (annualSavings / 12).toFixed(0),
    paybackYears: (goalAmount / investorAnnualReturn).toFixed(1)
  }
}

export function calculateCO2Savings(systemSize) {
  // Average: 1 kW of solar prevents 1.5 tons CO2 per year
  const annualCO2Tons = systemSize * 1.5
  return {
    annual: annualCO2Tons.toFixed(1),
    lifetime25Years: (annualCO2Tons * 25).toFixed(0),
    treesEquivalent: Math.round(annualCO2Tons * 50) // 1 tree = ~0.02 tons CO2/year
  }
}

export function estimateSystemSize(goalAmount) {
  // Average cost: $3/watt installed
  const watts = goalAmount / 3
  return (watts / 1000).toFixed(1) // Convert to kW
}