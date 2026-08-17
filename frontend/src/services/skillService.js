import api from "./api";


export const getAvailableSkills = async () => {
  const response = await api.get("/skills/");
  return response.data;
};


export const getMySkills = async () => {
  const response = await api.get("/skills/mine/");
  return response.data;
};


export const addMySkill = async (skillData) => {
  const response = await api.post(
    "/skills/mine/",
    skillData
  );

  return response.data;
};