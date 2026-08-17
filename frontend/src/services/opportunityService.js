import api from "./api";


export const getOpportunities = async () => {
  const response = await api.get(
    "/opportunities/"
  );

  return response.data;
};


export const getOpportunityMatch = async (
  opportunityId
) => {
  const response = await api.get(
    `/opportunities/${opportunityId}/match/`
  );

  return response.data;
};

export const getOpportunitySkillGaps = async (
  opportunityId
) => {
  const response = await api.get(
    `/opportunities/${opportunityId}/skill-gaps/`
  );

  return response.data;
};

export const getOpportunityRoadmap = async (
  opportunityId
) => {
  const response = await api.get(
    `/opportunities/${opportunityId}/roadmap/`
  );

  return response.data;
};

export const applyToOpportunity = async (
  opportunityId,
  applicationData
) => {

  const response = await api.post(
    `/opportunities/${opportunityId}/apply/`,
    applicationData
  );

  return response.data;
};