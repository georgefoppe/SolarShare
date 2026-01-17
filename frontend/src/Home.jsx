import { Link } from 'react-router-dom';
import { useProjects } from './ProjectContext.jsx';
import { loadDemoData } from './utils/demoData.js';

export default function Home() {
  const { projects, addProject } = useProjects();
  
  const totalFunding = projects.reduce((sum, p) => sum + p.currentFunding, 0);
  const totalGoal = projects.reduce((sum, p) => sum + p.goalAmount, 0);
  const fullyFunded = projects.filter(p => p.currentFunding >= p.goalAmount).length;
  
  // Calculate unique investors across all projects
  const allInvestorNames = new Set();
  projects.forEach(p => {
    p.investors?.forEach(inv => allInvestorNames.add(inv.name));
  });
  const totalInvestors = allInvestorNames.size;
  
  const totalCO2Saved = projects.reduce((sum, p) => sum + parseFloat(p.annualCO2Saved || 0), 0);

  const handleLoadDemo = () => {
    if (projects.length > 0) {
      if (!window.confirm('This will add 3 demo projects. Continue?')) {
        return;
      }
    }
    loadDemoData(addProject);
    alert('✅ Demo data loaded! Check out the Investor Dashboard to see the projects.');
  };

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-3 fw-bold mb-3">
          🐙 Welcome to <span className="text-primary">OctoSolar</span>
        </h1>
        <p className="lead text-muted mb-4">
          Democratizing solar energy in Chicago and beyond!<br />
          <strong>Homeowners</strong> get affordable solar • <strong>Investors</strong> get sustainable returns
        </p>
        
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/homeowner" className="btn btn-primary btn-lg px-4">
            🏠 List Your Roof
          </Link>
          <Link to="/investor" className="btn btn-outline-primary btn-lg px-4">
            💰 Browse Projects
          </Link>
        </div>
      </div>

      {/* Demo Data Button */}
      {projects.length === 0 && (
        <div className="alert alert-info text-center mb-5">
          <strong>👋 First time here?</strong> Try out the platform with sample data!
          <br />
          <button className="btn btn-primary mt-2" onClick={handleLoadDemo}>
            Load Demo Projects
          </button>
        </div>
      )}

      {projects.length > 0 && projects.length < 5 && (
        <div className="text-center mb-4">
          <button className="btn btn-sm btn-outline-secondary" onClick={handleLoadDemo}>
            + Add More Demo Projects
          </button>
        </div>
      )}

      {/* Live Stats */}
      <div className="row text-center mb-5 g-4">
        <div className="col-6 col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="display-6 text-primary mb-2">{projects.length}</div>
              <p className="text-muted mb-0 small">Solar Projects</p>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="display-6 text-success mb-2">
                ${totalFunding.toLocaleString()}
              </div>
              <p className="text-muted mb-0 small">Total Invested</p>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="display-6 text-info mb-2">{totalInvestors}</div>
              <p className="text-muted mb-0 small">Active Investors</p>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="display-6 text-warning mb-2">
                {totalCO2Saved.toFixed(1)}t
              </div>
              <p className="text-muted mb-0 small">CO₂ Saved/Year</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-5">
        <h2 className="text-center mb-4">How It Works</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="display-1 mb-3">1️⃣</div>
              <h5 className="mb-3">Homeowners List Projects</h5>
              <p className="text-muted">
                Submit your roof details and funding goal. We calculate solar potential and expected returns.
              </p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="display-1 mb-3">2️⃣</div>
              <h5 className="mb-3">Community Funding</h5>
              <p className="text-muted">
                Investors browse projects and contribute any amount. Progress is tracked transparently.
              </p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="display-1 mb-3">3️⃣</div>
              <h5 className="mb-3">Everyone Wins!</h5>
              <p className="text-muted">
                Energy savings are shared. Investors earn 8-9% returns, homeowners save money, planet gets cleaner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="row mb-5">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow border-primary">
            <div className="card-body p-4">
              <h4 className="card-title text-primary mb-3">🏠 For Homeowners</h4>
              <ul className="list-unstyled">
                <li className="mb-2">✓ <strong>$0 upfront cost</strong> - Get solar panels installed for free</li>
                <li className="mb-2">✓ <strong>Immediate savings</strong> - Reduce electricity bills from day 1</li>
                <li className="mb-2">✓ <strong>Own the panels</strong> - After funding period, they're yours</li>
                <li className="mb-2">✓ <strong>Increase home value</strong> - Solar homes sell for 4% more</li>
                <li className="mb-2">✓ <strong>Help the planet</strong> - Reduce your carbon footprint</li>
              </ul>
              <Link to="/homeowner" className="btn btn-primary w-100 mt-3">
                Get Started →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow border-success">
            <div className="card-body p-4">
              <h4 className="card-title text-success mb-3">💰 For Investors</h4>
              <ul className="list-unstyled">
                <li className="mb-2">✓ <strong>8-9% annual returns</strong> - Better than savings accounts</li>
                <li className="mb-2">✓ <strong>Start with any amount</strong> - As low as $50</li>
                <li className="mb-2">✓ <strong>Low risk</strong> - Solar panels last 25+ years</li>
                <li className="mb-2">✓ <strong>Diversify easily</strong> - Spread investments across projects</li>
                <li className="mb-2">✓ <strong>Measurable impact</strong> - See exactly how you're helping</li>
              </ul>
              <Link to="/investor" className="btn btn-success w-100 mt-3">
                Browse Projects →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-4">
            {projects.length <= 3 ? 'All Projects' : 'Recent Projects'}
          </h3>
          <div className="row g-3">
            {projects.slice(-3).reverse().map(project => {
              const fundingPercent = (project.currentFunding / project.goalAmount) * 100;
              
              return (
                <div key={project.id} className="col-md-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h6 className="card-title text-truncate" title={project.projectName}>
                        {project.projectName}
                      </h6>
                      <p className="small text-muted mb-2">
                        📍 {project.location}
                      </p>
                      
                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-muted">Goal: ${project.goalAmount.toLocaleString()}</span>
                        <span className="fw-bold text-success">
                          ${project.currentFunding.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="progress mb-2" style={{ height: '8px' }}>
                        <div 
                          className={`progress-bar ${fundingPercent >= 100 ? 'bg-success' : 'bg-primary'}`}
                          style={{ width: `${Math.min(fundingPercent, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {fundingPercent.toFixed(0)}% funded
                        </small>
                        <Link to="/investor" className="btn btn-sm btn-outline-primary">
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {projects.length > 3 && (
            <div className="text-center mt-3">
              <Link to="/investor" className="btn btn-outline-primary">
                View All {projects.length} Projects →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Impact Showcase */}
      {totalFunding > 0 && (
        <div className="mb-5">
          <div className="card bg-light border-0">
            <div className="card-body p-4 text-center">
              <h4 className="mb-3">🌍 Our Collective Impact</h4>
              <div className="row">
                <div className="col-md-4">
                  <div className="display-6 text-success mb-2">
                    ${totalFunding.toLocaleString()}
                  </div>
                  <p className="text-muted mb-0">Invested in Clean Energy</p>
                </div>
                <div className="col-md-4">
                  <div className="display-6 text-primary mb-2">
                    {totalCO2Saved.toFixed(1)} tons
                  </div>
                  <p className="text-muted mb-0">CO₂ Reduced Annually</p>
                </div>
                <div className="col-md-4">
                  <div className="display-6 text-warning mb-2">
                    {Math.round(totalCO2Saved * 50)}
                  </div>
                  <p className="text-muted mb-0">Trees Equivalent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center bg-primary text-white p-5 rounded shadow-lg">
        <h3 className="mb-3">Ready to make an impact?</h3>
        <p className="mb-4 opacity-75">
          Join the clean energy revolution today. Whether you're a homeowner or investor,<br />
          there's a place for you in the OctoSolar community.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/homeowner" className="btn btn-light btn-lg px-4">
            🏠 List Your Project
          </Link>
          <Link to="/investor" className="btn btn-outline-light btn-lg px-4">
            💰 Start Investing
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-top">
        <div className="row text-center text-md-start">
          <div className="col-md-6 mb-3">
            <h6 className="text-primary">About OctoSolar</h6>
            <p className="small text-muted">
              Built for Octopus Hackathon 2026. A marketplace connecting homeowners 
              who want solar panels with investors seeking sustainable returns.
            </p>
          </div>
          <div className="col-md-6 mb-3">
            <h6 className="text-primary">Quick Stats</h6>
            <p className="small text-muted mb-1">
              • Average ROI: 8-9% annually<br />
              • Typical system size: 5-7 kW<br />
              • Investment range: $50 - $10,000<br />
              • Solar panel lifespan: 25+ years
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}