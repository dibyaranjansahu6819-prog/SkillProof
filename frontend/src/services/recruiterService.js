import api from "./api";


export const getRecruiterDashboard = async () => {
  const response = await api.get(
    "/opportunities/recruiter/dashboard/"
  );

  return response.data;
};

export const getRecruiterOpportunities = async () => {

  const response = await api.get(
    "/opportunities/recruiter/"
  );

  return response.data;
};

export const createRecruiterOpportunity = async (
  data
) => {

  const response = await api.post(
    "/opportunities/recruiter/create/",
    data
  );

  return response.data;
};