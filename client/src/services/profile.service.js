import api from "../api/axios.js";

export const getMyProfile = async (token) => {
  const response = await api.get("/api/profile/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
