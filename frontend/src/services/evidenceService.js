import api from "./api";

export const getMyEvidence = async () => {
  const response = await api.get("/evidence/");
  return response.data;
};

export const createEvidence = async (evidenceData) => {
  const response = await api.post(
    "/evidence/",
    evidenceData
  );

  return response.data;
};

export const deleteEvidence = async (id) => {
  await api.delete(`/evidence/${id}/`);
};