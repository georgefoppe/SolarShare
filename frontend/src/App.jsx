import { Routes, Route, Link } from 'react-router-dom'
import Home from './Home.jsx'
import HomeownerDashboard from './HomeownerDashboard.jsx'
import InvestorDashboard from './InvestorDashboard.jsx'
import './App.css'

function App() {
  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">🐙 OctoSolar</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/homeowner">Homeowner Dashboard</Link>
              <Link className="nav-link" to="/investor">Investor Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <div className="min-vh-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/homeowner" element={<HomeownerDashboard />} />
          <Route path="/investor" element={<InvestorDashboard />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-light py-4 mt-5 border-top">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <h6 className="text-primary mb-2">🐙 OctoSolar</h6>
              <p className="text-muted small mb-0">
                Democratizing solar energy through community funding.<br />
                Built for Octopus Hackathon 2026
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="text-muted small mb-2">
                <strong>Contact:</strong> octopushackathon@gmail.com
              </p>
              <p className="text-muted small mb-0">
                Chicago Powered ☀️ | Made with ❤️
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App