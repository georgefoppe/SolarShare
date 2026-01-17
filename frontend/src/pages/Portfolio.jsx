import { useProjects } from '../ProjectContext.jsx';
import { useState } from 'react';

export default function Portfolio() {
  const { projects } = useProjects();
  const [investorName, setInvestorName] = useState('');

  if (!investorName) {
    return (
      <div className="container py-5 text-center">
        <h2>Your Investment Portfolio</h2>
        <p className="text-muted">Enter your name to view your investments</p>
        <div className="row justify-content-center">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Your name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') setInvestorName(e.target.value);
              }}
            />
            <button 
              className="btn btn-primary"
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                setInvestorName(input.value);
              }}
            >
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate user's investments
  const myInvestments = [];
  let totalInvested = 0;
  let totalReturnsProjected = 0;

  projects.forEach(project => {
    const userInvs = project.investors?.filter(inv => inv.name === investorName) || [];
    if (userInvs.length > 0) {
      const investedAmount = userInvs.reduce((sum, inv) => sum + inv.amount, 0);
      totalInvested += investedAmount;
      
      const annualReturn = (investedAmount * project.roi) / 100;
      totalReturnsProjected += annualReturn;

      myInvestments.push({
        project,
        invested: investedAmount,
        annualReturn,
        investments: userInvs
      });
    }
  });

  if (myInvestments.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your Investment Portfolio</h2>
        <div className="alert alert-info mt-4">
          <p>You haven't made any investments yet, {investorName}.</p>
          <a href="/investor" className="btn btn-primary">Browse Projects</a>
        </div>
        <button 
          className="btn btn-link"
          onClick={() => setInvestorName('')}
        >
          Change name
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Portfolio - {investorName}</h2>
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setInvestorName('')}
        >
          Change name
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6 className="opacity-75">Total Invested</h6>
              <h3 className="mb-0">${totalInvested.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6 className="opacity-75">Annual Returns</h6>
              <h3 className="mb-0">${totalReturnsProjected.toFixed(0)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6 className="opacity-75">Active Projects</h6>
              <h3 className="mb-0">{myInvestments.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Details */}
      <h4 className="mb-3">Your Investments</h4>
      {myInvestments.map(({ project, invested, annualReturn, investments }) => (
        <div key={project.id} className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h5 className="card-title">{project.projectName}</h5>
                <p className="text-muted mb-2">{project.location}</p>
                
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Your Investment</small>
                    <p className="mb-0 fw-bold">${invested.toLocaleString()}</p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Annual Return</small>
                    <p className="mb-0 fw-bold text-success">
                      ${annualReturn.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 text-end">
                <div className="mb-2">
                  <span className="badge bg-primary">{project.roi}% ROI</span>
                </div>
                <small className="text-muted">
                  {investments.length} transaction{investments.length !== 1 ? 's' : ''}
                </small>
              </div>
            </div>
            
            {/* Transaction History */}
            <div className="mt-3">
              <small className="text-muted fw-bold">Transaction History:</small>
              <ul className="list-unstyled small mt-2">
                {investments.map((inv, idx) => (
                  <li key={idx} className="mb-1">
                    ${inv.amount.toLocaleString()} on {inv.date}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      {/* Projected Returns Chart */}
      <div className="card mt-4">
        <div className="card-body">
          <h5>10-Year Projection</h5>
          <p className="text-muted">
            If you hold all investments for 10 years at current rates:
          </p>
          <div className="row text-center">
            <div className="col-4">
              <h4 className="text-primary">${totalInvested.toLocaleString()}</h4>
              <small>Principal</small>
            </div>
            <div className="col-4">
              <h4 className="text-success">
                ${(totalReturnsProjected * 10).toFixed(0).toLocaleString()}
              </h4>
              <small>Total Returns</small>
            </div>
            <div className="col-4">
              <h4 className="text-info">
                ${(totalInvested + totalReturnsProjected * 10).toFixed(0).toLocaleString()}
              </h4>
              <small>Total Value</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}