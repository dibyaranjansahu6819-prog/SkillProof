import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import api from "../services/api";


function RecruiterCandidates() {

  const { logout } = useAuth();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadApplications = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await api.get(
          "/opportunities/recruiter/applications/"
        );

        setApplications(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (error) {

        console.error(error);

        setError(
          error?.response?.data?.detail ||
          "Unable to load candidate applications."
        );

      } finally {

        setLoading(false);

      }

    };


    loadApplications();

  }, []);


  if (loading) {

    return (

      <div className="dashboard-loading">

        Loading candidates...

      </div>

    );

  }


  if (error) {

    return (

      <div className="recruiter-dashboard">

        <main className="recruiter-content">

          <div className="dashboard-error">

            {error}

          </div>


          <Link
            to="/recruiter/dashboard"
            className="secondary-action"
          >
            ← Back to Dashboard
          </Link>

        </main>

      </div>

    );

  }


  return (

    <div className="recruiter-dashboard">


      {/* =========================
          HEADER
      ========================== */}

      <header className="recruiter-header">


        <div>

          <span className="brand">
            SkillProof
          </span>


          <h1>
            Candidates
          </h1>


          <p>
            Review students who have applied
            to your opportunities.
          </p>

        </div>


        <div className="recruiter-header-actions">


          <Link
            to="/recruiter/dashboard"
            className="recruiter-nav-link"
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
            className="recruiter-nav-link active"
          >
            Candidates
          </Link>


        
          <button
            type="button"
            className="logout-button recruiter-header-logout"
            onClick={logout}
          >
            Logout
          </button>

</div>


      </header>


      {/* =========================
          CONTENT
      ========================== */}

      <main className="recruiter-content">


        <section className="recruiter-card">


          {/* CARD HEADER */}

          <div className="recruiter-card-header">


            <div>

              <span className="section-label">
                TALENT REVIEW
              </span>


              <h2>
                Candidate applications
              </h2>


              <p>
                Review evidence-backed matches
                before making a hiring decision.
              </p>

            </div>


            <div className="candidate-count">


              <strong>
                {applications.length}
              </strong>


              <span>
                {applications.length === 1
                  ? "Application"
                  : "Applications"}
              </span>


            </div>


          </div>


          {/* EMPTY STATE */}

          {applications.length === 0 ? (

            <div className="empty-state">


              <div className="empty-state-icon">
                👥
              </div>


              <h3>
                No applications yet
              </h3>


              <p>
                Candidate applications will
                appear here when students apply
                to your opportunities.
              </p>


              <Link
                to="/recruiter/opportunities"
                className="primary-action"
              >
                View Opportunities
              </Link>


            </div>

          ) : (


            /* =========================
               CANDIDATE LIST
            ========================== */

            <div className="candidate-list">


              {applications.map(
                (application) => {


                  const student =
                    application.student || {};


                  const opportunity =
                    application.opportunity || {};


                  const status =
                    application.status ||
                    "applied";


                  const matchScore =
                    Number(
                      application.match_score || 0
                    );


                  return (

                    <article
                      className="candidate-card"
                      key={application.id}
                    >


                      {/* =========================
                          TOP
                      ========================== */}

                      <div className="candidate-card-top">


                        <div className="candidate-identity">


                          <div className="candidate-avatar">

                            {student.username
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}

                          </div>


                          <div>


                            <h3>
                              {student.username ||
                                "Student"}
                            </h3>


                            <p>
                              {student.email ||
                                "Email unavailable"}
                            </p>


                          </div>


                        </div>


                        <span
                          className={
                            `application-status ` +
                            `status-${status}`
                          }
                        >

                          {status.replaceAll(
                            "_",
                            " "
                          )}

                        </span>


                      </div>


                      {/* =========================
                          OPPORTUNITY
                      ========================== */}

                      <div className="candidate-opportunity">


                        <span>
                          Applied for
                        </span>


                        <strong>
                          {opportunity.title ||
                            "Opportunity"}
                        </strong>


                        <p>
                          {opportunity.organization ||
                            "Organization unavailable"}
                        </p>


                      </div>


                      {/* =========================
                          MATCH SCORE
                      ========================== */}

                      <div className="candidate-match">


                        <div className="candidate-match-score">


                          <span>
                            Match Score
                          </span>


                          <strong>
                            {matchScore}%
                          </strong>


                        </div>


                        <span
                          className={
                            `match-level ` +
                            `match-${
                              application.match_level ||
                              "unknown"
                            }`
                          }
                        >

                          {application.match_level ||
                            "Not calculated"}

                        </span>


                      </div>


                      {/* =========================
                          SKILLS
                      ========================== */}

                      <div className="candidate-skills">


                        {/* MATCHED SKILLS */}

                        <div>


                          <span className="candidate-section-title">
                            Matched Skills
                          </span>


                          <div className="candidate-skill-tags">


                            {application.matched_skills
                              ?.slice(0, 5)
                              .map(
                                (skill) => (

                                  <span
                                    className="candidate-skill matched"
                                    key={
                                      skill.skill_id
                                    }
                                  >

                                    ✓{" "}
                                    {skill.skill}

                                  </span>

                                )
                              )}


                            {(
                              !application.matched_skills ||
                              application.matched_skills.length === 0
                            ) && (

                              <span className="candidate-no-data">

                                No matched skills

                              </span>

                            )}


                          </div>


                        </div>


                        {/* SKILL GAPS */}

                        <div>


                          <span className="candidate-section-title">
                            Skill Gaps
                          </span>


                          <div className="candidate-skill-tags">


                            {application.missing_skills
                              ?.slice(0, 4)
                              .map(
                                (skill) => (

                                  <span
                                    className="candidate-skill missing"
                                    key={
                                      skill.skill_id
                                    }
                                  >

                                    {skill.skill}

                                  </span>

                                )
                              )}


                            {application.confidence_gaps
                              ?.slice(0, 3)
                              .map(
                                (gap) => (

                                  <span
                                    className="candidate-skill gap"
                                    key={
                                      `gap-${gap.skill_id}`
                                    }
                                  >

                                    {gap.skill}

                                  </span>

                                )
                              )}


                            {(
                              (!application.missing_skills ||
                                application.missing_skills.length === 0) &&
                              (!application.confidence_gaps ||
                                application.confidence_gaps.length === 0)
                            ) && (

                              <span className="candidate-no-data">

                                No major skill gaps

                              </span>

                            )}


                          </div>


                        </div>


                      </div>


                      {/* =========================
                          COVER MESSAGE
                      ========================== */}

                      {application.cover_message && (

                        <div className="candidate-message">


                          <span>
                            Cover Message
                          </span>


                          <p>
                            {application.cover_message}
                          </p>


                        </div>

                      )}


                      {/* =========================
                          FOOTER
                      ========================== */}

                      <div className="candidate-card-footer">


                        <div className="candidate-applied-date">


                          <span>
                            Applied
                          </span>


                          <strong>

                            {application.applied_at
                              ? new Date(
                                  application.applied_at
                                ).toLocaleDateString(
                                  undefined,
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Recently"}

                          </strong>


                        </div>


                        <Link
                          to={
                            `/recruiter/candidates/` +
                            `${application.id}`
                          }
                          className="primary-action"
                        >

                          View Application

                        </Link>


                      </div>


                    </article>

                  );

                }
              )}


            </div>

          )}


        </section>


      </main>


    </div>

  );

}


export default RecruiterCandidates;