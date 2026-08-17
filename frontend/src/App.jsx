import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Passport from "./pages/Passport";
import ProofGraph from "./pages/ProofGraph";

import ProtectedRoute from "./components/ProtectedRoute";
import Evidence from "./pages/Evidence";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterOpportunities from "./pages/RecruiterOpportunities";
import CreateOpportunity from "./pages/CreateOpportunity";
import RecruiterCandidates
  from "./pages/RecruiterCandidates";
import RecruiterCandidateDetail
  from "./pages/RecruiterCandidateDetail";
import MyApplications from "./pages/MyApplications";
import StudentApplicationDetail
  from "./pages/StudentApplicationDetail";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/passport"
          element={
            <ProtectedRoute>
              <Passport />
            </ProtectedRoute>
          }
        />


        <Route
          path="/proof-graph"
          element={
            <ProtectedRoute>
              <ProofGraph />
            </ProtectedRoute>
          }
        />

        <Route
  path="/evidence"
  element={
    <ProtectedRoute>
      <Evidence />
    </ProtectedRoute>
  }
/>

<Route
  path="/opportunities"
  element={
    <ProtectedRoute>
      <Opportunities />
    </ProtectedRoute>
  }
/>

<Route
  path="/opportunities/:id"
  element={
    <ProtectedRoute>
      <OpportunityDetail />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/dashboard"
  element={
    <ProtectedRoute>
      <RecruiterDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/opportunities"
  element={
    <ProtectedRoute>
      <RecruiterOpportunities />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/opportunities/create"
  element={
    <ProtectedRoute>
      <CreateOpportunity />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/candidates"
  element={<RecruiterCandidates />}
/>

<Route
  path="/recruiter/candidates/:id"
  element={
    <RecruiterCandidateDetail />
  }
/>

<Route
  path="/student/applications"
  element={
    <MyApplications />
  }
/>

<Route
  path="/student/applications/:id"
  element={
    <StudentApplicationDetail />
  }
/>

      </Routes>

    </BrowserRouter>
  );
}


export default App;