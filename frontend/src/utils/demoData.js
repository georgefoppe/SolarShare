export function loadDemoData(addProject) {
  const demoProjects = [
    {
      projectName: "Lincoln Park Solar Initiative",
      address: "2450 N Lincoln Ave",
      location: "Chicago, IL",
      goalAmount: 18000,
      roofSize: 1200,
      systemSize: 6.0,
      roi: 8.5,
      monthlySavings: 185,
      annualCO2Saved: 9.0
    },
    {
      projectName: "Suburban Green Energy",
      address: "1828 Oak Street",
      location: "Evanston, IL",
      goalAmount: 22000,
      roofSize: 1500,
      systemSize: 7.3,
      roi: 9.1,
      monthlySavings: 215,
      annualCO2Saved: 11.0
    },
    {
      projectName: "South Side Solar",
      address: "5521 S Harper Ave",
      location: "Chicago, IL",
      goalAmount: 15000,
      roofSize: 950,
      systemSize: 5.0,
      roi: 8.2,
      monthlySavings: 155,
      annualCO2Saved: 7.5
    }
  ];

  demoProjects.forEach(project => addProject(project));
}