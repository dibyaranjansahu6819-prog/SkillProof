import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AsyncState from "../components/AsyncState";

import {
  getOpportunities,
} from "../services/opportunityService";


function Opportunities() {
  const [opportunities, setOpportunities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadOpportunities = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getOpportunities();

      setOpportunities(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Unable to load internship recommendations:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load internship recommendations. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    loadOpportunities();

  }, [loadOpportunities]);


  if (loading) {

    return (

      <div className="opportunities-page">

        <header className="opportunities-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Opportunities for You
            </h1>

            <p>
              Matches are based on your
              evidence-backed skills — not
              irrelevant personal attributes.
            </p>

          </div>


          <Link
            to="/dashboard"
            className="back-link"
          >
            ← Dashboard
          </Link>

        </header>


        <main className="opportunities-content">

          <AsyncState
            loading
            loadingMessage="Finding opportunities for you..."
          />

        </main>

      </div>

    );

  }


  if (error) {

    return (

      <div className="opportunities-page">

        <header className="opportunities-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Opportunities for You
            </h1>

            <p>
              Matches are based on your
              evidence-backed skills — not
              irrelevant personal attributes.
            </p>

          </div>


          <Link
            to="/dashboard"
            className="back-link"
          >
            ← Dashboard
          </Link>

        </header>


        <main className="opportunities-content">

          <AsyncState
            error={error}
            onRetry={loadOpportunities}
          />

        </main>

      </div>

    );

  }


  return (
    <div className="opportunities-page">

      <header className="opportunities-header">

        <div>

          <span className="brand">
            SkillProof
          </span>

          <h1>
            Opportunities for You
          </h1>

          <p>
            Matches are based on your
            evidence-backed skills — not
            irrelevant personal attributes.
          </p>

        </div>


        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>

      </header>


      <section className="matching-principle">

        <div className="principle-icon">
          ✓
        </div>

        <div>

          <strong>
            Explainable matching
          </strong>

          <p>
            Every recommendation shows which
            skills support the match and which
            skills are missing.
          </p>

        </div>

      </section>


      {opportunities.length === 0 ? (

        <AsyncState
          empty
          emptyTitle="No active opportunities"
          emptyMessage={
            "New opportunities will appear here when they are available."
          }
        />

      ) : (

        <section className="opportunity-list">

          {opportunities.map(
            (opportunity) => (

              <article
                className="opportunity-card"
                key={opportunity.id}
              >

                <div className="opportunity-card-header">

                  <div>

                    <span className="opportunity-type">
                      {opportunity.opportunity_type}
                    </span>

                    <h2>
                      {opportunity.title}
                    </h2>

                    <p className="organization">
                      {opportunity.organization}
                    </p>

                  </div>


                 <div className="match-score">

  <div className="match-score-number">
    {opportunity.match_score}%
  </div>

  <span className="match-score-label">
    Match
  </span>

  <div className="match-progress">
    <div
      className="match-progress-fill"
      style={{
        width: `${Math.min(
          opportunity.match_score || 0,
          100
        )}%`,
      }}
    />
  </div>

  <span className="match-score-level">
    {opportunity.match_level}
  </span>

</div>
                </div>


                <p className="opportunity-description">
                  {opportunity.description}
                </p>


                <div className="opportunity-meta">

                  {opportunity.remote && (
                    <span>
                      Remote
                    </span>
                  )}

                  {opportunity.location && (
                    <span>
                      {opportunity.location}
                    </span>
                  )}

                  {opportunity.deadline && (
                    <span>
                      Deadline:{" "}
                      {opportunity.deadline}
                    </span>
                  )}

                </div>


                <div className="match-level">

                  <span>
                    Match strength
                  </span>

                  <strong>
                    {opportunity.match_level}
                  </strong>

                </div>


                {/* MATCHED SKILLS */}

                {opportunity.matched_skills
                  ?.length > 0 && (

                  <div className="match-section">

                    <h3>
                      Why you match
                    </h3>

                    <div className="matched-skill-list">

                      {opportunity.matched_skills.map(
                        (skill) => (

                          <div
                            className="matched-skill"
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

                  </div>

                )}


                {/* MISSING SKILLS */}

                {opportunity.missing_skills
                  ?.length > 0 && (

                  <div className="match-section missing-section">

                    <h3>
                      Skills to develop
                    </h3>

                    <div className="missing-skill-list">

                      {opportunity.missing_skills.map(
                        (skill) => (

                          <div
                            className="missing-skill"
                            key={skill.skill_id}
                          >

                            <span>
                              ⚠ {skill.skill}
                            </span>

                            {skill.required && (
                              <small>
                                Required
                              </small>
                            )}

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}


                {/* CONFIDENCE GAPS */}

                {opportunity.confidence_gaps
                  ?.length > 0 && (

                  <div className="match-section">

                    <h3>
                      Evidence gaps
                    </h3>

                    {opportunity.confidence_gaps.map(
                      (gap) => (

                        <div
                          className="confidence-gap"
                          key={gap.skill_id}
                        >

                          <span>
                            {gap.skill}
                          </span>

                          <span>
                            {gap.confidence}% /{" "}
                            {gap.required_confidence}%
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}


                <div className="match-explanation">

                  <strong>
                    Why this match?
                  </strong>

                  <p>
                    {opportunity.explanation}
                  </p>

                </div>


                <div className="opportunity-actions">

                  <Link
                    to={`/opportunities/${opportunity.id}`}
                    className="secondary-action"
                  >
                    View Full Explanation
                  </Link>


                  {opportunity.application_url && (
                    <a
                      href={
                        opportunity.application_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-action"
                    >
                      Apply
                    </a>
                  )}

                </div>

              </article>

            )
          )}

        </section>

      )}

    </div>
  );
}


export default Opportunities;