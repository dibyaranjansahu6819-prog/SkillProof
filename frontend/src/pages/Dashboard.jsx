import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyProfile,
  getMySkills,
  getMyEvidence,
  getMyProofGraph,
} from "../services/dashboardService";

import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";
import AsyncState from "../components/AsyncState";


function Dashboard() {
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [graph, setGraph] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =====================================================
     LOAD DASHBOARD
  ====================================================== */

  const loadDashboard = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const [
        profileData,
        skillsData,
        evidenceData,
        graphData,
      ] = await Promise.all([
        getMyProfile(),
        getMySkills(),
        getMyEvidence(),
        getMyProofGraph(),
      ]);

      setProfile(profileData);
      setSkills(skillsData || []);
      setEvidence(evidenceData || []);
      setGraph(graphData);

    } catch (error) {

      console.error(
        "Unable to load SkillProof dashboard:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load your SkillProof dashboard. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);


  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {

    return (

      <div className="dashboard-loading-screen">

        <AsyncState
          loading
          loadingMessage="Loading SkillProof..."
        />

      </div>

    );

  }


  /* =====================================================
     ERROR
  ====================================================== */

  if (error) {

    return (

      <div className="dashboard-error-screen">

        <div className="dashboard-error-card">

          <AsyncState
            error={error}
            onRetry={loadDashboard}
          />

        </div>

      </div>

    );

  }


  /* =====================================================
     CALCULATIONS
  ====================================================== */

  const verifiedEvidence =
    evidence.filter(
      (item) =>
        item.verification_status ===
        "verified"
    );


  const proofLinks =
    graph?.evidence?.reduce(
      (total, item) =>
        total +
        (item.skills?.length || 0),
      0
    ) || 0;


  const displayName =
    profile?.full_name ||
    profile?.username ||
    "Student";


  return (
    <div className="dashboard-modern">


      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <nav className="modern-navbar">


        {/* BRAND */}

        <Link
          to="/dashboard"
          className="modern-brand"
        >

          <span className="brand-shield">
            ✓
          </span>

          <span>
            SkillProof
          </span>

        </Link>


        {/* NAVIGATION LINKS */}

        <div className="modern-nav-links">


          <Link
            to="/dashboard"
          >
            Dashboard
          </Link>


          <Link
            to="/passport"
          >
            Skill Passport
          </Link>


          <Link
            to="/evidence"
          >
            Evidence Vault
          </Link>


          <Link
            to="/proof-graph"
          >
            Proof Graph
          </Link>


          <Link
            to="/opportunities"
            className="opportunity-nav-link"
          >

            Opportunities

            <span className="new-badge">
              NEW
            </span>

          </Link>


          <NotificationBell />

          <button
            type="button"
            className="modern-logout"
            onClick={logout}
          >

            <span>
              Logout
            </span>

            <span>
              →
            </span>

          </button>

        </div>

      </nav>


      {/* =================================================
          MAIN DASHBOARD
      ================================================= */}

      <main className="modern-dashboard-content">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="dashboard-hero">


          <div className="hero-content">


            <span className="welcome-pill">
              WELCOME BACK&nbsp; 👋
            </span>


            <h1>
              Welcome back,{" "}

              <span>
                {displayName}!
              </span>

            </h1>


            <p>
              Your evidence-backed skill passport.
            </p>


            <p className="hero-secondary">
              Build, prove and grow your skills
              with confidence.
            </p>


          </div>


          {/* HERO ILLUSTRATION */}

          <div className="hero-illustration">


            <div className="hero-card">


              <div className="hero-card-person">
                ●
              </div>


              <div
                className="
                  hero-card-line
                  large
                "
              />


              <div
                className="
                  hero-card-line
                  small
                "
              />


              <div className="hero-check">
                ✓
              </div>


            </div>


            <span className="hero-star star-one">
              ✦
            </span>


            <span className="hero-star star-two">
              ✦
            </span>


          </div>

        </section>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="modern-stats">


          {/* SKILLS */}

          <div
            className="
              modern-stat-card
              purple-stat
            "
          >

            <div className="stat-icon">
              ▣
            </div>


            <div className="stat-information">

              <span>
                Skills
              </span>


              <strong>
                {skills.length}
              </strong>


              <small>
                In your passport
              </small>

            </div>

          </div>


          {/* EVIDENCE */}

          <div
            className="
              modern-stat-card
              blue-stat
            "
          >

            <div className="stat-icon">
              ▱
            </div>


            <div className="stat-information">

              <span>
                Evidence
              </span>


              <strong>
                {evidence.length}
              </strong>


              <small>
                Supporting your skills
              </small>

            </div>

          </div>


          {/* VERIFIED */}

          <div
            className="
              modern-stat-card
              green-stat
            "
          >

            <div className="stat-icon">
              ✓
            </div>


            <div className="stat-information">

              <span>
                Verified
              </span>


              <strong>
                {verifiedEvidence.length}
              </strong>


              <small>
                Evidence verified
              </small>

            </div>

          </div>


          {/* PROOF LINKS */}

          <div
            className="
              modern-stat-card
              orange-stat
            "
          >

            <div className="stat-icon">
              ↗
            </div>


            <div className="stat-information">

              <span>
                Proof Links
              </span>


              <strong>
                {proofLinks}
              </strong>


              <small>
                Skill-evidence connections
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="quick-actions-modern">


          <div className="quick-actions-title">

            <span>
              QUICK ACTIONS
            </span>

          </div>


          <div className="quick-action-grid">


            {/* ADD EVIDENCE */}

            <Link
              to="/evidence"
              className="quick-action-modern"
            >

              <div
                className="
                  quick-icon
                  purple-icon
                "
              >
                +
              </div>


              <div>

                <strong>
                  Add Evidence
                </strong>


                <p>
                  Add a project, credential
                  or competition
                </p>

              </div>

            </Link>


            {/* OPPORTUNITIES */}

            <Link
              to="/opportunities"
              className="quick-action-modern"
            >

              <div
                className="
                  quick-icon
                  blue-icon
                "
              >
                ◎
              </div>


              <div>

                <strong>
                  Find Opportunities
                </strong>


                <p>
                  See explainable internship
                  matches
                </p>

              </div>

            </Link>


            {/* PROOF GRAPH */}

            <Link
              to="/proof-graph"
              className="quick-action-modern"
            >

              <div
                className="
                  quick-icon
                  green-icon
                "
              >
                ⌘
              </div>


              <div>

                <strong>
                  View Proof Graph
                </strong>


                <p>
                  Explore skills connected
                  to evidence
                </p>

              </div>

            </Link>


          </div>

        </section>


        {/* =================================================
            SKILLS + EVIDENCE
        ================================================= */}

        <section className="dashboard-two-column">


          {/* =================================================
              SKILLS CARD
          ================================================= */}

          <div
            className="
              modern-content-card
              skills-card
            "
          >


            <div className="modern-card-header">


              <div
                className="
                  card-heading-icon
                  purple-heading
                "
              >
                ◆
              </div>


              <div>

                <h2>
                  Your Skills
                </h2>


                <p>
                  Skills currently in your passport.
                </p>

              </div>


              <Link
                to="/passport"
                className="modern-card-link"
              >
                Manage →
              </Link>


            </div>


            {skills.length === 0 ? (


              <div className="modern-empty-state">


                <div
                  className="
                    empty-illustration
                    purple-empty
                  "
                >
                  ▤
                </div>


                <div>

                  <h3>
                    Your passport is empty
                  </h3>


                  <p>
                    Add your first skill to start
                    building your Skill Proof Graph.
                  </p>


                  <Link
                    to="/passport"
                    className="modern-primary-button"
                  >
                    + Add Your First Skill
                  </Link>

                </div>


              </div>


            ) : (


              <div className="modern-skill-list">


                {skills
                  .slice(0, 5)
                  .map((item) => (

                    <div
                      className="modern-skill-row"
                      key={item.id}
                    >

                      <div>

                        <strong>
                          {item.skill_name}
                        </strong>


                        <span>
                          {item.skill_category}
                        </span>

                      </div>


                      <span
                        className="
                          modern-proficiency
                        "
                      >
                        {item.proficiency}
                      </span>

                    </div>

                  ))}


                {skills.length > 5 && (

                  <Link
                    to="/passport"
                    className="view-more-link"
                  >
                    View all {skills.length}
                    {" "}skills →
                  </Link>

                )}

              </div>

            )}

          </div>


          {/* =================================================
              EVIDENCE CARD
          ================================================= */}

          <div
            className="
              modern-content-card
              evidence-card
            "
          >


            <div className="modern-card-header">


              <div
                className="
                  card-heading-icon
                  blue-heading
                "
              >
                ▱
              </div>


              <div>

                <h2>
                  Recent Evidence
                </h2>


                <p>
                  Proof supporting your skills.
                </p>

              </div>


              <Link
                to="/evidence"
                className="
                  modern-card-link
                  blue-link
                "
              >
                View All →
              </Link>


            </div>


            {evidence.length === 0 ? (


              <div className="modern-empty-state">


                <div
                  className="
                    empty-illustration
                    blue-empty
                  "
                >
                  ◇
                </div>


                <div>

                  <h3>
                    No evidence yet
                  </h3>


                  <p>
                    Add projects, coursework,
                    competitions or credentials.
                  </p>


                  <Link
                    to="/evidence"
                    className="modern-blue-button"
                  >
                    + Add Evidence
                  </Link>

                </div>


              </div>


            ) : (


              <div className="modern-evidence-list">


                {evidence
                  .slice(0, 5)
                  .map((item) => (

                    <div
                      className="
                        modern-evidence-row
                      "
                      key={item.id}
                    >

                      <div>

                        <strong>
                          {item.title}
                        </strong>


                        <span>
                          {item.evidence_type}
                        </span>

                      </div>


                      <span
                        className={
                          `modern-status ` +
                          item.verification_status
                        }
                      >
                        {item.verification_status}
                      </span>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            PROOF GRAPH
        ================================================= */}

        <section className="modern-graph-card">


          <div className="graph-card-content">


            <span className="section-label-modern">
              EVIDENCE GRAPH
            </span>


            <h2>
              Your Skill Proof Graph
            </h2>


            <p>
              Every skill in your passport is
              connected to the evidence that
              supports it.
            </p>


            <Link
              to="/proof-graph"
              className="graph-link-modern"
            >
              Open Full Graph →
            </Link>


          </div>


          {/* GRAPH */}

          <div className="graph-visual-modern">


            <div
              className="
                graph-modern-node
                you-node
              "
            >

              <span>
                ●
              </span>

              <strong>
                You
              </strong>

            </div>


            <div className="graph-modern-line" />


            <div
              className="
                graph-modern-node
                skills-node
              "
            >

              <strong>
                {skills.length}
              </strong>

              <span>
                Skills
              </span>

            </div>


            <div className="graph-modern-line" />


            <div
              className="
                graph-modern-node
                evidence-node-modern
              "
            >

              <strong>
                {evidence.length}
              </strong>

              <span>
                Evidence
              </span>

            </div>


          </div>


          {/* GRAPH DECORATION */}

          <div className="graph-background-dots">

            <span />
            <span />
            <span />
            <span />
            <span />

          </div>


          {/* GRAPH SUMMARY */}

          <div className="graph-bottom-summary">


            <div>

              <strong>
                {skills.length}
              </strong>

              <span>
                Skills
              </span>

            </div>


            <div>

              <strong>
                {evidence.length}
              </strong>

              <span>
                Evidence Items
              </span>

            </div>


            <div>

              <strong>
                {proofLinks}
              </strong>

              <span>
                Skill-Evidence Links
              </span>

            </div>


          </div>


        </section>


        {/* =================================================
            EXPLAINABLE MATCHING
        ================================================= */}

        <section className="matching-modern">


          <div className="matching-header">


            <div>

              <span className="section-label-modern">
                EXPLAINABLE MATCHING
              </span>


              <h2>
                Find opportunities that match
                your demonstrated skills.
              </h2>


              <p>
                SkillProof compares your
                evidence-backed skill confidence
                with internship requirements.
                Every recommendation explains why
                you match and what is missing.
              </p>

            </div>


            <Link
              to="/opportunities"
              className="modern-purple-button"
            >
              Explore Opportunities →
            </Link>


          </div>


          <div className="matching-steps">


            {/* STEP 1 */}

            <div
              className="
                matching-step-modern
              "
            >

              <div
                className="
                  step-icon
                  purple-step
                "
              >
                ◎
              </div>


              <span>
                01
              </span>


              <strong>
                Your Evidence
              </strong>


              <p>
                Projects, coursework
                and credentials
              </p>

            </div>


            <div className="step-arrow">
              →
            </div>


            {/* STEP 2 */}

            <div
              className="
                matching-step-modern
              "
            >

              <div
                className="
                  step-icon
                  blue-step
                "
              >
                ▥
              </div>


              <span>
                02
              </span>


              <strong>
                Skill Confidence
              </strong>


              <p>
                Evidence-backed
                capability
              </p>

            </div>


            <div className="step-arrow">
              →
            </div>


            {/* STEP 3 */}

            <div
              className="
                matching-step-modern
              "
            >

              <div
                className="
                  step-icon
                  green-step
                "
              >
                ✦
              </div>


              <span>
                03
              </span>


              <strong>
                Explainable Match
              </strong>


              <p>
                Match score, gaps
                and reasons
              </p>

            </div>


          </div>


          {/* CALLOUT */}

          <div className="opportunity-callout">


            <div className="callout-icon">
              ◆
            </div>


            <div>

              <strong>
                Your next opportunity is closer
                than you think.
              </strong>


              <p>
                Discover internships and roles
                that match your evidence-backed
                skills.
              </p>

            </div>


            <div className="callout-checks">

              <span>
                ✓ Evidence-first matching
              </span>

              <span>
                ✓ No irrelevant personal attributes
              </span>

              <span>
                ✓ Transparent and explainable
              </span>

            </div>


          </div>


        </section>


        {/* =================================================
            PROFILE COMPLETION
        ================================================= */}

        <section className="modern-completion">


          <div>


            <span className="section-label-modern">
              KEEP BUILDING
            </span>


            <h2>
              Build a stronger SkillProof profile.
            </h2>


            <p>
              The more relevant evidence you connect
              to your skills, the more explainable
              your future internship matches become.
            </p>


            <div className="completion-buttons">


              <Link
                to="/passport"
                className="modern-purple-button"
              >
                Complete Passport
              </Link>


              <Link
                to="/evidence"
                className="modern-outline-button"
              >
                Add Evidence
              </Link>


            </div>


          </div>


          <div className="completion-illustration">


            <div className="clipboard">

              <div>
                ✓
              </div>

              <div>
                ✓
              </div>

              <div>
                ✓
              </div>

            </div>


          </div>


        </section>


        {/* =================================================
            FAIRNESS NOTICE
        ================================================= */}

        <section className="modern-fairness">


          <div className="fairness-modern-icon">
            ✓
          </div>


          <div>

            <strong>
              Evidence-first matching
            </strong>


            <p>
              SkillProof recommendations are based
              on opportunity requirements and
              evidence-backed skills. Protected
              characteristics and irrelevant personal
              attributes are not used to rank matches.
            </p>

          </div>


          <div className="fairness-decoration">
            ⚖
          </div>


        </section>


      </main>

    </div>
  );
}


export default Dashboard;