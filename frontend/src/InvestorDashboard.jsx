import { useState } from 'react';
import { useProjects } from './ProjectContext.jsx';
import { calculateCO2Savings } from './utils/solarCalculator.js';

export default function InvestorDashboard() {
  const { projects, investInProject } = useProjects();
  const [investorName, setInvestorName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [viewingProject, setViewingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, funding, funded

  const handleInvest = (project) => {
    setSelectedProject(project);
  };

  const confirmInvestment = () => {
    if (!investorName.trim()) {
      alert('Please enter your name!');
      return;
    }
    
    const amount = parseFloat(investAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid investment amount!');
      return;
    }

    if (amount > (selectedProject.goalAmount - selectedProject.currentFunding)) {
      alert('Investment amount exceeds remaining funding needed!');
      return;
    }

    investInProject(selectedProject.id, amount, investorName);
    
    alert(`✅ Success! You invested $${amount.toLocaleString()} in ${selectedProject.projectName}`);
    
    setSelectedProject(null);
    setInvestAmount('');
  };

  const cancelInvestment = () => {
    setSelectedProject(null);
    setInvestAmount('');
  };

  // Calculate user's total investments
  const myInvestments = projects.reduce((total, project) => {
    const myInvs = project.investors?.filter(inv => inv.name === investorName) || [];
    return total + myInvs.reduce((sum, inv) => sum + inv.amount, 0);
  }, 0);

  const myProjectCount = projects.filter(p => 
    p.investors?.some(inv => inv.name === investorName)
  ).length;

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const fundingPercent = (project.currentFunding / project.goalAmount) * 100;
    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'funding' ? fundingPercent < 100 :
      fundingPercent >= 100;
    
    return matchesSearch && matchesStatus;
  });

  const fundingProjectsCount = projects.filter(p => p.currentFunding < p.goalAmount).length;
  const fundedProjectsCount = projects.filter(p => p.currentFunding >= p.goalAmount).length;

  return (
    <div className="container py-4">
      <h2 className="mb-4">💰 Investor Dashboard</h2>
      
      {/* Investor Name Input */}
      {!investorName ? (
        <div className="alert alert-warning">
          <strong>👋 Welcome!</strong> Enter your name to start investing:
          <div className="input-group mt-2" style={{ maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Your name"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setInvestorName(e.target.value.trim());
                }
              }}
            />
            <button 
              className="btn btn-primary"
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                if (input.value.trim()) {
                  setInvestorName(input.value.trim());
                }
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="alert alert-success mb-0">
                Welcome back, <strong>{investorName}</strong>! 
                <button 
                  className="btn btn-sm btn-link"
                  onClick={() => setInvestorName('')}
                >
                  Switch user
                </button>
              </div>
            </div>
            
            {/* User Stats */}
            {myInvestments > 0 && (
              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body py-2">
                    <div className="small">
                      <strong>Your Portfolio</strong><br />
                      💵 ${myInvestments.toLocaleString()} invested<br />
                      📊 {myProjectCount} project{myProjectCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-muted mb-4">
        Browse solar projects and invest to earn returns while helping the environment
      </p>

      {projects.length === 0 ? (
        <div className="alert alert-info">
          <strong>No projects yet!</strong> Check back soon or ask a homeowner to list their project.
          <br />
          <a href="/homeowner" className="btn btn-primary mt-2">List a Project</a>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="row mb-4 g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search projects by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100" role="group">
                <button 
                  className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All ({projects.length})
                </button>
                <button 
                  className={`btn ${filterStatus === 'funding' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('funding')}
                >
                  Funding ({fundingProjectsCount})
                </button>
                <button 
                  className={`btn ${filterStatus === 'funded' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('funded')}
                >
                  Funded ({fundedProjectsCount})
                </button>
              </div>
            </div>
          </div>

          {/* No Results Message */}
          {filteredProjects.length === 0 ? (
            <div className="alert alert-warning">
              <strong>No projects match your filters.</strong> Try adjusting your search or filter.
            </div>
          ) : (
            <>
              {/* Results Count */}
              {(searchTerm || filterStatus !== 'all') && (
                <p className="text-muted mb-3">
                  Showing {filteredProjects.length} of {projects.length} projects
                </p>
              )}

              {/* Project Grid */}
              <div className="row">
                {filteredProjects.map(project => {
                  const fundingPercent = (project.currentFunding / project.goalAmount) * 100;
                  const isFullyFunded = fundingPercent >= 100;
                  const remainingAmount = project.goalAmount - project.currentFunding;
                  const co2Data = calculateCO2Savings(project.systemSize);

                  return (
                    <div key={project.id} className="col-md-6 col-lg-4 mb-4">
                      <div 
                        className="card h-100 shadow-sm hover-shadow" 
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body" onClick={() => setViewingProject(project)}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0">{project.projectName}</h5>
                            {isFullyFunded && (
                              <span className="badge bg-success">Funded!</span>
                            )}
                          </div>
                          
                          <p className="text-muted small mb-3">
                            📍 {project.location}
                          </p>
                          
                          {/* Key Metrics */}
                          <div className="row g-2 mb-3">
                            <div className="col-6">
                              <div className="card bg-light">
                                <div className="card-body p-2 text-center">
                                  <div className="small text-muted">ROI</div>
                                  <div className="fw-bold text-success">{project.roi}%</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                             <div className="card bg-light">
                              <div className="card-body p-2 text-center">
                               <div className="small text-muted">Size</div>
                               <div className="fw-bold">{project.systemSize} kW</div>
                             </div>
                            </div>
                           </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between small text-muted mb-1">
                              <span>Funding</span>
                              <span>{fundingPercent.toFixed(0)}%</span>
                            </div>
                            <div className="progress" style={{ height: '20px' }}>
                              <div 
                                className={`progress-bar ${isFullyFunded ? 'bg-success' : 'bg-primary'}`}
                                style={{ width: `${Math.min(fundingPercent, 100)}%` }}
                              >
                                ${project.currentFunding.toLocaleString()}
                              </div>
                            </div>
                            <div className="small text-muted mt-1">
                              Goal: ${project.goalAmount.toLocaleString()}
                            </div>
                          </div>

                          {/* Environment Impact */}
                          <div className="alert alert-success py-2 mb-3">
                            <small>
                              🌱 Saves <strong>{co2Data.annual} tons CO₂/year</strong>
                              <br />
                              <span className="text-muted">= {co2Data.treesEquivalent} trees planted</span>
                            </small>
                          </div>

                          {/* Investors */}
                          {project.investors && project.investors.length > 0 && (
                            <div className="mb-2">
                              <small className="text-muted">
                                👥 <strong>{project.investors.length}</strong> investor{project.investors.length !== 1 ? 's' : ''}
                              </small>
                            </div>
                          )}
                        </div>
                        
                        {/* Invest Button */}
                        <div className="card-footer bg-white border-top-0">
                          {isFullyFunded ? (
                            <button className="btn btn-success w-100" disabled>
                              ✓ Fully Funded!
                            </button>
                          ) : (
                            <button 
                              className="btn btn-primary w-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInvest(project);
                              }}
                              disabled={!investorName}
                            >
                              💵 Invest Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Project Detail Modal */}
      {viewingProject && (
        <div 
          className="modal d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setViewingProject(null)}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{viewingProject.projectName}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setViewingProject(null)}
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="text-primary">📍 Location</h6>
                <p>{viewingProject.address}, {viewingProject.location}</p>
                
                <h6 className="text-primary mt-3">💰 Financial Details</h6>
                <div className="row">
                  <div className="col-6">
                    <p className="mb-1"><strong>Funding Goal:</strong> ${viewingProject.goalAmount.toLocaleString()}</p>
                    <p className="mb-1"><strong>Current Funding:</strong> ${viewingProject.currentFunding.toLocaleString()}</p>
                    <p className="mb-1">
                      <strong>Remaining:</strong> ${(viewingProject.goalAmount - viewingProject.currentFunding).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="mb-1"><strong>Expected ROI:</strong> {viewingProject.roi}%/year</p>
                    <p className="mb-1"><strong>Monthly Savings:</strong> ${viewingProject.monthlySavings}</p>
                    <p className="mb-1"><strong>System Size:</strong> {viewingProject.systemSize} kW</p>
                  </div>
                </div>
                
                <h6 className="text-primary mt-3">⚡ System Specifications</h6>
                <p className="mb-1"><strong>Roof Size:</strong> {viewingProject.roofSize} sq ft</p>
                <p className="mb-1">
                  <strong>Annual Energy Production:</strong> ~{(viewingProject.systemSize * 1500).toLocaleString()} kWh
                </p>
                
                <h6 className="text-primary mt-3">🌍 Environmental Impact</h6>
                <p className="mb-1">
                  <strong>Annual CO₂ Reduction:</strong> {viewingProject.annualCO2Saved} tons
                </p>
                <p className="mb-1">
                  <strong>25-Year Impact:</strong> {(viewingProject.annualCO2Saved * 25).toFixed(0)} tons CO₂
                </p>
                <p className="mb-1">
                  <strong>Equivalent to:</strong> {Math.round(viewingProject.annualCO2Saved * 50)} trees planted
                </p>
                
                {viewingProject.investors && viewingProject.investors.length > 0 && (
                  <>
                    <h6 className="text-primary mt-3">👥 Investors ({viewingProject.investors.length})</h6>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingProject.investors.map((inv, idx) => (
                            <tr key={idx}>
                              <td>{inv.name}</td>
                              <td>${inv.amount.toLocaleString()}</td>
                              <td className="small text-muted">{inv.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setViewingProject(null)}
                >
                  Close
                </button>
                {viewingProject.currentFunding < viewingProject.goalAmount && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setViewingProject(null);
                      handleInvest(viewingProject);
                    }}
                    disabled={!investorName}
                  >
                    💵 Invest in This Project
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Modal */}
      {selectedProject && (
        <div 
          className="modal d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          onClick={cancelInvestment}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Invest in {selectedProject.projectName}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={cancelInvestment}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p>
                    <strong>Goal:</strong> ${selectedProject.goalAmount.toLocaleString()}<br />
                    <strong>Current Funding:</strong> ${selectedProject.currentFunding.toLocaleString()}<br />
                    <strong>Remaining:</strong> ${(selectedProject.goalAmount - selectedProject.currentFunding).toLocaleString()}<br />
                    <strong>Expected ROI:</strong> {selectedProject.roi}%/year
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Investment Amount ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    max={selectedProject.goalAmount - selectedProject.currentFunding}
                    autoFocus
                  />
                  
                  {investAmount > 0 && (
                    <div className="alert alert-info mt-3 mb-0">
                      <strong>📈 Your Projected Returns:</strong>
                      <ul className="mb-0 mt-2">
                        <li>
                          <strong>Annual:</strong> ${((investAmount * selectedProject.roi) / 100).toFixed(2)}
                        </li>
                        <li>
                          <strong>Monthly:</strong> ${(((investAmount * selectedProject.roi) / 100) / 12).toFixed(2)}
                        </li>
                        <li>
                          <strong>10-Year Total:</strong> ${((investAmount * selectedProject.roi) / 100 * 10).toFixed(0)}
                        </li>
                      </ul>
                      <small className="text-muted">
                        Based on {selectedProject.roi}% annual ROI
                      </small>
                    </div>
                  )}
                </div>

                <div className="alert alert-warning small">
                  ⚠️ <strong>Demo Mode:</strong> This is a simulation. No real money involved!
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={cancelInvestment}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-success btn-lg"
                  onClick={confirmInvestment}
                  disabled={!investAmount || investAmount <= 0}
                >
                  ✓ Confirm ${investAmount ? parseFloat(investAmount).toLocaleString() : '0'} Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}