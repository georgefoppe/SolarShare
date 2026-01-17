import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FundingChart({ projects }) {
  // Generate data by date
  const allInvestments = [];
  
  projects.forEach(project => {
    project.investors?.forEach(inv => {
      allInvestments.push({
        date: new Date(inv.date),
        amount: inv.amount,
        project: project.projectName
      });
    });
  });

  // Sort by date
  allInvestments.sort((a, b) => a.date - b.date);

  // Calculate cumulative funding
  let cumulative = 0;
  const chartData = allInvestments.map(inv => {
    cumulative += inv.amount;
    return {
      date: inv.date.toLocaleDateString(),
      total: cumulative,
      investment: inv.amount
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="alert alert-info">
        No investment data yet. Start investing to see the chart!
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5>Funding Growth Over Time</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#0d6efd" 
              strokeWidth={2}
              name="Cumulative Funding"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}