import api from "./api";


export const getMyProfile = async () => {
  const response = await api.get("/profile/");
  return response.data;
};


export const getMySkills = async () => {
  const response = await api.get("/skills/mine/");
  return response.data;
};


export const getMyEvidence = async () => {
  const response = await api.get("/evidence/");
  return response.data;
};


export const getMyProofGraph = async () => {
  const response = await api.get(
    "/skills/proof-graph/"
  );

  return response.data;
};


export const getSkillConfidence = async (skillId) => {
  const response = await api.get(
    `/skills/${skillId}/confidence/`
  );

  return response.data;
};