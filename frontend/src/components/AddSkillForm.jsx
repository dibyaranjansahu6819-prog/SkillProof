import { useEffect, useState } from "react";

import {
  getAvailableSkills,
  addMySkill,
} from "../services/skillService";


function AddSkillForm({ onSkillAdded }) {
  const [skills, setSkills] = useState([]);

  const [selectedSkill, setSelectedSkill] =
    useState("");

  const [proficiency, setProficiency] =
    useState("beginner");

  const [score, setScore] =
    useState(50);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data =
          await getAvailableSkills();

        setSkills(data);
      } catch (error) {
        setError(
          "Unable to load available skills."
        );
      }
    };

    loadSkills();
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSkill) {
      setError("Please select a skill.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addMySkill({
        skill: Number(selectedSkill),
        proficiency,
        self_assessment_score: Number(score),
      });

      setSelectedSkill("");
      setProficiency("beginner");
      setScore(50);

      if (onSkillAdded) {
        onSkillAdded();
      }

    } catch (error) {
      const data = error.response?.data;

      setError(
        data
          ? Object.values(data).flat().join(" ")
          : "Unable to add skill."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="add-skill">

      <h3>
        Add a Skill
      </h3>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <label>Skill</label>

        <select
          value={selectedSkill}
          onChange={(event) =>
            setSelectedSkill(
              event.target.value
            )
          }
          required
        >

          <option value="">
            Select a skill
          </option>

          {skills.map((skill) => (
            <option
              key={skill.id}
              value={skill.id}
            >
              {skill.name}
            </option>
          ))}

        </select>


        <label>
          Proficiency
        </label>

        <select
          value={proficiency}
          onChange={(event) =>
            setProficiency(
              event.target.value
            )
          }
        >

          <option value="beginner">
            Beginner
          </option>

          <option value="intermediate">
            Intermediate
          </option>

          <option value="advanced">
            Advanced
          </option>

          <option value="expert">
            Expert
          </option>

        </select>


        <label>
          Self Assessment: {score}/100
        </label>

        <input
          type="range"
          min="0"
          max="100"
          value={score}
          onChange={(event) =>
            setScore(event.target.value)
          }
        />


        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Adding..."
            : "Add Skill"}
        </button>

      </form>

    </div>
  );
}


export default AddSkillForm;