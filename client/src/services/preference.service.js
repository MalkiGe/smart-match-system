import api from "../api/axios.js";

export const createPreferences = async (data, token) => {
  const response = await api.post("/preference", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMyPreferences = async (token) => {
  const response = await api.get("/preference/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
