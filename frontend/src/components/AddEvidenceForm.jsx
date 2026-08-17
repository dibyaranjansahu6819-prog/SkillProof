import { useEffect, useState } from "react";

import { getAvailableSkills } from "../services/skillService";
import { createEvidence } from "../services/evidenceService";


function AddEvidenceForm({ onEvidenceAdded }) {
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    evidence_type: "project",
    description: "",
    issuing_organization: "",
    evidence_url: "",
    issued_date: "",
    skills: [],
  });

  const [loading, setLoading] = useState(false);
  const [loadingSkills, setLoadingSkills] =
    useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await getAvailableSkills();
        setSkills(data);
      } catch (error) {
        setError(
          "Unable to load the skill catalog."
        );
      } finally {
        setLoadingSkills(false);
      }
    };

    loadSkills();
  }, []);


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
    setSuccess("");
  };


  const handleSkillChange = (event) => {
    const selectedOptions =
      Array.from(event.target.selectedOptions);

    const selectedSkills = selectedOptions.map(
      (option) => Number(option.value)
    );

    setFormData({
      ...formData,
      skills: selectedSkills,
    });

    setError("");
    setSuccess("");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createEvidence(formData);

      setFormData({
        title: "",
        evidence_type: "project",
        description: "",
        issuing_organization: "",
        evidence_url: "",
        issued_date: "",
        skills: [],
      });

      setSuccess(
        "Evidence submitted successfully. It is currently self-declared and can be verified later."
      );

      if (onEvidenceAdded) {
        onEvidenceAdded();
      }

    } catch (error) {
      const data = error.response?.data;

      setError(
        data
          ? Object.values(data)
              .flat()
              .join(" ")
          : "Unable to submit evidence."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="add-evidence">

      <h3>
        Add Evidence
      </h3>

      <p className="form-help">
        Connect an achievement to the skills
        it demonstrates.
      </p>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      <form onSubmit={handleSubmit}>

        <label>
          Evidence Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. FoodBridge Project"
          required
        />


        <label>
          Evidence Type
        </label>

        <select
          name="evidence_type"
          value={formData.evidence_type}
          onChange={handleChange}
        >
          <option value="project">
            Project
          </option>

          <option value="coursework">
            Coursework
          </option>

          <option value="competition">
            Competition
          </option>

          <option value="credential">
            Micro-Credential
          </option>

          <option value="assessment">
            Practical Assessment
          </option>

          <option value="other">
            Other
          </option>
        </select>


        <label>
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what you built, learned, or achieved..."
          rows="5"
        />


        <label>
          Issuing Organization
        </label>

        <input
          type="text"
          name="issuing_organization"
          value={formData.issuing_organization}
          onChange={handleChange}
          placeholder="College, organization, company..."
        />


        <label>
          Evidence URL
        </label>

        <input
          type="url"
          name="evidence_url"
          value={formData.evidence_url}
          onChange={handleChange}
          placeholder="GitHub, certificate, competition page..."
        />


        <label>
          Date
        </label>

        <input
          type="date"
          name="issued_date"
          value={formData.issued_date}
          onChange={handleChange}
        />


        <label>
          Skills Demonstrated
        </label>

        {loadingSkills ? (
          <p>
            Loading skills...
          </p>
        ) : (
          <select
            multiple
            value={formData.skills.map(String)}
            onChange={handleSkillChange}
            className="skill-multi-select"
          >
            {skills.map((skill) => (
              <option
                key={skill.id}
                value={skill.id}
              >
                {skill.name}
              </option>
            ))}
          </select>
        )}


        <small className="form-help">
          Hold Ctrl (Windows) or Command (Mac)
          to select multiple skills.
        </small>


        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Evidence"}
        </button>

      </form>

    </div>
  );
}


export default AddEvidenceForm;