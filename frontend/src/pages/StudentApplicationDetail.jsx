import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";

import AsyncState from "../components/AsyncState";


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


const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    step: 1,
    className: "status-applied",
  },

  under_review: {
    label: "Under Review",
    step: 2,
    className: "status-under-review",
  },

  shortlisted: {
    label: "Shortlisted",
    step: 3,
    className: "status-shortlisted",
  },

  interview: {
    label: "Interview",
    step: 4,
    className: "status-interview",
  },

  selected: {
    label: "Selected",
    step: 5,
    className: "status-selected",
  },

  rejected: {
    label: "Rejected",
    step: 0,
    className: "status-rejected",
  },
};


function StudentApplicationDetail() {

  const { id } = useParams();


  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadApplication = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get(
        `/opportunities/my-applications/${id}/`
      );

      setApplication(response.data);

    } catch (error) {

      console.error(
        "Unable to load application:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load this application. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, [id]);


  useEffect(() => {

    loadApplication();

  }, [loadApplication]);


  const getStatusConfig = (status) => {

    return (
      STATUS_CONFIG[status] || {
        label:
          status?.replaceAll(
            "_",
            " "
          ) || "Unknown",

        step: 0,

        className: "status-default",
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


  const formatDateTime = (date) => {

    if (!date) {
      return "Unavailable";
    }

    return new Date(
      date
    ).toLocaleString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
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
              Application Details
            </h1>

            <p>
              Loading your application progress
              and opportunity match.
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
            loading
            loadingMessage="Loading application..."
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
              Application Details
            </h1>

            <p>
              We couldn't load this application.
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
            onRetry={loadApplication}
          />

          <div className="student-application-back">

            <Link
              to="/student/applications"
              className="secondary-action"
            >
              ← Back to Applications
            </Link>

          </div>

        </main>

      </div>

    );

  }


  if (!application) {

    return (

      <div className="student-dashboard">

        <main className="student-content">

          <AsyncState
            empty
            emptyTitle="Application not found"
            emptyMessage={
              "This application could not be found or is no longer available."
            }
          />

          <div className="student-application-back">

            <Link
              to="/student/applications"
              className="secondary-action"
            >
              ← Back to Applications
            </Link>

          </div>

        </main>

      </div>

    );

  }


  const opportunity =
    application.opportunity || {};


  const status =
    getStatusConfig(
      application.status
    );


  const isRejected =
    application.status ===
    "rejected";


  return (

    <div className="student-dashboard">


      {/* =========================
          HEADER
      ========================== */}

      <header className="student-header">


        <div>

          <span className="brand">
            SkillProof
          </span>


          <h1>
            Application Details
          </h1>


          <p>
            Track your application progress
            and opportunity match.
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


        {/* BACK */}

        <div className="student-application-back">

          <Link
            to="/student/applications"
            className="secondary-action"
          >
            ← Back to Applications
          </Link>

        </div>


        {/* APPLICATION HERO */}

        <section className="student-application-detail-hero">


          <div>


            <span className="section-label">
              {
                opportunity.opportunity_type ||
                "OPPORTUNITY"
              }
            </span>


            <h1>
              {
                opportunity.title ||
                "Opportunity"
              }
            </h1>


            <p className="student-detail-organization">

              {
                opportunity.organization ||
                "Organization unavailable"
              }

            </p>


            <div className="student-detail-location">

              <span>
                📍{" "}

                {opportunity.remote
                  ? "Remote"
                  : opportunity.location ||
                    "Location not specified"}

              </span>


              {opportunity.deadline && (

                <span>
                  Deadline:{" "}
                  {formatDate(
                    opportunity.deadline
                  )}
                </span>

              )}

            </div>


          </div>


          <div className="student-detail-match">


            <span>
              Match Score
            </span>


            <strong>
              {application.match_score || 0}%
            </strong>


            <span
              className={
                `match-level ` +
                `match-${
                  application.match_level ||
                  "unknown"
                }`
              }
            >

              {
                application.match_level ||
                "Unknown"
              }

            </span>


          </div>


        </section>


        {/* STATUS */}

        <section className="student-card">


          <div className="student-card-header">


            <div>

              <span className="section-label">
                APPLICATION STATUS
              </span>


              <h2>
                Recruitment progress
              </h2>


              <p>
                Follow the progress of your
                application.
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


          {isRejected ? (

            <div className="student-rejected-state">

              <div className="student-rejected-icon">
                ×
              </div>


              <div>

                <strong>
                  Application not selected
                </strong>


                <p>
                  This application has been
                  marked as rejected.
                </p>

              </div>

            </div>

          ) : (

            <div className="student-detail-timeline">


              <div className="student-detail-timeline-line" />


              {STATUS_STEPS.map(
                (step) => {

                  const stepConfig =
                    getStatusConfig(
                      step.value
                    );


                  const completed =
                    status.step >=
                    stepConfig.step;


                  const current =
                    application.status ===
                    step.value;


                  return (

                    <div
                      className={
                        "student-detail-timeline-step " +
                        (completed
                          ? "completed "
                          : "") +
                        (current
                          ? "current"
                          : "")
                      }
                      key={step.value}
                    >


                      <div className="student-detail-timeline-dot">

                        {completed
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

          )}


          <div className="student-application-update">


            <span>
              Last updated
            </span>


            <strong>
              {
                formatDateTime(
                  application.updated_at
                )
              }
            </strong>


          </div>


        </section>


        {/* OPPORTUNITY DESCRIPTION */}

        <section className="student-card">


          <span className="section-label">
            OPPORTUNITY
          </span>


          <h2>
            About this opportunity
          </h2>


          <p className="student-opportunity-description">

            {
              opportunity.description ||
              "No description available."
            }

          </p>


          {opportunity.application_url && (

            <a
              href={
                opportunity.application_url
              }
              target="_blank"
              rel="noreferrer"
              className="primary-action"
            >
              Open Application Link
            </a>

          )}


        </section>


        {/* MATCH DETAILS */}

        <section className="student-card">


          <div className="student-card-header">


            <div>

              <span className="section-label">
                EXPLAINABLE MATCH
              </span>


              <h2>
                Your opportunity match
              </h2>


              <p>
                See what contributed to your
                match score.
              </p>

            </div>


            <div className="student-detail-score">

              {application.match_score || 0}%

            </div>


          </div>


          <div className="student-detail-match-grid">


            {/* MATCHED */}

            <div className="student-detail-skill-box">


              <h3>
                Matched Skills
              </h3>


              {application.matched_skills?.length ? (

                <div className="student-detail-skill-list">


                  {application.matched_skills.map(
                    (skill) => (

                      <div
                        className="student-detail-skill matched"
                        key={
                          skill.skill_id
                        }
                      >

                        <div>

                          <strong>
                            ✓ {skill.skill}
                          </strong>


                          <span>
                            Evidence:{" "}
                            {skill.evidence_count}
                          </span>

                        </div>


                        <strong>
                          {skill.confidence}%
                        </strong>

                      </div>

                    )
                  )}


                </div>

              ) : (

                <p className="student-detail-no-data">
                  No matched skills found.
                </p>

              )}


            </div>


            {/* MISSING */}

            <div className="student-detail-skill-box">


              <h3>
                Missing Skills
              </h3>


              {application.missing_skills?.length ? (

                <div className="student-detail-skill-list">


                  {application.missing_skills.map(
                    (skill) => (

                      <div
                        className="student-detail-skill missing"
                        key={
                          skill.skill_id
                        }
                      >

                        <div>

                          <strong>
                            ⚠ {skill.skill}
                          </strong>


                          <span>
                            {
                              skill.required
                                ? "Required"
                                : "Preferred"
                            }
                          </span>

                        </div>

                      </div>

                    )
                  )}


                </div>

              ) : (

                <p className="student-detail-no-data">
                  No missing skills.
                </p>

              )}


            </div>


            {/* CONFIDENCE */}

            <div className="student-detail-skill-box">


              <h3>
                Confidence Gaps
              </h3>


              {application.confidence_gaps?.length ? (

                <div className="student-detail-skill-list">


                  {application.confidence_gaps.map(
                    (gap) => (

                      <div
                        className="student-detail-skill gap"
                        key={
                          gap.skill_id
                        }
                      >

                        <div>

                          <strong>
                            {gap.skill}
                          </strong>


                          <span>
                            Current:{" "}
                            {gap.confidence}%
                          </span>

                        </div>


                        <strong>
                          Target:{" "}
                          {gap.required_confidence}%
                        </strong>

                      </div>

                    )
                  )}


                </div>

              ) : (

                <p className="student-detail-no-data">
                  No confidence gaps.
                </p>

              )}


            </div>


          </div>


        </section>


        {/* COVER MESSAGE */}

        <section className="student-card">


          <span className="section-label">
            YOUR APPLICATION
          </span>


          <h2>
            Cover Message
          </h2>


          {application.cover_message ? (

            <div className="student-cover-message">

              <p>
                {application.cover_message}
              </p>

            </div>

          ) : (

            <div className="student-no-message">

              No cover message was submitted
              with this application.

            </div>

          )}


        </section>


        {/* APPLICATION INFORMATION */}

        <section className="student-card">


          <span className="section-label">
            APPLICATION INFORMATION
          </span>


          <div className="student-application-info-grid">


            <div>

              <span>
                Application ID
              </span>


              <strong>
                #{application.id}
              </strong>

            </div>


            <div>

              <span>
                Applied
              </span>


              <strong>
                {
                  formatDateTime(
                    application.applied_at
                  )
                }
              </strong>

            </div>


            <div>

              <span>
                Status
              </span>


              <strong>
                {status.label}
              </strong>

            </div>


            <div>

              <span>
                Match
              </span>


              <strong>
                {application.match_score || 0}%
              </strong>

            </div>


          </div>


        </section>


      </main>


    </div>

  );

}


export default StudentApplicationDetail;