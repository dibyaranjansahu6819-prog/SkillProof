import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

import AsyncState from "../components/AsyncState";


const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    className: "status-applied",
    step: 1,
  },

  under_review: {
    label: "Under Review",
    className: "status-under-review",
    step: 2,
  },

  shortlisted: {
    label: "Shortlisted",
    className: "status-shortlisted",
    step: 3,
  },

  interview: {
    label: "Interview",
    className: "status-interview",
    step: 4,
  },

  selected: {
    label: "Selected",
    className: "status-selected",
    step: 5,
  },

  rejected: {
    label: "Rejected",
    className: "status-rejected",
    step: 0,
  },
};


const STATUS_STEPS = [
  {
    value: "applied",
    label: "Applied",
  },

  {
    value: "under_review",
    label: "Under Review",
  },

  {
    value: "shortlisted",
    label: "Shortlisted",
  },

  {
    value: "interview",
    label: "Interview",
  },

  {
    value: "selected",
    label: "Selected",
  },
];


function MyApplications() {

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadApplications = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get(
        "/opportunities/my-applications/"
      );

      setApplications(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Unable to load student applications:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load your applications. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    loadApplications();

  }, [loadApplications]);


  const getStatusConfig = (status) => {

    return (
      STATUS_CONFIG[status] || {
        label:
          status?.replaceAll(
            "_",
            " "
          ) || "Unknown",

        className:
          "status-default",

        step: 0,
      }
    );

  };


  const formatDate = (date) => {

    if (!date) {
      return "Unavailable";
    }

    return new Date(
      date
    ).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  if (loading) {

    return (

      <div className="student-dashboard">

        <header className="student-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              My Applications
            </h1>

            <p>
              Track your applications and
              recruitment progress.
            </p>

          </div>

        </header>

        <main className="student-content">

          <AsyncState
            loading
            loadingMessage="Loading your applications..."
          />

        </main>

      </div>

    );

  }


  if (error) {

    return (

      <div className="student-dashboard">

        <header className="student-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              My Applications
            </h1>

            <p>
              Track your applications and
              recruitment progress.
            </p>

          </div>

          <div className="student-header-actions">

            <Link
              to="/student/dashboard"
              className="student-nav-link"
            >
              Dashboard
            </Link>

            <Link
              to="/opportunities"
              className="student-nav-link"
            >
              Opportunities
            </Link>

            <Link
              to="/student/applications"
              className="student-nav-link active"
            >
              My Applications
            </Link>

          </div>

        </header>

        <main className="student-content">

          <AsyncState
            error={error}
            onRetry={loadApplications}
          />

          <div className="student-application-back">

            <Link
              to="/student/dashboard"
              className="secondary-action"
            >
              ← Back to Dashboard
            </Link>

          </div>

        </main>

      </div>

    );

  }


  return (

    <div className="student-dashboard">


      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="student-header">


        <div>

          <span className="brand">
            SkillProof
          </span>


          <h1>
            My Applications
          </h1>


          <p>
            Track your applications and
            recruitment progress.
          </p>

        </div>


        <div className="student-header-actions">


          <Link
            to="/student/dashboard"
            className="student-nav-link"
          >
            Dashboard
          </Link>


          <Link
            to="/opportunities"
            className="student-nav-link"
          >
            Opportunities
          </Link>


          <Link
            to="/student/applications"
            className="student-nav-link active"
          >
            My Applications
          </Link>


        </div>


      </header>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="student-content">


        {/* ==================================================
            SUMMARY
        ================================================== */}

        <section className="applications-summary">


          <div className="applications-summary-item">

            <span>
              Total Applications
            </span>


            <strong>
              {applications.length}
            </strong>

          </div>


          <div className="applications-summary-item">

            <span>
              Under Review
            </span>


            <strong>

              {
                applications.filter(
                  (application) =>
                    application.status ===
                    "under_review"
                ).length
              }

            </strong>

          </div>


          <div className="applications-summary-item">

            <span>
              Shortlisted
            </span>


            <strong>

              {
                applications.filter(
                  (application) =>
                    application.status ===
                    "shortlisted"
                ).length
              }

            </strong>

          </div>


          <div className="applications-summary-item">

            <span>
              Selected
            </span>


            <strong>

              {
                applications.filter(
                  (application) =>
                    application.status ===
                    "selected"
                ).length
              }

            </strong>

          </div>


        </section>


        {/* ==================================================
            APPLICATION TRACKER
        ================================================== */}

        <section className="student-card">


          <div className="student-card-header">


            <div>

              <span className="section-label">
                APPLICATION TRACKER
              </span>


              <h2>
                Your applications
              </h2>


              <p>
                Follow the progress of every
                opportunity you have applied for.
              </p>

            </div>


          </div>


          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {applications.length === 0 ? (

            <AsyncState
              empty
              emptyTitle="No applications yet"
              emptyMessage={
                "Explore opportunities and apply to roles " +
                "that match your skills."
              }
            />

          ) : (


            /* ==================================================
               APPLICATION LIST
            ================================================== */

            <div className="student-application-list">


              {applications.map(
                (application) => {


                  const opportunity =
                    application.opportunity ||
                    {};


                  const status =
                    getStatusConfig(
                      application.status
                    );


                  const isRejected =
                    application.status ===
                    "rejected";


                  return (

                    <article
                      className="student-application-card"
                      key={application.id}
                    >


                      {/* ==================================================
                          TOP
                      ================================================== */}

                      <div className="student-application-top">


                        <div>


                          <span className="section-label">

                            {
                              opportunity
                                .opportunity_type ||
                              "OPPORTUNITY"
                            }

                          </span>


                          <h3>

                            {
                              opportunity.title ||
                              "Opportunity"
                            }

                          </h3>


                          <p className="application-organization">

                            {
                              opportunity.organization ||
                              "Organization unavailable"
                            }

                          </p>


                        </div>


                        <span
                          className={
                            `application-status ` +
                            status.className
                          }
                        >

                          {status.label}

                        </span>


                      </div>


                      {/* ==================================================
                          APPLICATION DETAILS
                      ================================================== */}

                      <div className="student-application-details">


                        <div>

                          <span>
                            Match Score
                          </span>


                          <strong>

                            {
                              application.match_score ??
                              0
                            }%

                          </strong>

                        </div>


                        <div>

                          <span>
                            Match Level
                          </span>


                          <strong>

                            {
                              application.match_level ||
                              "Not calculated"
                            }

                          </strong>

                        </div>


                        <div>

                          <span>
                            Applied
                          </span>


                          <strong>

                            {
                              formatDate(
                                application.applied_at
                              )
                            }

                          </strong>

                        </div>


                        <div>

                          <span>
                            Location
                          </span>


                          <strong>

                            {opportunity.remote
                              ? "Remote"
                              : opportunity.location ||
                                "Not specified"}

                          </strong>

                        </div>


                      </div>


                      {/* ==================================================
                          STATUS TIMELINE
                      ================================================== */}

                      <div className="application-timeline">


                        <div className="timeline-line" />


                        {STATUS_STEPS.map(
                          (step) => {


                            const stepConfig =
                              getStatusConfig(
                                step.value
                              );


                            const isCompleted =
                              !isRejected &&
                              status.step >=
                                stepConfig.step;


                            const isCurrent =
                              !isRejected &&
                              application.status ===
                                step.value;


                            return (

                              <div
                                className={
                                  "timeline-step " +
                                  (
                                    isCompleted
                                      ? "completed "
                                      : ""
                                  ) +
                                  (
                                    isCurrent
                                      ? "current"
                                      : ""
                                  )
                                }
                                key={
                                  step.value
                                }
                              >


                                <div className="timeline-dot">

                                  {isCompleted
                                    ? "✓"
                                    : ""}

                                </div>


                                <span>
                                  {step.label}
                                </span>


                              </div>

                            );

                          }
                        )}


                      </div>


                      {/* ==================================================
                          REJECTED MESSAGE
                      ================================================== */}

                      {isRejected && (

                        <div className="application-rejected-message">


                          <strong>
                            Application not selected
                          </strong>


                          <span>
                            This application has been
                            marked as rejected.
                          </span>


                        </div>

                      )}


                      {/* ==================================================
                          SKILL SUMMARY
                      ================================================== */}

                      <div className="application-skill-summary">


                        {/* MATCHED SKILLS */}

                        <div>


                          <span className="candidate-section-title">
                            Matched Skills
                          </span>


                          <div className="candidate-skill-tags">


                            {application.matched_skills
                              ?.slice(0, 4)
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
                              application.matched_skills.length ===
                                0
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
                              ?.slice(0, 3)
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
                              ?.slice(0, 2)
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
                              (
                                !application.missing_skills ||
                                application.missing_skills.length ===
                                  0
                              ) &&
                              (
                                !application.confidence_gaps ||
                                application.confidence_gaps.length ===
                                  0
                              )
                            ) && (

                              <span className="candidate-no-data">

                                No major skill gaps

                              </span>

                            )}


                          </div>


                        </div>


                      </div>


                      {/* ==================================================
                          FOOTER ACTIONS
                      ================================================== */}

                      <div className="student-application-footer">


                        <div className="student-application-footer-actions">


                          <Link
                            to={
                              `/student/applications/` +
                              `${application.id}`
                            }
                            className="primary-action"
                          >

                            Track Application

                          </Link>


                          <Link
                            to={
                              `/opportunities/` +
                              `${opportunity.id}`
                            }
                            className="secondary-action"
                          >

                            View Opportunity

                          </Link>


                        </div>


                        <span>

                          Application #
                          {application.id}

                        </span>


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


export default MyApplications;