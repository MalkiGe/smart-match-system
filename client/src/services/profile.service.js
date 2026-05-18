import api from "../api/axios.js";

export const createProfile = async (data, token) => {
  const response = await api.post("/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMyProfile = async (token) => {
  const response = await api.get("/profile/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
