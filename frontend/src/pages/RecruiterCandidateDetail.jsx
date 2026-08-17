import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import api from "../services/api";


const STATUS_OPTIONS = [
  {
    value: "under_review",
    label: "Under Review",
  },
  {
    value: "shortlisted",
    label: "Shortlist",
  },
  {
    value: "interview",
    label: "Interview",
  },
  {
    value: "selected",
    label: "Selected",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];


function RecruiterCandidateDetail() {

  const { logout } = useAuth();

  const { id } = useParams();


  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const loadApplication = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get(
        `/opportunities/recruiter/applications/${id}/`
      );

      setApplication(
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(
        error?.response?.data?.detail ||
        "Unable to load candidate application."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadApplication();

  }, [id]);


  const updateStatus = async (status) => {

    try {

      setUpdating(true);
      setError("");
      setSuccess("");


      const response = await api.patch(
        `/opportunities/recruiter/applications/${id}/`,
        {
          status,
        }
      );


      setApplication((previous) => ({
        ...previous,
        status:
          response.data.status,
        updated_at:
          new Date().toISOString(),
      }));


      setSuccess(
        `Application moved to ${
          response.data.status.replaceAll(
            "_",
            " "
          )
        }.`
      );

    } catch (error) {

      console.error(error);


      const responseData =
        error?.response?.data;


      if (
        responseData &&
        typeof responseData === "object"
      ) {

        const messages =
          Object.entries(
            responseData
          )
            .map(
              ([field, message]) => {

                const text =
                  Array.isArray(message)
                    ? message.join(" ")
                    : String(message);

                return `${field}: ${text}`;

              }
            )
            .join(" | ");


        setError(
          messages ||
          "Unable to update application status."
        );

      } else {

        setError(
          "Unable to update application status."
        );

      }

    } finally {

      setUpdating(false);

    }

  };


  if (loading) {

    return (
      <div className="dashboard-loading">
        Loading candidate...
      </div>
    );

  }


  if (error && !application) {

    return (

      <div className="recruiter-dashboard">

        <main className="recruiter-content">

          <div className="dashboard-error">
            {error}
          </div>


          <Link
            to="/recruiter/candidates"
            className="secondary-action"
          >
            ← Back to Candidates
          </Link>

        </main>

      </div>

    );

  }


  if (!application) {
    return null;
  }


  const student =
    application.student || {};

  const opportunity =
    application.opportunity || {};

  const currentStatus =
    application.status || "applied";


  return (

    <div className="recruiter-dashboard">


      {/* HEADER */}

      <header className="recruiter-header">


        <div>

          <span className="brand">
            SkillProof
          </span>


          <h1>
            Candidate Review
          </h1>


          <p>
            Review this student's application
            and evidence-backed opportunity match.
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
            to="/recruiter/candidates"
            className="recruiter-nav-link active"
          >
            Candidates
          </Link>


          <Link
            to="/recruiter/opportunities"
            className="recruiter-nav-link"
          >
            Opportunities
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


      <main className="recruiter-content">


        {/* BACK */}

        <div className="candidate-detail-back">

          <Link
            to="/recruiter/candidates"
            className="secondary-action"
          >
            ← Back to Candidates
          </Link>

        </div>


        {/* CANDIDATE HERO */}

        <section className="candidate-detail-hero">


          <div className="candidate-detail-identity">


            <div className="candidate-detail-avatar">

              {student.username
                ?.charAt(0)
                ?.toUpperCase() || "S"}

            </div>


            <div>

              <span className="section-label">
                CANDIDATE
              </span>


              <h1>
                {student.username ||
                  "Student"}
              </h1>


              <p>
                {student.email ||
                  "Email unavailable"}
              </p>

            </div>


          </div>


          <div className="candidate-detail-match">


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
              {application.match_level ||
                "Unknown"}
            </span>


          </div>


        </section>


        {/* APPLICATION STATUS */}

        <section className="recruiter-card">


          <div className="candidate-detail-section-header">


            <div>

              <span className="section-label">
                APPLICATION STATUS
              </span>


              <h2>
                Review decision
              </h2>


              <p>
                Move the candidate through
                your recruitment process.
              </p>

            </div>


            <span
              className={
                `application-status ` +
                `status-${currentStatus}`
              }
            >

              {currentStatus.replaceAll(
                "_",
                " "
              )}

            </span>


          </div>


          {error && (

            <div className="dashboard-error">
              {error}
            </div>

          )}


          {success && (

            <div className="create-success">
              {success}
            </div>

          )}


          <div className="candidate-status-actions">


            {STATUS_OPTIONS.map(
              (option) => (

                <button
                  key={option.value}
                  type="button"
                  disabled={
                    updating ||
                    currentStatus ===
                      option.value
                  }
                  className={
                    currentStatus ===
                    option.value
                      ? "status-action active"
                      : "status-action"
                  }
                  onClick={() =>
                    updateStatus(
                      option.value
                    )
                  }
                >

                  {updating
                    ? "Updating..."
                    : option.label}

                </button>

              )
            )}


          </div>


        </section>


        {/* OPPORTUNITY */}

        <section className="recruiter-card">


          <span className="section-label">
            OPPORTUNITY
          </span>


          <h2>
            {opportunity.title ||
              "Opportunity"}
          </h2>


          <p className="candidate-opportunity-company">
            {opportunity.organization ||
              "Organization unavailable"}
          </p>


          <div className="candidate-detail-meta">

            <span>
              Type:{" "}
              {opportunity.opportunity_type ||
                "Not specified"}
            </span>

          </div>


        </section>


        {/* MATCH SUMMARY */}

        <section className="recruiter-card">


          <div className="candidate-detail-section-header">


            <div>

              <span className="section-label">
                EXPLAINABLE MATCH
              </span>


              <h2>
                Why this candidate matches
              </h2>


              <p>
                The score is based on the
                opportunity requirements and
                the student's evidence-backed skills.
              </p>

            </div>


            <div className="candidate-detail-score">

              {application.match_score || 0}%

            </div>


          </div>


          <div className="candidate-match-grid">


            {/* MATCHED SKILLS */}

            <div className="candidate-detail-skill-box">


              <h3>
                Matched Skills
              </h3>


              {application.matched_skills?.length ? (

                <div className="candidate-detail-skill-list">


                  {application.matched_skills.map(
                    (skill) => (

                      <div
                        className="candidate-detail-skill matched"
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

                <p className="candidate-no-data">
                  No matched skills.
                </p>

              )}


            </div>


            {/* MISSING SKILLS */}

            <div className="candidate-detail-skill-box">


              <h3>
                Missing Skills
              </h3>


              {application.missing_skills?.length ? (

                <div className="candidate-detail-skill-list">


                  {application.missing_skills.map(
                    (skill) => (

                      <div
                        className="candidate-detail-skill missing"
                        key={
                          skill.skill_id
                        }
                      >

                        <div>

                          <strong>
                            ⚠ {skill.skill}
                          </strong>

                          <span>
                            {skill.required
                              ? "Required"
                              : "Preferred"}
                          </span>

                        </div>

                      </div>

                    )
                  )}


                </div>

              ) : (

                <p className="candidate-no-data">
                  No missing skills.
                </p>

              )}


            </div>


            {/* CONFIDENCE GAPS */}

            <div className="candidate-detail-skill-box">


              <h3>
                Confidence Gaps
              </h3>


              {application.confidence_gaps?.length ? (

                <div className="candidate-detail-skill-list">


                  {application.confidence_gaps.map(
                    (gap) => (

                      <div
                        className="candidate-detail-skill gap"
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

                <p className="candidate-no-data">
                  No confidence gaps.
                </p>

              )}


            </div>


          </div>


        </section>


        {/* COVER MESSAGE */}

        <section className="recruiter-card">


          <span className="section-label">
            CANDIDATE MESSAGE
          </span>


          <h2>
            Cover Message
          </h2>


          {application.cover_message ? (

            <div className="candidate-cover-message">

              <p>
                {application.cover_message}
              </p>

            </div>

          ) : (

            <div className="candidate-no-message">

              The candidate did not provide
              a cover message.

            </div>

          )}


        </section>


        {/* APPLICATION INFORMATION */}

        <section className="recruiter-card">


          <span className="section-label">
            APPLICATION INFORMATION
          </span>


          <div className="candidate-information-grid">


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

                {application.applied_at
                  ? new Date(
                      application.applied_at
                    ).toLocaleString()
                  : "Unavailable"}

              </strong>

            </div>


            <div>

              <span>
                Last Updated
              </span>


              <strong>

                {application.updated_at
                  ? new Date(
                      application.updated_at
                    ).toLocaleString()
                  : "Unavailable"}

              </strong>

            </div>


            <div>

              <span>
                Current Status
              </span>


              <strong>

                {currentStatus.replaceAll(
                  "_",
                  " "
                )}

              </strong>

            </div>


          </div>


        </section>


      </main>


    </div>

  );

}


export default RecruiterCandidateDetail;