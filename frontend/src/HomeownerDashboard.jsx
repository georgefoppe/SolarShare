import { useState } from 'react';
import { useProjects } from './ProjectContext.jsx';
import { calculateROI, calculateCO2Savings, estimateSystemSize } from './utils/solarCalculator.js';

export default function HomeownerDashboard() {
  const { projects, addProject } = useProjects();

  const [formData, setFormData] = useState({
    projectName: '',
    location: 'Chicago, IL',
    goalAmount: '',
    roofSize: '', // NEW
    address: ''   // NEW
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const systemSize = parseFloat(estimateSystemSize(formData.goalAmount));
    const roiData = calculateROI(formData.goalAmount, systemSize);
    const co2Data = calculateCO2Savings(systemSize);

    const newProject = {
      ...formData,
      systemSize,
      roi: roiData.roi,
      monthlySavings: roiData.monthlySavings,
      annualCO2Saved: co2Data.annual,
      submittedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    };

    addProject(newProject);

    // Reset form
    setFormData({
      projectName: '',
      location: 'Chicago, IL',
      goalAmount: '',
      roofSize: '',
      address: ''
    });

    alert('Project submitted successfully! Investors can now see it.');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Homeowner Dashboard</h2>

      {/* Form Section */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="card-title mb-4 text-primary">List Your Solar Project</h4>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="projectName" className="form-label fw-bold">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="e.g., My Rooftop Solar Array"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="address" className="form-label fw-bold">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g., 123 Main St"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="location" className="form-label fw-bold">
                      City, State *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="roofSize" className="form-label fw-bold">
                      Roof Size (sq ft) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="roofSize"
                      name="roofSize"
                      value={formData.roofSize}
                      onChange={handleChange}
                      placeholder="e.g., 1200"
                      min="400"
                      required
                    />
                    <small className="text-muted">Need at least 400 sq ft for solar</small>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="goalAmount" className="form-label fw-bold">
                    Funding Goal (USD) *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="goalAmount"
                      name="goalAmount"
                      value={formData.goalAmount}
                      onChange={handleChange}
                      placeholder="e.g., 15000"
                      min="5000"
                      max="50000"
                      required
                    />
                  </div>
                  <small className="text-muted">
                    Typical range: $10,000 - $30,000 depending on system size
                  </small>
                  
                  {/* Live calculator preview */}
                  {formData.goalAmount >= 5000 && (
                    <div className="alert alert-info mt-3">
                      <strong>📊 Estimated System:</strong>
                      <ul className="mb-0 mt-2">
                        <li>System Size: ~{estimateSystemSize(formData.goalAmount)} kW</li>
                        <li>Investor ROI: ~{calculateROI(formData.goalAmount, estimateSystemSize(formData.goalAmount)).roi}% annually</li>
                        <li>Monthly Savings: ~${calculateROI(formData.goalAmount, estimateSystemSize(formData.goalAmount)).monthlySavings}</li>
                      </ul>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                  🚀 Submit Project
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List Section */}
      <div className="mt-5">
        <h3 className="mb-4">Your Solar Projects ({projects.length})</h3>

        {projects.length === 0 ? (
          <div className="alert alert-info text-center">
            You haven't listed any projects yet. Use the form above to get started!
          </div>
        ) : (
          <div className="row g-4">
            {projects.map((project) => {
              const fundingPercent = (project.currentFunding / project.goalAmount) * 100;
              
              return (
                <div key={project.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title text-primary mb-0">{project.projectName}</h5>
                        {fundingPercent >= 100 && (
                          <span className="badge bg-success">Funded!</span>
                        )}
                      </div>
                      
                      <p className="text-muted small mb-3">{project.address}, {project.location}</p>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Funding Progress</span>
                          <span>{fundingPercent.toFixed(0)}%</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-success"
                            style={{ width: `${Math.min(fundingPercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="small">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Goal:</span>
                          <strong>${Number(project.goalAmount).toLocaleString()}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Raised:</span>
                          <strong className="text-success">
                            ${project.currentFunding.toLocaleString()}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">System:</span>
                          <strong>{project.systemSize} kW</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Investors:</span>
                          <strong>{project.investors?.length || 0}</strong>
                        </div>
                      </div>
                      
                      <hr />
                      
                      <p className="small text-muted mb-0">
                        Submitted: {project.submittedAt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}