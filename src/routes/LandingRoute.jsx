// src/routes/LandingRoute.jsx
import React from "react";
import { Link } from "react-router-dom";

function LandingRoute() {
  return (
    <div className="page-root">
      <div className="page-card">
        <header className="detail-header">
          <div className="detail-title-block">
            <h1 className="title-text">Shopping List App</h1>
            <p className="title-subtext">
              Vyber roli a prejdi na odpovidajici dashboard.
            </p>
          </div>
        </header>

        <section className="panel" style={{ textAlign: "center" }}>
          <h2>Kam pokracovat?</h2>
          <div className="dashboard-options-actions" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary" to="/owner_dashboard">
              Owner Dashboard
            </Link>
            <Link className="btn btn-ghost" to="/member_dashboard">
              Member Dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingRoute;
