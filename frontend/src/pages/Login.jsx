import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  loginUser,
  getCurrentUser,
} from "../services/authService";

import { useAuth } from "../context/AuthContext";


function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();


  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);


    try {

      await loginUser(formData);


      /*
       * Fetch the authenticated user's
       * profile so we know their role.
       */
      const userData =
        await getCurrentUser();


      /*
       * Store authenticated user
       * inside AuthContext.
       */
      login(userData);


      /*
       * Role-based navigation.
       */
      if (
        userData.role === "recruiter"
      ) {

        navigate(
          "/recruiter/dashboard"
        );

      } else {

        navigate("/dashboard");

      }


    } catch (error) {

      console.error(error);

      const data =
        error.response?.data;


      if (data) {

        setError(
          data.detail ||
          "Invalid username or password."
        );

      } else {

        setError(
          "Unable to connect to the server."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Welcome back
        </h1>


        <p className="auth-subtitle">
          Sign in to your SkillProof passport.
        </p>


        {error && (

          <div className="error-message">
            {error}
          </div>

        )}


        <form onSubmit={handleSubmit}>

          <label>
            Username
          </label>


          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />


          <label>
            Password
          </label>


          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Sign In"}

          </button>

        </form>


        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Create account
          </Link>

        </p>

      </div>

    </div>

  );

}


export default Login;