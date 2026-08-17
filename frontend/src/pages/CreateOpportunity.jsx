import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AsyncState from "../components/AsyncState";

import {
  createRecruiterOpportunity,
} from "../services/recruiterService";

import {
  getAvailableSkills,
} from "../services/skillService";


function CreateOpportunity() {

  const { logout } = useAuth();

  const navigate = useNavigate();


  const [form, setForm] = useState({
    title: "",
    organization: "",
    opportunity_type: "internship",
    description: "",
    location: "",
    remote: false,
    application_url: "",
    deadline: "",
    is_active: true,
  });


  const [skills, setSkills] = useState([]);

  const [selectedSkills, setSelectedSkills] =
    useState([]);


  const [loading, setLoading] =
    useState(false);

  const [skillsLoading, setSkillsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* Load available skills */

  const loadSkills = useCallback(async () => {

    try {

      setSkillsLoading(true);
      setError("");

      const data =
        await getAvailableSkills();

      setSkills(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Unable to load skills:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load available skills. Please try again."
      );

    } finally {

      setSkillsLoading(false);

    }

  }, []);


  useEffect(() => {

    loadSkills();

  }, [loadSkills]);


  /* Handle normal form fields */
  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

  };


  /* Add a skill */
  const addSkill = (skill) => {

    const alreadySelected =
      selectedSkills.some(
        (item) =>
          item.skill === skill.id
      );


    if (alreadySelected) {
      return;
    }


    setSelectedSkills((previous) => [

      ...previous,

      {
        skill: skill.id,

        name: skill.name,

        is_required: true,

        importance: 50,

        minimum_confidence: 50,
      },

    ]);

  };


  /* Remove a selected skill */
  const removeSkill = (skillId) => {

    setSelectedSkills((previous) =>
      previous.filter(
        (item) =>
          item.skill !== skillId
      )
    );

  };


  /* Update selected skill */
  const updateSelectedSkill = (
    skillId,
    field,
    value
  ) => {

    setSelectedSkills((previous) =>
      previous.map((item) => {

        if (item.skill !== skillId) {
          return item;
        }


        return {
          ...item,

          [field]:
            field === "is_required"
              ? value
              : Number(value),
        };

      })
    );

  };


  /* Submit opportunity */
  const handleSubmit = async (event) => {

    event.preventDefault();


    setError("");
    setSuccess("");


    if (!form.title.trim()) {

      setError(
        "Opportunity title is required."
      );

      return;

    }


    if (!form.organization.trim()) {

      setError(
        "Organization is required."
      );

      return;

    }


    if (!form.description.trim()) {

      setError(
        "Description is required."
      );

      return;

    }


    if (form.application_url.trim()) {

      try {

        new URL(
          form.application_url.trim()
        );

      } catch {

        setError(
          "Please enter a valid application URL."
        );

        return;

      }

    }


    if (
      form.deadline &&
      new Date(form.deadline) <
        new Date(
          new Date().toDateString()
        )
    ) {

      setError(
        "Application deadline cannot be in the past."
      );

      return;

    }


    try {

      setLoading(true);


      await createRecruiterOpportunity({

        ...form,

        title:
          form.title.trim(),

        organization:
          form.organization.trim(),

        description:
          form.description.trim(),

        location:
          form.location.trim(),

        skills:
          selectedSkills.map(
            (item) => ({

              skill: item.skill,

              is_required:
                item.is_required,

              importance:
                Number(
                  item.importance
                ),

              minimum_confidence:
                Number(
                  item.minimum_confidence
                ),

            })
          ),

      });


      setSuccess(
        "Opportunity created successfully."
      );


      setTimeout(() => {

        navigate(
          "/recruiter/opportunities"
        );

      }, 700);


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
          "Unable to create opportunity."
        );


      } else {

        setError(
          "Unable to create opportunity."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="recruiter-dashboard">


      <header className="recruiter-header">


        <div>

          <span className="brand">
            SkillProof
          </span>


          <h1>
            Create Opportunity
          </h1>


          <p>
            Publish an opportunity and define
            the skills you are looking for.
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
            className="recruiter-nav-link active"
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


        <section className="recruiter-card">


          <div className="recruiter-card-header">


            <div>

              <span className="section-label">
                NEW OPPORTUNITY
              </span>


              <h2>
                Opportunity details
              </h2>


              <p>
                Provide the information students
                will use to understand this opportunity.
              </p>

            </div>


          </div>


          {error && (

            <div className="dashboard-error create-error">

              {error}

              {skills.length === 0 &&
                !skillsLoading && (
                  <button
                    type="button"
                    className="notification-retry"
                    onClick={loadSkills}
                  >
                    Retry loading skills
                  </button>
                )}

            </div>

          )}


          {success && (

            <div className="create-success">
              {success}
            </div>

          )}


          <form
            className="recruiter-form"
            onSubmit={handleSubmit}
          >


            {/* BASIC INFORMATION */}

            <div className="form-grid">


              <div className="form-field">

                <label htmlFor="title">
                  Opportunity Title
                </label>


                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. React Developer Intern"
                  required
                />

              </div>


              <div className="form-field">

                <label htmlFor="organization">
                  Organization
                </label>


                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="e.g. SkillProof Labs"
                  required
                />

              </div>


              <div className="form-field">

                <label htmlFor="opportunity_type">
                  Opportunity Type
                </label>


                <select
                  id="opportunity_type"
                  name="opportunity_type"
                  value={form.opportunity_type}
                  onChange={handleChange}
                >

                  <option value="internship">
                    Internship
                  </option>


                  <option value="team">
                    Team Opportunity
                  </option>

                </select>

              </div>


              <div className="form-field">

                <label htmlFor="location">
                  Location
                </label>


                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Bhubaneswar"
                />

              </div>


              <div className="form-field">

                <label htmlFor="deadline">
                  Application Deadline
                </label>


                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                />

              </div>


              <div className="form-field">

                <label htmlFor="application_url">
                  Application URL
                </label>


                <input
                  id="application_url"
                  name="application_url"
                  type="url"
                  value={form.application_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>


            </div>


            {/* DESCRIPTION */}

            <div className="form-field">

              <label htmlFor="description">
                Description
              </label>


              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the opportunity, responsibilities and expectations..."
                rows="7"
                required
              />

            </div>


            {/* SKILL REQUIREMENTS */}

            <div className="recruiter-card skill-requirements-card">


              <div className="recruiter-card-header">


                <div>

                  <span className="section-label">
                    SKILL REQUIREMENTS
                  </span>


                  <h2>
                    What skills are you looking for?
                  </h2>


                  <p>
                    Select the skills students should
                    demonstrate for this opportunity.
                  </p>

                </div>


              </div>


              <div className="form-field skill-selector-field">


                <label htmlFor="skill-selector">
                  Add Skill
                </label>


                {skillsLoading ? (

                  <div className="skill-loading">

                    <AsyncState
                      loading
                      loadingMessage="Loading available skills..."
                    />

                  </div>

                ) : (

                  <select
                    id="skill-selector"
                    value=""
                    onChange={(event) => {

                      const skillId =
                        Number(
                          event.target.value
                        );


                      const selectedSkill =
                        skills.find(
                          (skill) =>
                            skill.id === skillId
                        );


                      if (selectedSkill) {

                        addSkill(
                          selectedSkill
                        );

                      }

                    }}
                  >

                    <option value="">
                      Select a skill...
                    </option>


                    {skills.map(
                      (skill) => (

                        <option
                          key={skill.id}
                          value={skill.id}
                          disabled={
                            selectedSkills.some(
                              (item) =>
                                item.skill ===
                                skill.id
                            )
                          }
                        >
                          {skill.name}
                        </option>

                      )
                    )}

                  </select>

                )}

              </div>


              {selectedSkills.length === 0 ? (

                <div className="skill-empty-state">

                  No skills selected yet.
                  Add skills using the selector above.

                </div>

              ) : (

                <div className="selected-skills-list">


                  {selectedSkills.map(
                    (item) => (

                      <div
                        className="selected-skill-card"
                        key={item.skill}
                      >


                        <div className="selected-skill-header">


                          <div>

                            <strong>
                              {item.name}
                            </strong>


                            <span>
                              {item.is_required
                                ? "Required"
                                : "Preferred"}
                            </span>

                          </div>


                          <button
                            type="button"
                            className="remove-skill-button"
                            onClick={() =>
                              removeSkill(
                                item.skill
                              )
                            }
                          >
                            Remove
                          </button>


                        </div>


                        <div className="skill-settings-grid">


                          <div className="form-field">


                            <label>
                              Requirement
                            </label>


                            <select
                              value={
                                item.is_required
                                  ? "required"
                                  : "preferred"
                              }
                              onChange={(event) =>
                                updateSelectedSkill(
                                  item.skill,
                                  "is_required",
                                  event.target.value ===
                                    "required"
                                )
                              }
                            >

                              <option value="required">
                                Required
                              </option>


                              <option value="preferred">
                                Preferred
                              </option>

                            </select>


                          </div>


                          <div className="form-field">


                            <label>
                              Importance
                            </label>


                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={
                                item.importance
                              }
                              onChange={(event) =>
                                updateSelectedSkill(
                                  item.skill,
                                  "importance",
                                  event.target.value
                                )
                              }
                            />


                          </div>


                          <div className="form-field">


                            <label>
                              Minimum Confidence
                            </label>


                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={
                                item.minimum_confidence
                              }
                              onChange={(event) =>
                                updateSelectedSkill(
                                  item.skill,
                                  "minimum_confidence",
                                  event.target.value
                                )
                              }
                            />


                          </div>


                        </div>


                      </div>

                    )
                  )}


                </div>

              )}


            </div>


            {/* OPTIONS */}

            <label className="checkbox-field">


              <input
                type="checkbox"
                name="remote"
                checked={form.remote}
                onChange={handleChange}
              />


              <span>
                This opportunity is remote
              </span>


            </label>


            <label className="checkbox-field">


              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />


              <span>
                Publish this opportunity immediately
              </span>


            </label>


            {/* ACTIONS */}

            <div className="form-actions">


              <Link
                to="/recruiter/opportunities"
                className="secondary-action"
              >
                Cancel
              </Link>


              <button
                type="submit"
                className="primary-action form-submit"
                disabled={loading}
              >

                {loading
                  ? "Creating..."
                  : "Create Opportunity"}

              </button>


            </div>


          </form>


        </section>


      </main>


    </div>

  );

}


export default CreateOpportunity;