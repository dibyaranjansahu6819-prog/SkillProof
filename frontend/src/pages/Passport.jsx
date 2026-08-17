import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
} from "../services/profileService";

import {
  getMySkills,
} from "../services/skillService";

import AddSkillForm from "../components/AddSkillForm";
import AsyncState from "../components/AsyncState";


function Passport() {
  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
    university: "",
    degree: "",
    graduation_year: "",
    github_url: "",
    linkedin_url: "",
  });

  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  /*
   * Load passport profile + skills
   */

  const loadPassport = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const [
        profileData,
        skillsData,
      ] = await Promise.all([
        getMyProfile(),
        getMySkills(),
      ]);

      setFormData({
        full_name: profileData.full_name || "",
        headline: profileData.headline || "",
        bio: profileData.bio || "",
        university: profileData.university || "",
        degree: profileData.degree || "",
        graduation_year:
          profileData.graduation_year || "",
        github_url: profileData.github_url || "",
        linkedin_url:
          profileData.linkedin_url || "",
      });

      setSkills(
        Array.isArray(skillsData)
          ? skillsData
          : []
      );

    } catch (error) {

      console.error(
        "Unable to load passport:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load your passport. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    loadPassport();

  }, [loadPassport]);


  // Handle profile form changes
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setMessage("");
    setError("");
  };


  // Save profile
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateMyProfile({
        ...formData,
        graduation_year:
          formData.graduation_year
            ? Number(formData.graduation_year)
            : null,
      });

      setMessage(
        "Your Skill Passport has been updated."
      );

    } catch (error) {
      const data = error.response?.data;

      setError(
        data
          ? Object.values(data)
              .flat()
              .join(" ")
          : "Unable to update your passport."
      );

    } finally {
      setSaving(false);
    }
  };


  // Refresh skills after adding a new skill
  const handleSkillAdded = async () => {

    try {

      setError("");

      const data = await getMySkills();

      setSkills(
        Array.isArray(data)
          ? data
          : []
      );

      setMessage(
        "Skill added to your Skill Passport."
      );

    } catch (error) {

      console.error(
        "Unable to refresh skills:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Skill was added, but the updated skill list could not be loaded."
      );

    }

  };


  if (loading) {

    return (

      <div className="passport-page">

        <AsyncState
          loading
          loadingMessage="Loading your Skill Passport..."
        />

      </div>

    );

  }


  if (error && !formData.full_name && !formData.headline) {

    return (

      <div className="passport-page">

        <header className="passport-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Your Skill Passport
            </h1>

            <p>
              Build a portable profile backed by
              verifiable evidence.
            </p>

          </div>

          <Link
            to="/dashboard"
            className="back-link"
          >
            ← Dashboard
          </Link>

        </header>

        <main>

          <AsyncState
            error={error}
            onRetry={loadPassport}
          />

        </main>

      </div>

    );

  }


  return (
    <div className="passport-page">

      {/* HEADER */}

      <header className="passport-header">

        <div>

          <span className="brand">
            SkillProof
          </span>

          <h1>
            Your Skill Passport
          </h1>

          <p>
            Build a portable profile backed by
            verifiable evidence.
          </p>

        </div>


        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>

      </header>


      {/* MAIN CONTENT */}

      <div className="passport-layout">

        {/* LEFT COLUMN */}

        <div>

          {/* PROFILE FORM */}

          <section className="passport-form-card">

            <h2>
              Profile Information
            </h2>

            <p className="section-description">
              This information forms the identity
              portion of your portable passport.
            </p>


            {message && (
              <div className="success-message">
                {message}
              </div>
            )}


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              <label>
                Full Name
              </label>

              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />


              <label>
                Professional Headline
              </label>

              <input
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
              />


              <label>
                Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about your experience..."
                rows="5"
              />


              <label>
                University / Institution
              </label>

              <input
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="University name"
              />


              <label>
                Degree
              </label>

              <input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
              />


              <label>
                Graduation Year
              </label>

              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
                placeholder="2028"
                min="2000"
                max="2100"
              />


              <label>
                GitHub URL
              </label>

              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />


              <label>
                LinkedIn URL
              </label>

              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
              />


              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Passport"}
              </button>

            </form>

          </section>


          {/* SKILLS SECTION */}

          <section className="passport-skills-card">

            <div className="skills-header">

              <div>

                <h2>
                  Your Skills
                </h2>

                <p>
                  These skills will later be
                  supported by evidence in your
                  Skill Proof Graph.
                </p>

              </div>

            </div>


            {/* SKILL LIST */}

            <div className="passport-skill-list">

              {skills.length === 0 ? (

                <div className="empty-state">

                  <h3>
                    No skills added yet
                  </h3>

                  <p>
                    Add your first skill below to
                    start building your passport.
                  </p>

                </div>

              ) : (

                skills.map((item) => (

                  <div
                    className="passport-skill"
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


                    <div className="skill-meta">

                      <span>
                        {item.proficiency}
                      </span>

                      <small>
                        Self:{" "}
                        {item.self_assessment_score}
                        /100
                      </small>

                    </div>

                  </div>

                ))

              )}

            </div>


            {/* ADD SKILL FORM */}

            <AddSkillForm
              onSkillAdded={handleSkillAdded}
            />

          </section>

        </div>


        {/* RIGHT COLUMN — PASSPORT PREVIEW */}

        <section className="passport-preview-card">

          <span className="passport-label">
            LIVE PREVIEW
          </span>


          <h2>
            {formData.full_name ||
              "Your Name"}
          </h2>


          <h3>
            {formData.headline ||
              "Your professional headline"}
          </h3>


          <p>
            {formData.bio ||
              "Your professional summary will appear here."}
          </p>


          <div className="preview-divider" />


          <div className="preview-item">

            <span>
              Institution
            </span>

            <strong>
              {formData.university ||
                "Not added"}
            </strong>

          </div>


          <div className="preview-item">

            <span>
              Degree
            </span>

            <strong>
              {formData.degree ||
                "Not added"}
            </strong>

          </div>


          <div className="preview-item">

            <span>
              Graduation
            </span>

            <strong>
              {formData.graduation_year ||
                "Not added"}
            </strong>

          </div>


          {/* SKILL PREVIEW */}

          <div className="preview-skills">

            <h3>
              Skills
            </h3>

            {skills.length === 0 ? (

              <p className="preview-muted">
                No skills added yet.
              </p>

            ) : (

              <div className="preview-skill-tags">

                {skills.map((item) => (

                  <span
                    key={item.id}
                    className="preview-skill-tag"
                  >
                    {item.skill_name}
                  </span>

                ))}

              </div>

            )}

          </div>


          <div className="preview-note">

            <strong>
              Evidence-backed passport
            </strong>

            <p>
              Skills and achievements will be
              connected to supporting evidence.
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}


export default Passport;