import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getRecruiterDashboard } from "../services/recruiterService";
import AsyncState from "../components/AsyncState";


function RecruiterDashboard() {

  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    active_opportunities: 0,
    total_opportunities: 0,
    candidates: 0,
    shortlisted: 0,
    pending_review: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadDashboard = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getRecruiterDashboard();

      setStats({
        active_opportunities:
          Number(data?.active_opportunities || 0),
        total_opportunities:
          Number(data?.total_opportunities || 0),
        candidates:
          Number(data?.candidates || 0),
        shortlisted:
          Number(data?.shortlisted || 0),
        pending_review:
          Number(data?.pending_review || 0),
      });

    } catch (error) {

      console.error(
        "Unable to load recruiter dashboard:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load your recruiter dashboard. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);


  if (loading) {

    return (

      <div className="recruiter-dashboard">

        <main className="recruiter-content">

          <AsyncState
            loading
            loadingMessage="Loading your recruiter dashboard..."
          />

        </main>

      </div>

    );

  }


  if (error) {

    return (

      <div className="recruiter-dashboard">

        <main className="recruiter-content">

          <AsyncState
            error={error}
            onRetry={loadDashboard}
          />

        </main>

      </div>

    );

  }


  return (

    <div className="recruiter-dashboard">

      <header className="recruiter-header">

        <div>

          <span className="brand">
            SkillProof
          </span>

          <h1>
            Welcome,{" "}
            {user?.username || "Recruiter"}
          </h1>

          <p>
            Discover evidence-backed student
            talent and build your talent pipeline.
          </p>

        </div>


        <div className="recruiter-header-actions">

          <Link
            to="/recruiter/dashboard"
            className="recruiter-nav-link active"
          >
            Dashboard
          </Link>


          <Link
            to="/recruiter/opportunities"
            className="recruiter-nav-link"
          >
            Opportunities
          </Link>


          <Link
            to="/recruiter/candidates"
            className="recruiter-nav-link"
          >
            Candidates
          </Link>


          <Link
            to="/recruiter/opportunities/create"
            className="primary-action recruiter-header-create"
          >
            + Create
          </Link>


          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      <section className="recruiter-stats">

        <div className="recruiter-stat-card">

          <span>
            Active Opportunities
          </span>

          <strong>
            {stats.active_opportunities}
          </strong>

        </div>


        <div className="recruiter-stat-card">

          <span>
            Total Opportunities
          </span>

          <strong>
            {stats.total_opportunities}
          </strong>

        </div>


        <div className="recruiter-stat-card">

          <span>
            Shortlisted
          </span>

          <strong>
            {stats.shortlisted}
          </strong>

        </div>


        <div className="recruiter-stat-card">

          <span>
            Pending Review
          </span>

          <strong>
            {stats.pending_review}
          </strong>

        </div>

      </section>


      <section className="recruiter-content">

        <div className="recruiter-card">

          <div className="recruiter-card-header">

            <div>

              <span className="section-label">
                OPPORTUNITIES
              </span>

              <h2>
                Build your talent pipeline
              </h2>

              <p>
                Create opportunities and let
                SkillProof identify candidates
                using evidence-backed skills.
              </p>

            </div>


            <Link
              to="/recruiter/opportunities"
              className="primary-action"
            >
              Manage Opportunities
            </Link>

          </div>

        </div>


        <div className="recruiter-card">

          <div className="recruiter-card-header">

            <div>

              <span className="section-label">
                CANDIDATES
              </span>

              <h2>
                Evidence-backed candidates
              </h2>

              <p>
                Review candidates based on their
                demonstrated skills, evidence
                confidence and opportunity fit.
              </p>

            </div>


            <Link
              to="/recruiter/candidates"
              className="secondary-action"
            >
              View Candidates
            </Link>

          </div>

        </div>


        <section className="recruiter-principle">

          <div className="principle-icon">
            ✓
          </div>

          <div>

            <strong>
              Explainable recruitment
            </strong>

            <p>
              SkillProof helps recruiters understand
              why a candidate matches an opportunity
              instead of relying only on a ranking score.
            </p>

          </div>

        </section>

      </section>

    </div>

  );

}


export default RecruiterDashboard;