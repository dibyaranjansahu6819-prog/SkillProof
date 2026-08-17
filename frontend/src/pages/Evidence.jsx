import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AddEvidenceForm from "../components/AddEvidenceForm";
import AsyncState from "../components/AsyncState";

import {
  getMyEvidence,
  deleteEvidence,
} from "../services/evidenceService";


function Evidence() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadEvidence = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getMyEvidence();

      setEvidence(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Unable to load evidence:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load your evidence. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    loadEvidence();

  }, [loadEvidence]);


  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this evidence?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      await deleteEvidence(id);

      await loadEvidence();

    } catch (error) {

      console.error(
        "Unable to delete evidence:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to delete the evidence. Please try again."
      );

    }

  };


  return (
    <div className="evidence-page">

      <header className="evidence-header">

        <div>
          <span className="brand">
            SkillProof
          </span>

          <h1>
            Evidence Vault
          </h1>

          <p>
            Add achievements and connect them
            to the skills they prove.
          </p>
        </div>


        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>

      </header>


      {error && !loading && evidence.length > 0 && (

        <div className="error-message evidence-inline-error">

          {error}

        </div>

      )}


      <div className="evidence-layout">

        <section className="evidence-form-card">

          <AddEvidenceForm
            onEvidenceAdded={loadEvidence}
          />

        </section>


        <section className="evidence-list-card">

          <h2>
            Your Evidence
          </h2>

          <p className="section-description">
            Every item can support one or more
            skills in your Skill Proof Graph.
          </p>


          {loading ? (

            <AsyncState
              loading
              loadingMessage="Loading your evidence..."
            />

          ) : error && evidence.length === 0 ? (

            <AsyncState
              error={error}
              onRetry={loadEvidence}
            />

          ) : evidence.length === 0 ? (

            <AsyncState
              empty
              emptyTitle="No evidence yet"
              emptyMessage={
                "Add your first project, coursework, " +
                "competition, or credential."
              }
            />

          ) : (

            <div className="evidence-items">

              {evidence.map((item) => (

                <article
                  className="evidence-item"
                  key={item.id}
                >

                  <div className="evidence-item-header">

                    <div>

                      <h3>
                        {item.title}
                      </h3>

                      <span className="evidence-type">
                        {item.evidence_type}
                      </span>

                    </div>


                    <span
                      className={
                        `verification-status ` +
                        item.verification_status
                      }
                    >
                      {item.verification_status}
                    </span>

                  </div>


                  {item.description && (
                    <p>
                      {item.description}
                    </p>
                  )}


                  {item.issuing_organization && (
                    <div className="evidence-detail">
                      <strong>
                        Organization:
                      </strong>{" "}
                      {item.issuing_organization}
                    </div>
                  )}


                  {item.skill_names?.length > 0 && (

                    <div className="evidence-skills">

                      <strong>
                        Supports:
                      </strong>

                      <div className="evidence-skill-tags">

                        {item.skill_names.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="preview-skill-tag"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>

                  )}


                  <div className="evidence-item-footer">

                    <span>
                      Verification score:{" "}
                      {item.verification_score}/100
                    </span>


                    {item.evidence_url && (
                      <a
                        href={item.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Evidence
                      </a>
                    )}


                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}


export default Evidence;