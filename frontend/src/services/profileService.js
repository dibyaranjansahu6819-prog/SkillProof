import api from "./api";


export const getMyProfile = async () => {
  const response = await api.get("/profile/");
  return response.data;
};


export const updateMyProfile = async (profileData) => {
  const response = await api.put(
    "/profile/",
    profileData
  );

  return response.data;
};