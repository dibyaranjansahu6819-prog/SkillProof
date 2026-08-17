import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyProofGraph,
  getSkillConfidence,
} from "../services/dashboardService";

import AsyncState from "../components/AsyncState";


function ProofGraph() {
  const [graph, setGraph] = useState(null);

  const [confidenceData, setConfidenceData] =
    useState({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  const loadGraph = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const graphData =
        await getMyProofGraph();

      setGraph(graphData);

      const skills =
        graphData?.skills || [];

      const confidenceResults =
        await Promise.all(
          skills.map(async (skill) => {

            try {

              const result =
                await getSkillConfidence(
                  skill.id
                );

              return {
                skillId: skill.id,
                data: result,
              };

            } catch (error) {

              console.error(
                `Unable to load confidence for ${skill.name}`,
                error
              );

              return {
                skillId: skill.id,
                data: null,
              };

            }

          })
        );

      const confidenceMap = {};

      confidenceResults.forEach(
        ({ skillId, data }) => {

          confidenceMap[skillId] = data;

        }
      );

      setConfidenceData(
        confidenceMap
      );

    } catch (error) {

      console.error(
        "Unable to load Skill Proof Graph:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load your Skill Proof Graph. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    loadGraph();

  }, [loadGraph]);


  if (loading) {

    return (

      <div className="proof-graph-page">

        <header className="proof-graph-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Skill Proof Graph
            </h1>

            <p>
              See exactly which evidence supports
              each skill in your passport.
            </p>

          </div>

          <div className="graph-header-actions">

            <Link
              to="/passport"
              className="dashboard-action"
            >
              Passport
            </Link>

            <Link
              to="/dashboard"
              className="back-link"
            >
              ← Dashboard
            </Link>

          </div>

        </header>

        <main>

          <AsyncState
            loading
            loadingMessage="Building your Skill Proof Graph..."
          />

        </main>

      </div>

    );

  }


  if (error) {

    return (

      <div className="proof-graph-page">

        <header className="proof-graph-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Skill Proof Graph
            </h1>

            <p>
              See exactly which evidence supports
              each skill in your passport.
            </p>

          </div>

          <div className="graph-header-actions">

            <Link
              to="/passport"
              className="dashboard-action"
            >
              Passport
            </Link>

            <Link
              to="/dashboard"
              className="back-link"
            >
              ← Dashboard
            </Link>

          </div>

        </header>

        <main>

          <AsyncState
            error={error}
            onRetry={loadGraph}
          />

        </main>

      </div>

    );

  }


  const skills =
    graph?.skills || [];

  const evidence =
    graph?.evidence || [];


  const getEvidenceForSkill = (
    skillId
  ) => {
    return evidence.filter((item) =>
      item.skills.includes(skillId)
    );
  };


  const getConfidenceClass = (
    level
  ) => {

    if (level === "strong") {
      return "confidence-strong";
    }

    if (level === "high") {
      return "confidence-high";
    }

    if (level === "moderate") {
      return "confidence-moderate";
    }

    return "confidence-low";
  };


  return (
    <div className="proof-graph-page">

      {/* HEADER */}

      <header className="proof-graph-header">

        <div>

          <span className="brand">
            SkillProof
          </span>

          <h1>
            Skill Proof Graph
          </h1>

          <p>
            See exactly which evidence supports
            each skill in your passport.
          </p>

        </div>


        <div className="graph-header-actions">

          <Link
            to="/passport"
            className="dashboard-action"
          >
            Passport
          </Link>

          <Link
            to="/dashboard"
            className="back-link"
          >
            ← Dashboard
          </Link>

        </div>

      </header>


      {/* SUMMARY */}

      <section className="graph-overview">

        <div className="graph-stat">

          <span>
            Skills
          </span>

          <strong>
            {skills.length}
          </strong>

        </div>


        <div className="graph-stat">

          <span>
            Evidence
          </span>

          <strong>
            {evidence.length}
          </strong>

        </div>


        <div className="graph-stat">

          <span>
            Connections
          </span>

          <strong>
            {
              evidence.reduce(
                (total, item) =>
                  total +
                  item.skills.length,
                0
              )
            }
          </strong>

        </div>

      </section>


      {/* EMPTY GRAPH */}

      {skills.length === 0 ? (

        <section className="graph-empty">

          <AsyncState
            empty
            emptyTitle="Your graph is empty"
            emptyMessage={
              "Add skills and evidence to start " +
              "building your Skill Proof Graph."
            }
          />

          <Link
            to="/passport"
            className="primary-action"
          >
            Add Skills
          </Link>

        </section>

      ) : (

        <section className="proof-graph-container">

          <div className="graph-intro">

            <span className="explanation-label">
              EVIDENCE-BACKED SKILLS
            </span>

            <h2>
              Why does SkillProof trust this skill?
            </h2>

            <p>
              Confidence is calculated from
              supporting evidence rather than
              simply relying on self-assessment.
            </p>

          </div>


          <div className="skill-graph">

            {skills.map((skill) => {

              const skillEvidence =
                getEvidenceForSkill(
                  skill.id
                );


              const confidence =
                confidenceData[skill.id];


              return (

                <div
                  className="skill-graph-card"
                  key={skill.id}
                >

                  {/* SKILL HEADER */}

                  <div className="skill-graph-header">

                    <div className="skill-graph-node">

                      <div className="skill-node-icon">
                        S
                      </div>


                      <div>

                        <h3>
                          {skill.name}
                        </h3>

                        <span>
                          {skill.category}
                        </span>

                      </div>

                    </div>


                    {/* CONFIDENCE */}

                    {confidence && (

                      <div className="skill-confidence">

                        <div>

                          <span>
                            Confidence
                          </span>

                          <strong>
                            {
                              confidence
                                .confidence_score
                            }%
                          </strong>

                        </div>


                        <span
                          className={
                            `confidence-badge ` +
                            getConfidenceClass(
                              confidence
                                .confidence_level
                            )
                          }
                        >
                          {
                            confidence
                              .confidence_level
                          }
                        </span>

                      </div>

                    )}

                  </div>


                  {/* CONFIDENCE EXPLANATION */}

                  {confidence && (

                    <div className="confidence-explanation">

                      <strong>
                        Why?
                      </strong>

                      <span>
                        {confidence.explanation}
                      </span>

                    </div>

                  )}


                  {/* CONNECTION */}

                  <div className="graph-connection">

                    <div className="connection-line" />

                    <span>
                      supported by
                    </span>

                  </div>


                  {/* EVIDENCE */}

                  <div className="evidence-graph-list">

                    {skillEvidence.length === 0 ? (

                      <div className="no-proof">

                        <strong>
                          No supporting evidence
                        </strong>

                        <p>
                          This skill is currently
                          based only on your
                          self-assessment.
                        </p>

                        <Link to="/evidence">
                          Add evidence
                        </Link>

                      </div>

                    ) : (

                      skillEvidence.map(
                        (item) => (

                          <div
                            className="evidence-graph-node"
                            key={item.id}
                          >

                            <div className="evidence-node-icon">
                              E
                            </div>


                            <div className="evidence-node-content">

                              <strong>
                                {item.title}
                              </strong>

                              <span>
                                {item.evidence_type}
                              </span>

                              <small>
                                Verification:{" "}
                                {
                                  item.verification_score
                                }
                                /100
                              </small>

                            </div>


                            <span
                              className={
                                `verification-status ` +
                                item.verification_status
                              }
                            >
                              {
                                item.verification_status
                              }
                            </span>

                          </div>

                        )
                      )

                    )}

                  </div>

                </div>

              );

            })}

          </div>

        </section>

      )}


      {/* EXPLANATION */}

      <section className="graph-explanation">

        <div>

          <span className="explanation-label">
            EXPLAINABILITY
          </span>

          <h2>
            Every recommendation will have a reason.
          </h2>

          <p>
            SkillProof does not simply rank students
            by a mysterious score. It builds a chain
            from evidence to skills and eventually
            from skills to internship requirements.
          </p>

        </div>


        <div className="explanation-flow">

          <div>

            <strong>
              Evidence
            </strong>

            <span>
              Projects, coursework,
              competitions and credentials
            </span>

          </div>


          <div className="flow-arrow">
            →
          </div>


          <div>

            <strong>
              Skill Confidence
            </strong>

            <span>
              Evidence-backed capability
            </span>

          </div>


          <div className="flow-arrow">
            →
          </div>


          <div>

            <strong>
              Internship Match
            </strong>

            <span>
              Explainable recommendation
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}


export default ProofGraph;