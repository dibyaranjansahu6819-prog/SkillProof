import { useCallback, useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getOpportunityMatch,
  getOpportunityRoadmap,
  applyToOpportunity,
} from "../services/opportunityService";

import AsyncState from "../components/AsyncState";


function OpportunityDetail() {

  const { id } = useParams();


  const [data, setData] =
    useState(null);


  const [roadmap, setRoadmap] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [coverMessage, setCoverMessage] =
    useState("");


  const [applicationLoading, setApplicationLoading] =
    useState(false);


  const [applicationError, setApplicationError] =
    useState("");


  const [applicationSuccess, setApplicationSuccess] =
    useState(false);


  const [applicationStatus, setApplicationStatus] =
    useState("");


  /*
   * Load opportunity match + roadmap
   */

  const loadData = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const [
        matchData,
        roadmapData,
      ] = await Promise.all([

        getOpportunityMatch(id),

        getOpportunityRoadmap(id),

      ]);

      setData(matchData);
      setRoadmap(roadmapData);

    } catch (error) {

      console.error(
        "Unable to load opportunity detail:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load the opportunity. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, [id]);


  useEffect(() => {

    loadData();

  }, [loadData]);


  /*
   * Submit application
   */
  const handleApply = async (event) => {

    event.preventDefault();


    setApplicationError("");
    setApplicationSuccess(false);


    try {

      setApplicationLoading(true);


      const response =
        await applyToOpportunity(
          id,
          {
            cover_message:
              coverMessage.trim(),
          }
        );


      setApplicationSuccess(true);


      setApplicationStatus(
        response?.status || "applied"
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


        setApplicationError(
          messages ||
          "Unable to submit application."
        );


      } else {

        setApplicationError(
          "Unable to submit application."
        );

      }

    } finally {

      setApplicationLoading(false);

    }

  };


  if (loading) {

    return (

      <div className="opportunity-detail-page">

        <header className="opportunity-detail-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Opportunity Details
            </h1>

            <p>
              Building your evidence-backed
              opportunity match.
            </p>

          </div>

          <Link
            to="/opportunities"
            className="back-link"
          >
            ← Opportunities
          </Link>

        </header>

        <main>

          <AsyncState
            loading
            loadingMessage="Building your match explanation..."
          />

        </main>

      </div>

    );

  }


  if (error) {

    return (

      <div className="opportunity-detail-page">

        <header className="opportunity-detail-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Opportunity Details
            </h1>

            <p>
              We couldn't load this opportunity.
            </p>

          </div>

          <Link
            to="/opportunities"
            className="back-link"
          >
            ← Opportunities
          </Link>

        </header>

        <main>

          <AsyncState
            error={error}
            onRetry={loadData}
          />

        </main>

      </div>

    );

  }


  const opportunity =
    data?.opportunity;


  const roadmapItems =
    roadmap?.roadmap || [];


  /*
   * Defensive handling in case the API returns
   * match data without an opportunity object.
   */

  if (!opportunity) {

    return (

      <div className="opportunity-detail-page">

        <header className="opportunity-detail-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Opportunity Not Found
            </h1>

            <p>
              This opportunity may no longer be available.
            </p>

          </div>

          <Link
            to="/opportunities"
            className="back-link"
          >
            ← Opportunities
          </Link>

        </header>

        <main>

          <AsyncState
            empty
            emptyTitle="Opportunity not found"
            emptyMessage={
              "The opportunity could not be found or is no longer available."
            }
          />

        </main>

      </div>

    );

  }


  return (

    <div className="opportunity-detail-page">


      {/* HEADER */}

      <header className="opportunity-detail-header">


        <div>


          <span className="brand">
            SkillProof
          </span>


          <span className="opportunity-type">
            {opportunity.opportunity_type}
          </span>


          <h1>
            {opportunity.title}
          </h1>


          <p>
            {opportunity.organization}
          </p>


        </div>


        <Link
          to="/opportunities"
          className="back-link"
        >
          ← Opportunities
        </Link>


      </header>


      {/* MATCH HERO */}

      <section className="detail-match-hero">


        <div>

          <span>
            Your Explainable Match
          </span>


          <strong>
            {data.match_score}%
          </strong>


          <p>
            {data.match_level} match
          </p>

        </div>


        <div className="detail-hero-explanation">


          <strong>
            Why this match?
          </strong>


          <p>
            {data.explanation}
          </p>


        </div>


      </section>


      {/* SKILL DETAILS */}

      <section className="detail-grid">


        {/* MATCHED SKILLS */}

        <div className="detail-card">


          <h2>
            Skills supporting your match
          </h2>


          <p>
            These skills are backed by evidence
            in your SkillProof passport.
          </p>


          {data.matched_skills?.length ? (

            <div className="detail-skill-list">


              {data.matched_skills.map(
                (skill) => (

                  <div
                    className="detail-skill matched"
                    key={skill.skill_id}
                  >


                    <div>


                      <strong>
                        ✓ {skill.skill}
                      </strong>


                      <span>
                        {skill.evidence_count}{" "}
                        evidence item
                        {skill.evidence_count !== 1
                          ? "s"
                          : ""}
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

            <p className="empty-detail">
              No skills currently satisfy the
              opportunity requirements.
            </p>

          )}


        </div>


        {/* MISSING SKILLS */}

        <div className="detail-card">


          <h2>
            Missing skills
          </h2>


          <p>
            Skills you may need to develop for
            this opportunity.
          </p>


          {data.missing_skills?.length ? (

            <div className="detail-skill-list">


              {data.missing_skills.map(
                (skill) => (

                  <div
                    className="detail-skill missing"
                    key={skill.skill_id}
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

            <p className="empty-detail">
              You have all the listed skills.
            </p>

          )}


        </div>


        {/* CONFIDENCE GAPS */}

        <div className="detail-card">


          <h2>
            Evidence confidence gaps
          </h2>


          <p>
            Skills where your current evidence
            confidence is below the opportunity's
            target.
          </p>


          {data.confidence_gaps?.length ? (

            <div className="detail-skill-list">


              {data.confidence_gaps.map(
                (gap) => (

                  <div
                    className="confidence-detail"
                    key={gap.skill_id}
                  >


                    <div>


                      <strong>
                        {gap.skill}
                      </strong>


                      <span>
                        Current confidence:{" "}
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

            <p className="empty-detail">
              No confidence gaps detected.
            </p>

          )}


        </div>


      </section>


      {/* GROWTH ROADMAP */}

      <section className="growth-roadmap">


        <div className="roadmap-header">


          <div>


            <span className="section-label">
              PERSONALIZED GROWTH PLAN
            </span>


            <h2>
              Improve your match
            </h2>


            <p>
              SkillProof identifies the highest
              priority gaps preventing a stronger
              match and tells you what to work on
              next.
            </p>


          </div>


          <div className="roadmap-match">


            <span>
              Current match
            </span>


            <strong>
              {roadmap?.current_match || 0}%
            </strong>


          </div>


        </div>


        {roadmapItems.length === 0 ? (

          <div className="roadmap-complete">


            <div className="roadmap-complete-icon">
              ✓
            </div>


            <div>


              <h3>
                No major skill gaps detected
              </h3>


              <p>
                Your current evidence-backed
                skills cover the listed
                opportunity requirements.
              </p>


            </div>


          </div>

        ) : (

          <div className="roadmap-list">


            {roadmapItems.map(
              (item, index) => (

                <div
                  className="roadmap-item"
                  key={`${item.skill_id}-${index}`}
                >


                  <div className="roadmap-number">
                    {index + 1}
                  </div>


                  <div className="roadmap-content">


                    <div className="roadmap-item-header">


                      <div>


                        <h3>
                          {item.skill}
                        </h3>


                        <span>
                          {item.type === "missing"
                            ? "Skill not yet demonstrated"
                            : "Evidence confidence gap"}
                        </span>


                      </div>


                      <span
                        className={
                          `priority-badge ` +
                          `priority-${item.priority}`
                        }
                      >
                        {item.priority} priority
                      </span>


                    </div>


                    <p>
                      {item.reason}
                    </p>


                    <div className="roadmap-action">


                      <strong>
                        Next step:
                      </strong>


                      <span>
                        {item.action}
                      </span>


                    </div>


                    {item.type ===
                      "confidence_gap" && (

                      <div className="confidence-progress">


                        <div className="progress-label">


                          <span>
                            Current confidence
                          </span>


                          <span>
                            {item.current_confidence}%
                            {" → "}
                            {item.target_confidence}%
                          </span>


                        </div>


                        <div className="progress-track">


                          <div
                            className="progress-fill"
                            style={{
                              width:
                                `${Math.min(
                                  item.current_confidence,
                                  100
                                )}%`,
                            }}
                          />


                        </div>


                      </div>

                    )}


                  </div>


                </div>

              )
            )}


          </div>

        )}


        <div className="roadmap-principle">


          <strong>
            The goal isn't just a higher score.
          </strong>


          <p>
            Build real skills, create meaningful
            evidence and strengthen the proof
            behind your passport. Your match
            improves as your demonstrated
            capabilities improve.
          </p>


        </div>


      </section>


      {/* FAIRNESS */}

      <section className="detail-principle">


        <strong>
          Fair matching
        </strong>


        <p>
          This recommendation is calculated from
          opportunity requirements and your
          evidence-backed skills. Protected or
          irrelevant personal attributes are not
          used in the matching score.
        </p>


      </section>


      {/* APPLICATION */}

      <section className="application-section">


        <div className="application-card">


          <span className="section-label">
            APPLICATION
          </span>


          <h2>
            Apply to this opportunity
          </h2>


          <p>
            Introduce yourself to the recruiter
            and explain why you're interested.
          </p>


          {applicationSuccess ? (

            <div className="application-success">


              <div className="application-success-icon">
                ✓
              </div>


              <div>


                <h3>
                  Application submitted
                </h3>


                <p>
                  Your application has been
                  submitted successfully.
                </p>


                <span>
                  Status:{" "}
                  {applicationStatus || "Applied"}
                </span>


              </div>


            </div>

          ) : (

            <form
              className="application-form"
              onSubmit={handleApply}
            >


              {applicationError && (

                <div className="dashboard-error">
                  {applicationError}
                </div>

              )}


              <div className="form-field">


                <label htmlFor="cover_message">
                  Cover Message
                </label>


                <textarea
                  id="cover_message"
                  value={coverMessage}
                  onChange={(event) =>
                    setCoverMessage(
                      event.target.value
                    )
                  }
                  placeholder="Tell the recruiter why you're interested in this opportunity and what makes you a good fit..."
                  rows="6"
                />


              </div>


              <div className="application-actions">


                <button
                  type="submit"
                  className="primary-action"
                  disabled={applicationLoading}
                >

                  {applicationLoading
                    ? "Submitting..."
                    : "Submit Application"}

                </button>


                {opportunity.application_url && (

                  <a
                    href={
                      opportunity.application_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="secondary-action"
                  >
                    External Application
                  </a>

                )}


              </div>


            </form>

          )}


        </div>


      </section>


      {/* ACTIONS */}

      <div className="detail-actions">


        <Link
          to="/opportunities"
          className="secondary-action"
        >
          Back to Opportunities
        </Link>


        <Link
          to="/evidence"
          className="secondary-action"
        >
          Add Evidence
        </Link>


      </div>


    </div>

  );

}


export default OpportunityDetail;