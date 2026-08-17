import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import AsyncState from "../components/AsyncState";

import {
  getRecruiterOpportunities,
} from "../services/recruiterService";


function RecruiterOpportunities() {

  const { logout } = useAuth();


  const [opportunities, setOpportunities] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | Load Recruiter Opportunities
  |--------------------------------------------------------------------------
  */

  const loadOpportunities =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getRecruiterOpportunities();


        setOpportunities(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Unable to load recruiter opportunities:",
          error
        );


        setError(
          "Unable to load your opportunities. Please try again."
        );

      } finally {

        setLoading(false);

      }

    }, []);


  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadOpportunities();

  }, [loadOpportunities]);


  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div className="recruiter-dashboard">

        <header className="recruiter-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Your Opportunities
            </h1>

            <p>
              Manage the opportunities you have
              created for students.
            </p>

          </div>

        </header>


        <main className="recruiter-content">

          <AsyncState
            loading
            loadingMessage="Loading your opportunities..."
          />

        </main>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (

      <div className="recruiter-dashboard">

        <header className="recruiter-header">

          <div>

            <span className="brand">
              SkillProof
            </span>

            <h1>
              Your Opportunities
            </h1>

            <p>
              Manage the opportunities you have
              created for students.
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
              className="recruiter-nav-link"
            >
              Candidates
            </Link>


            <Link
              to="/recruiter/opportunities/create"
              className="recruiter-nav-link"
            >
              + Create
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

          <div className="recruiter-card">

            <AsyncState
              error={error}
              onRetry={loadOpportunities}
            />

          </div>

        </main>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Main Page
  |--------------------------------------------------------------------------
  */

  return (

    <div className="recruiter-dashboard">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="recruiter-header">


        <div>

          <span className="brand">
            SkillProof
          </span>


          <h1>
            Your Opportunities
          </h1>


          <p>
            Manage the opportunities you have
            created for students.
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


          <Link
            to="/recruiter/candidates"
            className="recruiter-nav-link"
          >
            Candidates
          </Link>


          <Link
            to="/recruiter/opportunities/create"
            className="recruiter-nav-link"
          >
            + Create
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


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="recruiter-content">


        <div className="recruiter-card">


          {/* =================================================
              CARD HEADER
          ================================================= */}

          <div className="recruiter-card-header">


            <div>

              <span className="section-label">
                OPPORTUNITY MANAGEMENT
              </span>


              <h2>
                Your published opportunities
              </h2>


              <p>
                Review the opportunities associated
                with your recruiter account.
              </p>

            </div>


            <Link
              to="/recruiter/opportunities/create"
              className="primary-action"
            >
              + Create Opportunity
            </Link>


          </div>


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {opportunities.length === 0 ? (

            <AsyncState
              empty
              emptyTitle="No opportunities yet"
              emptyMessage={
                "Create your first opportunity to start " +
                "discovering student talent."
              }
            />

          ) : (


            /* ===============================================
               OPPORTUNITY LIST
            =============================================== */

            <div className="recruiter-opportunity-list">


              {opportunities.map(
                (opportunity) => (


                  <article
                    className="recruiter-opportunity-card"
                    key={opportunity.id}
                  >


                    <div>


                      {/* =====================================
                          TOP ROW
                      ===================================== */}

                      <div className="opportunity-top-row">


                        <span className="section-label">

                          {opportunity.opportunity_type}

                        </span>


                        <span
                          className={
                            opportunity.is_active
                              ? "opportunity-status active"
                              : "opportunity-status inactive"
                          }
                        >

                          {opportunity.is_active
                            ? "Active"
                            : "Inactive"}

                        </span>


                      </div>


                      {/* =====================================
                          TITLE
                      ===================================== */}

                      <h3>
                        {opportunity.title}
                      </h3>


                      {/* =====================================
                          ORGANIZATION
                      ===================================== */}

                      <p className="opportunity-organization">

                        {opportunity.organization}

                      </p>


                      {/* =====================================
                          DESCRIPTION
                      ===================================== */}

                      <p>

                        {opportunity.description}

                      </p>


                      {/* =====================================
                          META
                      ===================================== */}

                      <div className="opportunity-meta">


                        <span>

                          📍{" "}

                          {opportunity.remote
                            ? "Remote"
                            : opportunity.location ||
                              "Location not specified"}

                        </span>


                        {opportunity.deadline && (

                          <span>

                            Deadline:{" "}

                            {opportunity.deadline}

                          </span>

                        )}


                      </div>


                      {/* =====================================
                          SKILLS
                      ===================================== */}

                      <div className="opportunity-skills">


                        {opportunity.skills?.length > 0 ? (

                          opportunity.skills.map(
                            (skill) => (

                              <span
                                className={
                                  skill.required
                                    ? "skill-tag required"
                                    : "skill-tag"
                                }
                                key={skill.id}
                              >

                                {skill.name}

                              </span>

                            )
                          )

                        ) : (

                          <span>
                            No skills configured
                          </span>

                        )}


                      </div>


                    </div>


                  </article>

                )
              )}


            </div>

          )}


        </div>


      </main>


    </div>

  );

}


export default RecruiterOpportunities;