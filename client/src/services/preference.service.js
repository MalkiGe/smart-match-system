import api from "../api/axios.js";

export const createPreferences = async (data, token) => {
  const response = await api.post("/api/preference", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
